
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'npm:@supabase/supabase-js@2'
import { crypto } from 'https://deno.land/std@0.177.0/crypto/mod.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-alatpay-signature',
}

serve(async (req) => {
  console.log('alatpay-webhook function invoked.');
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const signature = req.headers.get('x-alatpay-signature')
    if (!signature) {
      console.error('Missing x-alatpay-signature header');
      return new Response(JSON.stringify({ error: 'Missing signature' }), { status: 401, headers: corsHeaders })
    }

    const bodyText = await req.text()
    const alatpaySecondaryKey = Deno.env.get('ALATPAY_SECONDARY_KEY')
    if (!alatpaySecondaryKey) {
        console.error('ALATPAY_SECONDARY_KEY is not set');
        throw new Error('Alatpay secondary key is not configured.');
    }

    const key = await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(alatpaySecondaryKey),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    );

    const mac = await crypto.subtle.sign(
        'HMAC',
        key,
        new TextEncoder().encode(bodyText)
    );

    const calculatedSignature = Array.from(new Uint8Array(mac)).map(b => b.toString(16).padStart(2, '0')).join('');

    if (calculatedSignature !== signature) {
        console.error('Invalid signature');
        console.log(`Received: ${signature}, Calculated: ${calculatedSignature}`);
        return new Response(JSON.stringify({ error: 'Invalid signature' }), { status: 401, headers: corsHeaders });
    }
    console.log('Signature verified successfully.');

    const payload = JSON.parse(bodyText);
    console.log('Webhook payload:', JSON.stringify(payload, null, 2));

    const { merchantRef, status } = payload.data;
    const orderId = merchantRef;
    
    if (!orderId) {
        console.error('merchantRef (orderId) is missing in webhook payload');
        return new Response(JSON.stringify({ error: 'Missing merchantRef' }), { status: 400, headers: corsHeaders });
    }
    
    let paymentStatus;
    if (status === 'successful') {
        paymentStatus = 'paid';
    } else if (status === 'failed' || status === 'declined') {
        paymentStatus = 'failed';
    } else {
        console.log(`Unhandled payment status from webhook: ${status}`);
        paymentStatus = 'pending'; // Do not update for other statuses
    }
    
    if (paymentStatus === 'pending') {
         console.log('Webhook status is pending, no update needed.');
         return new Response(JSON.stringify({ message: 'Unhandled status, no update performed.' }), { status: 200, headers: corsHeaders });
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log(`Updating order ${orderId} with payment_status: ${paymentStatus}`);
    const { error: updateError } = await supabaseAdmin
      .from('orders')
      .update({ payment_status: paymentStatus })
      .eq('id', orderId)

    if (updateError) {
      console.error(`Failed to update order ${orderId}:`, updateError.message);
      throw new Error(`Failed to update order status: ${updateError.message}`);
    }

    console.log(`Order ${orderId} updated successfully.`);
    
    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });

  } catch (error) {
    console.error('Error in alatpay-webhook:', error.message);
    if (error.cause) {
      console.error('Error cause:', error.cause);
    }
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
