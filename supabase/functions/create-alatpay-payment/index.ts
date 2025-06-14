
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
  console.log('create-alatpay-payment function invoked.');

  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS preflight request.');
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log(`Handling ${req.method} request.`);
    const { orderId, totalPrice, email, firstName, lastName, phone: rawPhone }: AlatpayRequest = await req.json()
    console.log('Request body parsed:', { orderId, totalPrice, email, firstName, lastName, rawPhone });
    
    if (!rawPhone) {
      console.error('Phone number is missing from the request.');
      throw new Error('Phone number must be provided.');
    }
    
    let phone = rawPhone;
    // Alatpay documentation example uses local Nigerian format (e.g., 08012345678), not E.164.
    // We'll convert Nigerian numbers to that format.
    if (rawPhone.startsWith('+234')) {
      phone = '0' + rawPhone.substring(4);
      console.log(`Converted Nigerian phone number from ${rawPhone} to local format: ${phone}`);
    } else {
      console.log(`Phone number is not a Nigerian number, using as-is: ${rawPhone}`);
    }
    
    const alatpayPrimaryKey = Deno.env.get('ALATPAY_PRIMARY_KEY');
    const alatpayBusinessId = Deno.env.get('ALATPAY_BUSINESS_ID');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');

    if (!alatpayPrimaryKey) console.error('ALATPAY_PRIMARY_KEY secret is missing.');
    if (!alatpayBusinessId) console.error('ALATPAY_BUSINESS_ID secret is missing.');
    if (!supabaseUrl) console.error('SUPABASE_URL secret is missing.');

    if (!alatpayPrimaryKey || !alatpayBusinessId || !supabaseUrl) {
      console.error('Alatpay secrets or SUPABASE_URL are not set in Supabase.');
      throw new Error('Alatpay secrets or SUPABASE_URL are not set in Supabase.')
    }
    console.log('Alatpay secrets and Supabase URL found.');

    const origin = req.headers.get('origin');
    if (!origin) {
      console.error('Origin header is missing from the request.');
      throw new Error('Could not determine app origin from request headers.');
    }
    console.log('Origin found:', origin);

    // 1. Get USD to NGN exchange rate from our database
    const supabaseAdmin = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('Fetching USD_NGN exchange rate from database...');
    const { data: rateData, error: rateError } = await supabaseAdmin
        .from('exchange_rates')
        .select('rate')
        .eq('currency_pair', 'USD_NGN')
        .single()
    
    if (rateError || !rateData) {
        console.error('Failed to fetch exchange rate from DB:', rateError?.message);
        throw new Error('Could not fetch USD to NGN exchange rate. An admin may need to set it in the dashboard.')
    }
    const rate = rateData.rate;
    if (!rate) {
      console.error('Exchange rate is null or undefined in DB response.');
      throw new Error('Could not get exchange rate. An admin may need to set it in the dashboard.')
    }
    console.log('Exchange rate fetched successfully:', rate);

    const ngnAmount = totalPrice * rate;
    const ngnAmountInKobo = Math.ceil(ngnAmount * 100);
    console.log(`Calculated NGN amount: ${ngnAmount.toFixed(2)}, which is ${ngnAmountInKobo} in kobo (from USD ${totalPrice} at rate ${rate})`);

    // 2. Initiate payment with NGN amount
    const callbackUrl = `${supabaseUrl}/functions/v1/alatpay-webhook`;
    console.log('Using webhook callback URL:', callbackUrl);

    const alatpayPayload = {
        amount: ngnAmountInKobo,
        currency: "NGN",
        businessId: alatpayBusinessId,
        email: email,
        phone: phone, // Use the potentially converted phone number
        firstName: firstName,
        lastName: lastName,
        paymentMethods: ["card", "banktransfer"],
        redirectUrl: `${origin}/dashboard`,
        merchantRef: orderId,
        callbackUrl: callbackUrl,
    };
    console.log('Initiating payment with Alatpay. Payload:', JSON.stringify(alatpayPayload, null, 2));

    try {
      console.log('--- DIAGNOSTIC STEP: Testing outbound connectivity to google.com ---');
      const googleRes = await fetch('https://www.google.com');
      console.log(`--- DIAGNOSTIC STEP: Successfully connected to google.com. Status: ${googleRes.status} ---`);
    } catch (e) {
      console.error('--- DIAGNOSTIC STEP: Failed to connect to google.com ---', e);
    }

    const paymentResponse = await fetch('https://api.alatpay.ng/v1/checkout/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${alatpayPrimaryKey}`,
            'Business-Id': alatpayBusinessId,
            'User-Agent': 'Supabase Edge Function',
        },
        body: JSON.stringify(alatpayPayload)
    });
    
    const alatpayResponseText = await paymentResponse.text();
    console.log(`Alatpay API response status: ${paymentResponse.status}`);
    console.log('Alatpay API raw response text:', alatpayResponseText);

    if (!paymentResponse.ok) {
        console.error(`Alatpay payment API returned an error. Status: ${paymentResponse.status}. Response:`, alatpayResponseText);
        try {
            const alatpayResponseJson = JSON.parse(alatpayResponseText);
            throw new Error(alatpayResponseJson.message || 'Failed to initialize Alatpay payment');
        } catch (e) {
            throw new Error(`Failed to initialize Alatpay payment. Raw response: ${alatpayResponseText}`);
        }
    }

    const alatpayResponse = JSON.parse(alatpayResponseText);
    console.log('Alatpay API success response:', JSON.stringify(alatpayResponse, null, 2));

    if (!alatpayResponse.data || !alatpayResponse.data.checkoutUrl) {
      console.error('Invalid Alatpay payment response: checkoutUrl is missing. Response:', JSON.stringify(alatpayResponse, null, 2));
      throw new Error('Could not retrieve payment URL from Alatpay.');
    }
    
    console.log('Successfully got checkout URL:', alatpayResponse.data.checkoutUrl);
    console.log('create-alatpay-payment function finished successfully.');

    return new Response(JSON.stringify({ checkoutUrl: alatpayResponse.data.checkoutUrl }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Full error object in create-alatpay-payment function:', error);
    console.error('Error caught in create-alatpay-payment function:', error.message);
    if (error.cause) {
      console.error('Error cause:', error.cause);
    }
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
