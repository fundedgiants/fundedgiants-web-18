
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
  lastName:string;
  phone: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('create-klasha-payment function started');
    const { orderId, totalPrice, email, firstName, lastName, phone }: KlashaRequest = await req.json()
    console.log('Request body parsed:', { orderId, totalPrice, email, firstName, lastName, phone });
    
    const klashaSecretKey = Deno.env.get('KLASHA_PRIVATE_KEY')
    if (!klashaSecretKey) {
      console.error('KLASHA_PRIVATE_KEY secret is not set');
      throw new Error('KLASHA_PRIVATE_KEY secret is not set in Supabase.')
    }
    console.log('KLASHA_PRIVATE_KEY found');

    const origin = req.headers.get('origin');
    if (!origin) {
      console.error('Origin header is missing');
      throw new Error('Could not determine app origin from request headers.');
    }
    console.log('Origin found:', origin);

    // 1. Get USD to NGN exchange rate from our database
    const supabaseAdmin = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('Fetching exchange rate...');
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
    if (!rate) {
      console.error('Exchange rate is null or undefined from DB');
      throw new Error('Could not get exchange rate. An admin may need to set it in the dashboard.')
    }
    console.log('Exchange rate fetched:', rate);

    const ngnAmount = totalPrice * rate;
    const ngnAmountInKobo = Math.ceil(ngnAmount * 100); // Klasha might expect amount in kobo
    console.log(`Calculated NGN amount: ${ngnAmount.toFixed(2)}, which is ${ngnAmountInKobo} in kobo (from USD ${totalPrice} at rate ${rate})`);

    // 2. Initiate payment with NGN amount
    const klashaPayload = {
        amount: ngnAmountInKobo,
        currency: "NGN",
        email: email,
        fullname: `${firstName} ${lastName}`,
        phone_number: phone,
        tx_ref: orderId,
        payment_type: "card,bank_transfer",
        callback_url: `${origin}/dashboard`
    };
    console.log('Initiating payment with Klasha. Payload:', JSON.stringify(klashaPayload, null, 2));

    const paymentResponse = await fetch('https://api.klasha.com/v1/payment/charge', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': klashaSecretKey
        },
        body: JSON.stringify(klashaPayload)
    });
    console.log('Klasha API response status:', paymentResponse.status);

    const klashaResponse = await paymentResponse.json();

    if (!paymentResponse.ok) {
        console.error('Klasha payment API error. Response:', JSON.stringify(klashaResponse, null, 2));
        throw new Error(klashaResponse.message || 'Failed to initialize Klasha payment');
    }

    console.log('Klasha API success response:', JSON.stringify(klashaResponse, null, 2));

    if (!klashaResponse.data || !klashaResponse.data.redirect_url) {
      console.error('Invalid Klasha payment response: redirect_url missing. Response:', JSON.stringify(klashaResponse, null, 2));
      throw new Error('Could not retrieve payment URL from Klasha.');
    }
    
    console.log('Successfully got redirect URL:', klashaResponse.data.redirect_url);

    return new Response(JSON.stringify({ redirect_url: klashaResponse.data.redirect_url }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Error in create-klasha-payment function catch block:', error);
    if (error.cause) {
      console.error('Fetch error cause:', error.cause);
    }
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
