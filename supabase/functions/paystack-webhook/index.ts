
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'npm:@supabase/supabase-js@2'
import { crypto } from 'https://deno.land/std@0.177.0/crypto/mod.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-paystack-signature',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  
  let bodyText = '';
  try {
    const signature = req.headers.get('x-paystack-signature');
    if (!signature) {
      console.error('Missing x-paystack-signature header.');
      return new Response('Signature missing', { status: 400 })
    }

    bodyText = await req.text();
    
    const paystackSecretKey = Deno.env.get('PAYSTACK_SECRET_KEY');
    if (!paystackSecretKey) {
        console.error('PAYSTACK_SECRET_KEY secret is not set.');
        throw new Error('Webhook secret key is not configured.');
    }

    const key = await crypto.subtle.importKey(
        'raw', new TextEncoder().encode(paystackSecretKey),
        { name: 'HMAC', hash: 'SHA-512' },
        false, ['sign']
    );
    const mac = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(bodyText));
    const calculatedSignature = Array.from(new Uint8Array(mac)).map(b => b.toString(16).padStart(2, '0')).join('');

    if (calculatedSignature !== signature) {
      console.error('Invalid Paystack signature.');
      return new Response('Invalid signature', { status: 401 })
    }

    const payload = JSON.parse(bodyText);

    if (payload.event === 'charge.success') {
      const { reference, status, id: transactionId } = payload.data;
      if (status === 'success') {
        const orderId = reference;
        
        const supabaseAdmin = createClient(
          Deno.env.get('SUPABASE_URL') ?? '',
          Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        );

        const { error: updateError } = await supabaseAdmin
          .from('orders')
          .update({ payment_status: 'paid', payment_provider_invoice_id: transactionId.toString() })
          .eq('id', orderId);

        if (updateError) {
          console.error(`Failed to update order ${orderId} from Paystack webhook:`, updateError.message);
          throw new Error(`Database error while updating order: ${updateError.message}`);
        }
        
        console.log(`Order ${orderId} successfully updated to 'paid'.`);
      }
    }

    return new Response('Webhook processed', { status: 200 });

  } catch (error) {
    console.error('Error processing Paystack webhook:', error.message);
    if(bodyText) {
        console.error('Webhook body at time of error:', bodyText);
    }
    return new Response('Webhook handler failed', { status: 500 });
  }
})
