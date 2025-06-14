
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
    if (rawPhone.startsWith('+234')) {
      phone = '0' + rawPhone.substring(4);
      console.log(`Converted Nigerian phone number from ${rawPhone} to local format: ${phone}`);
    } else {
      console.log(`Phone number is not a Nigerian number, using as-is: ${rawPhone}`);
    }
    
    const alatpayPrimaryKey = Deno.env.get('ALATPAY_PRIMARY_KEY');
    const alatpayBusinessId = Deno.env.get('ALATPAY_BUSINESS_ID');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!alatpayPrimaryKey || !alatpayBusinessId || !supabaseUrl || !supabaseServiceRoleKey) {
      const missing = [
        !alatpayPrimaryKey && 'ALATPAY_PRIMARY_KEY',
        !alatpayBusinessId && 'ALATPAY_BUSINESS_ID',
        !supabaseUrl && 'SUPABASE_URL',
        !supabaseServiceRoleKey && 'SUPABASE_SERVICE_ROLE_KEY'
      ].filter(Boolean).join(', ');
      console.error(`Missing environment variables: ${missing}`);
      throw new Error(`Server configuration error: Missing required secrets.`);
    }
    console.log('All required secrets and environment variables are present.');

    const origin = req.headers.get('origin');
    if (!origin) {
      console.error('Origin header is missing from the request.');
      throw new Error('Could not determine app origin from request headers.');
    }
    console.log('Origin found:', origin);

    // 1. Get USD to NGN exchange rate from our database
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

    console.log('Fetching USD_NGN exchange rate from database...');
    const { data: rateData, error: rateError } = await supabaseAdmin
        .from('exchange_rates')
        .select('rate')
        .eq('currency_pair', 'USD_NGN')
        .single();
    
    if (rateError || !rateData || !rateData.rate) {
        const dbError = rateError?.message || 'Rate not found or is null.';
        console.error('Failed to fetch exchange rate from DB:', dbError);
        throw new Error('Could not fetch USD to NGN exchange rate. Please contact support.');
    }
    const rate = rateData.rate;
    console.log('Exchange rate fetched successfully:', rate);

    const ngnAmount = totalPrice * rate;
    const ngnAmountInKobo = Math.ceil(ngnAmount * 100);
    console.log(`Calculated NGN amount: ${ngnAmount.toFixed(2)}, which is ${ngnAmountInKobo} in kobo (from USD ${totalPrice} at rate ${rate})`);

    // 2. Initiate payment with NGN amount
    const callbackUrl = `${supabaseUrl}/functions/v1/alatpay-webhook`;
    const redirectUrl = `${origin}/dashboard`;
    console.log('Using redirect URL:', redirectUrl);
    console.log('Using webhook callback URL:', callbackUrl);

    const alatpayPayload = {
        amount: ngnAmountInKobo,
        currency: "NGN",
        businessId: alatpayBusinessId,
        email: email,
        phone: phone,
        firstName: firstName,
        lastName: lastName,
        paymentMethods: ["card", "banktransfer"],
        redirectUrl: redirectUrl,
        merchantRef: orderId,
        callbackUrl: callbackUrl,
    };
    
    console.log('Preparing to call Alatpay API.');
    const alatpayApiUrl = 'https://live.alatpay.ng/api/v1/checkout/create';
    console.log('Endpoint:', alatpayApiUrl);
    console.log('Payload:', JSON.stringify(alatpayPayload, null, 2));

    let paymentResponse;
    try {
      paymentResponse = await fetch(alatpayApiUrl, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'x-api-key': `${alatpayPrimaryKey}`,
          },
          body: JSON.stringify(alatpayPayload)
      });
    } catch (networkError) {
      console.error('Fatal network error while calling Alatpay API:', networkError);
      throw new Error(`A network error occurred while trying to connect to the payment gateway. Please contact support. Details: ${networkError.message}`);
    }
    
    const responseBodyText = await paymentResponse.text();
    console.log(`Alatpay API response status: ${paymentResponse.status}`);
    console.log('Alatpay API raw response body:', responseBodyText);

    if (!paymentResponse.ok) {
        console.error(`Alatpay API returned a non-OK status (${paymentResponse.status}).`);
        try {
            const errorJson = JSON.parse(responseBodyText);
            throw new Error(errorJson.message || `Alatpay returned status ${paymentResponse.status}`);
        } catch (e) {
            throw new Error(`Failed to initialize payment. Alatpay returned a non-JSON error: ${responseBodyText}`);
        }
    }

    const alatpayResponse = JSON.parse(responseBodyText);
    console.log('Alatpay API success response parsed:', JSON.stringify(alatpayResponse, null, 2));

    if (!alatpayResponse.data || !alatpayResponse.data.checkoutUrl) {
      console.error('Invalid Alatpay payment response: checkoutUrl is missing.');
      throw new Error('Could not retrieve payment URL from Alatpay after successful request.');
    }
    
    const checkoutUrl = alatpayResponse.data.checkoutUrl;
    console.log('Successfully got checkout URL:', checkoutUrl);
    console.log('create-alatpay-payment function finished successfully.');

    return new Response(JSON.stringify({ checkoutUrl }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
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
