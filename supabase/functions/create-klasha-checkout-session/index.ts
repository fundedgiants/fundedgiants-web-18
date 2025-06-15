
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const KLASHA_API_URL = 'https://ktest.klasha.com/checkout/v1/payment/charge'; // Using sandbox for now

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { orderId, totalPrice, email, redirectBaseUrl } = await req.json()

    if (!orderId || !totalPrice || !email || !redirectBaseUrl) {
      return new Response(JSON.stringify({ error: 'Missing required payment details.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    if (!supabaseUrl) throw new Error("SUPABASE_URL not found in environment variables.");

    const webhookUrl = `${supabaseUrl}/functions/v1/klasha-webhook`;
    const successUrl = `${redirectBaseUrl}/payment-success?reference=${orderId}`;

    const klashaPayload = {
      tx_ref: orderId,
      amount: totalPrice,
      currency: "USD",
      email: email,
      redirect_url: successUrl,
      callback_url: webhookUrl,
    };
    
    console.log("Klasha Payload:", klashaPayload);

    const klashaSecretKey = Deno.env.get('KLASHA_PRIVATE_KEY')
    if (!klashaSecretKey) {
      throw new Error('Klasha private key not found in secrets.');
    }

    const klashaResponse = await fetch(KLASHA_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': klashaSecretKey,
      },
      body: JSON.stringify(klashaPayload),
    });
    
    const responseData = await klashaResponse.json();
    console.log("Klasha API Response:", responseData);

    if (!klashaResponse.ok || responseData.status === 'failed') {
        const errorMessage = responseData.message || 'Failed to create Klasha checkout session.';
        console.error("Klasha API Error:", errorMessage);
        throw new Error(errorMessage);
    }
    
    if (!responseData.data || !responseData.data.redirect_url) {
        console.error("Klasha API Error: No redirect_url in response", responseData);
        throw new Error('Could not retrieve payment URL from Klasha.');
    }

    return new Response(JSON.stringify({ redirectUrl: responseData.data.redirect_url }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error("Error creating Klasha checkout session:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
