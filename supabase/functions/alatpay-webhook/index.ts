
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'npm:@supabase/supabase-js@2'
import { crypto } from 'https://deno.land/std@0.177.0/crypto/mod.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-alatpay-signature',
}

serve(async (req) => {
  console.log('Alatpay webhook received a request.');

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  let bodyText = '';
  try {
    const signature = req.headers.get('x-alatpay-signature');
    if (!signature) {
      console.error('Missing x-alatpay-signature header. Request rejected.');
      return new Response(JSON.stringify({ error: 'Missing signature' }), { status: 401, headers: corsHeaders })
    }

    bodyText = await req.text();
    console.log('Webhook raw body received:', bodyText);

    const alatpaySecondaryKey = Deno.env.get('ALATPAY_SECONDARY_KEY');
    if (!alatpaySecondaryKey) {
        console.error('ALATPAY_SECONDARY_KEY secret is not set in environment. Cannot verify signature.');
        throw new Error('Webhook security key is not configured on the server.');
    }

    const key = await crypto.subtle.importKey(
        'raw', new TextEncoder().encode(alatpaySecondaryKey),
        { name: 'HMAC', hash: 'SHA-256' },
        false, ['sign']
    );
    const mac = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(bodyText));
    const calculatedSignature = Array.from(new Uint8Array(mac)).map(b => b.toString(16).padStart(2, '0')).join('');

    if (calculatedSignature !== signature) {
        console.error('Invalid signature. Request rejected.');
        console.log(`Received Signature: ${signature}`);
        console.log(`Calculated Signature: ${calculatedSignature}`);
        return new Response(JSON.stringify({ error: 'Invalid signature' }), { status: 401, headers: corsHeaders });
    }
    console.log('Signature verified successfully.');

    const payload = JSON.parse(bodyText);
    console.log('Webhook parsed payload:', JSON.stringify(payload, null, 2));

    if (!payload.data || !payload.data.merchantRef) {
        console.error('merchantRef (orderId) is missing in webhook payload data.');
        return new Response(JSON.stringify({ error: 'Missing merchantRef in payload' }), { status: 400, headers: corsHeaders });
    }

    const { merchantRef: orderId, status } = payload.data;
    
    let paymentStatus;
    switch (status) {
        case 'successful':
            paymentStatus = 'paid';
            break;
        case 'failed':
        case 'declined':
            paymentStatus = 'failed';
            break;
        default:
            console.log(`Received unhandled payment status from webhook: '${status}'. No update will be performed.`);
            return new Response(JSON.stringify({ message: 'Unhandled status, no action taken.' }), { status: 200, headers: corsHeaders });
    }
    
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log(`Attempting to update order ${orderId} with payment_status: ${paymentStatus}`);
    const { error: updateError } = await supabaseAdmin
      .from('orders')
      .update({ payment_status: paymentStatus })
      .eq('id', orderId);

    if (updateError) {
      console.error(`Failed to update order ${orderId}:`, updateError.message);
      throw new Error(`Database error while updating order status: ${updateError.message}`);
    }

    console.log(`Order ${orderId} status updated to '${paymentStatus}' successfully.`);
    
    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });

  } catch (error) {
    console.error('Error processing Alatpay webhook:', error.message);
    if (error.cause) {
      console.error('Error cause:', error.cause);
    }
    if (bodyText) {
      console.error('Webhook body at time of error:', bodyText);
    }
    return new Response(JSON.stringify({ error: 'Webhook processing failed' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
