
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AlatpayRequest {
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
    console.log('create-alatpay-payment function started');
    const { orderId, totalPrice, email, firstName, lastName, phone }: AlatpayRequest = await req.json()
    console.log('Request body parsed:', { orderId, totalPrice, email, firstName, lastName, phone });
    
    const alatpayPrimaryKey = Deno.env.get('ALATPAY_PRIMARY_KEY');
    const alatpayBusinessId = Deno.env.get('ALATPAY_BUSINESS_ID');

    if (!alatpayPrimaryKey || !alatpayBusinessId) {
      console.error('ALATPAY_PRIMARY_KEY or ALATPAY_BUSINESS_ID secrets are not set');
      throw new Error('Alatpay secrets are not set in Supabase.')
    }
    console.log('Alatpay secrets found');

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
    const ngnAmountInKobo = Math.ceil(ngnAmount * 100);
    console.log(`Calculated NGN amount: ${ngnAmount.toFixed(2)}, which is ${ngnAmountInKobo} in kobo (from USD ${totalPrice} at rate ${rate})`);

    // 2. Initiate payment with NGN amount
    const alatpayPayload = {
        amount: ngnAmountInKobo,
        currency: "NGN",
        businessId: alatpayBusinessId,
        email: email,
        phone: phone,
        firstName: firstName,
        lastName: lastName,
        paymentMethods: ["card", "banktransfer"],
        redirectUrl: `${origin}/dashboard`,
        merchantRef: orderId,
    };
    console.log('Initiating payment with Alatpay. Payload:', JSON.stringify(alatpayPayload, null, 2));

    const paymentResponse = await fetch('https://live.alatpay.ng/api/v1/checkout/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${alatpayPrimaryKey}`,
            'Business-Id': alatpayBusinessId,
        },
        body: JSON.stringify(alatpayPayload)
    });
    console.log('Alatpay API response status:', paymentResponse.status);

    const alatpayResponse = await paymentResponse.json();

    if (!paymentResponse.ok) {
        console.error('Alatpay payment API error. Response:', JSON.stringify(alatpayResponse, null, 2));
        throw new Error(alatpayResponse.message || 'Failed to initialize Alatpay payment');
    }

    console.log('Alatpay API success response:', JSON.stringify(alatpayResponse, null, 2));

    if (!alatpayResponse.data || !alatpayResponse.data.checkoutUrl) {
      console.error('Invalid Alatpay payment response: checkoutUrl missing. Response:', JSON.stringify(alatpayResponse, null, 2));
      throw new Error('Could not retrieve payment URL from Alatpay.');
    }
    
    console.log('Successfully got checkout URL:', alatpayResponse.data.checkoutUrl);

    return new Response(JSON.stringify({ checkoutUrl: alatpayResponse.data.checkoutUrl }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Error in create-alatpay-payment function catch block:', error);
    if (error.cause) {
      console.error('Fetch error cause:', error.cause);
    }
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
