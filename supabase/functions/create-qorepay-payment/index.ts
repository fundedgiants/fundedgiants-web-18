
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { orderId, totalPrice, customer, currency, redirectUrl } = await req.json();

    if (!orderId || !totalPrice || !customer || !currency || !redirectUrl) {
      return new Response(JSON.stringify({ error: 'Missing required payment details.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    const QOREPAY_SECRET_KEY = Deno.env.get('QOREPAY_SECRET_KEY');
    if (!QOREPAY_SECRET_KEY) {
        console.error('QorePay secret key is not set.');
        return new Response(JSON.stringify({ error: 'Payment provider not configured.' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500,
        });
    }

    const response = await fetch('https://gate.qorepay.com/api/v1/payments/bank-transfer', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${QOREPAY_SECRET_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            amount: totalPrice,
            currency,
            customer,
            meta: { order_id: orderId },
            redirect_url: redirectUrl
        })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'QorePay payment initiation failed');
    }

    // Update the order with the payment reference
    await supabase
      .from('orders')
      .update({ payment_provider_invoice_id: data.data.payment_reference })
      .eq('id', orderId);

    return new Response(JSON.stringify(data.data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error creating QorePay payment:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
