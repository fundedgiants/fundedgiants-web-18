import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const signature = req.headers.get('x-alatpay-signature');
    const secret = Deno.env.get('ALATPAY_WEBHOOK_SECRET');
    const body = await req.text();

    if (!secret) {
      console.warn('ALATPAY_WEBHOOK_SECRET is not set. Skipping signature verification. This is insecure for production.');
    } else if (!signature) {
      console.error('Webhook Error: No signature found in request headers.');
      return new Response('No signature', { status: 400, headers: corsHeaders });
    } else {
      const signingKey = await crypto.subtle.importKey(
        'raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
      );
      const computedSignature = await crypto.subtle.sign('HMAC', signingKey, new TextEncoder().encode(body));
      const computedHash = Array.from(new Uint8Array(computedSignature)).map(b => b.toString(16).padStart(2, '0')).join('');

      if (computedHash !== signature) {
        console.error('Webhook Error: Invalid signature.');
        return new Response('Invalid signature', { status: 401, headers: corsHeaders });
      }
      console.log('Webhook signature verified successfully.');
    }
    
    const payload = JSON.parse(body);
    console.log('AlatPay Webhook payload:', JSON.stringify(payload, null, 2));

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );
    
    const { status, reference, transaction_reference } = payload.data;
    const orderId = reference;

    if (status === 'success') {
      console.log(`Processing successful charge for order: ${orderId}`);
      
      const { error: updateError } = await supabaseClient
        .from('orders')
        .update({ payment_status: 'succeeded', payment_provider_invoice_id: transaction_reference })
        .eq('id', orderId);

      if (updateError) {
        console.error(`Failed to update order ${orderId} to succeeded:`, updateError);
      } else {
        console.log(`Successfully updated order ${orderId} to succeeded.`);
        
        // Asynchronously invoke post-purchase functions
        supabaseClient.functions.invoke('send-purchase-to-crm', {
          body: { order_id: orderId },
        }).then(({ error }) => {
          if (error) console.error(`Error invoking send-purchase-to-crm for order ${orderId}:`, error.message);
          else console.log(`Successfully invoked send-purchase-to-crm for order ${orderId}`);
        });

        supabaseClient.functions.invoke('send-purchase-confirmation', {
          body: { order_id: orderId },
        }).then(({ error }) => {
          if (error) console.error(`Error invoking send-purchase-confirmation for order ${orderId}:`, error.message);
          else console.log(`Successfully invoked send-purchase-confirmation for order ${orderId}`);
        });
      }

    } else if (status === 'failed' || status === 'expired') {
      console.log(`Processing failed/expired charge for order: ${orderId}`);

      const { error: updateError } = await supabaseClient
        .from('orders')
        .update({ payment_status: 'failed' })
        .eq('id', orderId);

      if (updateError) {
        console.error(`Failed to update order ${orderId} to failed:`, updateError);
      } else {
        console.log(`Successfully updated order ${orderId} to failed.`);
      }
    } else {
      console.log(`Received unhandled event status: ${status}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
