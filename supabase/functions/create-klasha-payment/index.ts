
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface KlashaRequest {
  orderId: string;
  totalPrice: number; // in USD
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { orderId, totalPrice, email, firstName, lastName, phone }: KlashaRequest = await req.json()
    
    const klashaPublicKey = Deno.env.get('KLASHA_PUBLIC_KEY')
    if (!klashaPublicKey) throw new Error('KLASHA_PUBLIC_KEY secret is not set in Supabase.')

    const origin = req.headers.get('origin');
    if (!origin) throw new Error('Could not determine app origin from request headers.');

    // 1. Get USD to NGN exchange rate from our database
    const supabaseAdmin = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { data: rateData, error: rateError } = await supabaseAdmin
        .from('exchange_rates')
        .select('rate')
        .eq('currency_pair', 'USD_NGN')
        .single()
    
    if (rateError || !rateData) {
        console.error('Failed to fetch exchange rate from DB:', rateError?.message)
        throw new Error('Could not fetch USD to NGN exchange rate. An admin may need to set it in the dashboard.')
    }
    const rate = rateData.rate
    if (!rate) throw new Error('Could not get exchange rate. An admin may need to set it in the dashboard.')

    const ngnAmount = Math.ceil(totalPrice * rate);

    // 2. Initiate payment with NGN amount
    const paymentResponse = await fetch('https://gate.klasha.com/klasha-revamp/v1/payment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': klashaPublicKey
        },
        body: JSON.stringify({
            amount: ngnAmount,
            currency: "NGN",
            email: email,
            fullname: `${firstName} ${lastName}`,
            phone_number: phone,
            tx_ref: orderId,
            payment_type: "card,bank_transfer",
            callback_url: `${origin}/dashboard`
        })
    });

    const klashaResponse = await paymentResponse.json();

    if (!paymentResponse.ok) {
        console.error('Klasha payment API error:', klashaResponse);
        throw new Error(klashaResponse.message || 'Failed to initialize Klasha payment');
    }

    if (!klashaResponse.data || !klashaResponse.data.redirect_url) {
      console.error('Invalid Klasha payment response:', klashaResponse);
      throw new Error('Could not retrieve payment URL from Klasha.');
    }

    return new Response(JSON.stringify({ redirect_url: klashaResponse.data.redirect_url }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Error in create-klasha-payment function:', error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})

