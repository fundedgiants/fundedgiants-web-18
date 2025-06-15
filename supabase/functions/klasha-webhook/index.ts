import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { hmac } from 'https://deno.land/x/hmac@v2.0.1/mod.ts'
import { corsHeaders } from '../_shared/cors.ts'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const klashaSignature = req.headers.get('x-klasha-signature')
    const webhookSecret = Deno.env.get('KLASHA_WEBHOOK_SECRET')

    if (!klashaSignature || !webhookSecret) {
      console.warn('Webhook signature or secret key missing.')
      return new Response('Webhook signature or secret key missing.', { status: 400 })
    }

    const requestBody = await req.text()
    
    const signature = hmac('sha512', webhookSecret, requestBody, 'utf8', 'hex');

    if (signature !== klashaSignature) {
      console.warn('Invalid Klasha webhook signature.')
      return new Response('Invalid signature.', { status: 401 })
    }

    const payload = JSON.parse(requestBody)
    console.log('Klasha webhook payload received:', payload);

    const { txn_status, tx_ref } = payload.data; // Klasha nests data
    const orderId = tx_ref;

    if (!orderId) {
        console.error('Webhook error: tx_ref (orderId) is missing.');
        return new Response('tx_ref is missing.', { status: 400 });
    }

    let payment_status;
    if (txn_status === 'successful') {
      payment_status = 'paid';
    } else if (txn_status === 'failed') {
      payment_status = 'failed';
    } else {
      payment_status = 'pending';
    }
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )
    
    const { error: updateError } = await supabaseClient
      .from('orders')
      .update({ payment_status: payment_status })
      .eq('id', orderId)

    if (updateError) {
      console.error(`Failed to update order ${orderId} status to ${payment_status}:`, updateError)
      return new Response(`Error updating order: ${updateError.message}`, { status: 500 })
    }
    
    console.log(`Order ${orderId} status updated to ${payment_status}`);

    if (payment_status === 'paid') {
      // Asynchronously invoke post-purchase functions.
      // We don't await these so the webhook can respond to Klasha faster.
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

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Klasha webhook error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
