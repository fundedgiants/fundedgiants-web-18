
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';
import crypto from 'https://deno.land/std@0.201.0/node/crypto.ts';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const signature = req.headers.get('x-startbutton-signature');
    const secret = Deno.env.get('STARTBUTTON_SECRET_KEY');
    const body = await req.text();

    if (!secret) {
      throw new Error('STARTBUTTON_SECRET_KEY is not set in environment variables.');
    }

    if (!signature) {
      console.error('Webhook Error: No signature found in request headers.');
      return new Response('No signature', { status: 400, headers: corsHeaders });
    }

    const hash = crypto.createHmac('sha512', secret).update(body).digest('hex');

    if (hash !== signature) {
      console.error('Webhook Error: Invalid signature.');
      return new Response('Invalid signature', { status: 401, headers: corsHeaders });
    }
    
    console.log('Webhook signature verified successfully.');

    const payload = JSON.parse(body);
    console.log('Webhook payload:', JSON.stringify(payload, null, 2));

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );
    
    const { event, data } = payload;
    const orderId = data.reference;

    if (event === 'charge.success') {
      console.log(`Processing successful charge for order: ${orderId}`);
      
      const { error: updateError } = await supabaseClient
        .from('orders')
        .update({ payment_status: 'succeeded', payment_provider_invoice_id: data.id })
        .eq('id', orderId);

      if (updateError) {
        console.error(`Failed to update order ${orderId} to succeeded:`, updateError);
      } else {
        console.log(`Successfully updated order ${orderId} to succeeded.`);
      }

    } else if (event === 'charge.failed') {
      console.log(`Processing failed charge for order: ${orderId}`);

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
      console.log(`Received unhandled event type: ${event}`);
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
