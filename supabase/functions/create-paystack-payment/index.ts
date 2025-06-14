
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { orderId, email, amountInKobo } = await req.json();

    if (!orderId || !email || !amountInKobo) {
      return new Response(JSON.stringify({ error: 'Missing required fields: orderId, email, amountInKobo' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }});
    }

    const paystackSecretKey = Deno.env.get('PAYSTACK_SECRET_KEY');
    if (!paystackSecretKey) {
        console.error('PAYSTACK_SECRET_KEY is not set.');
        throw new Error('Payment provider secret key is not configured.');
    }

    const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${paystackSecretKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email,
            amount: amountInKobo,
            reference: orderId,
        }),
    });

    const paystackData = await paystackResponse.json();

    if (!paystackResponse.ok || !paystackData.status) {
        console.error('Paystack API error:', paystackData);
        throw new Error(paystackData.message || 'Failed to initialize payment with provider.');
    }

    await supabaseAdmin
        .from('orders')
        .update({ payment_provider: 'paystack', payment_provider_invoice_id: orderId })
        .eq('id', orderId);

    return new Response(JSON.stringify({ access_code: paystackData.data.access_code }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
    });

  } catch (error) {
    console.error('Error creating Paystack payment:', error.message);
    return new Response(JSON.stringify({ error: `Failed to initialize payment: ${error.message}` }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
