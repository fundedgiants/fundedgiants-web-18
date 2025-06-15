
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

const KLASHA_API_URL = 'https://ktest.klasha.com/checkout/v2/checkout/charge'; // Using V2 endpoint

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
    
    const successUrl = `${redirectBaseUrl}/payment-success?reference=${orderId}`;

    const klashaPayload = {
      tx_ref: orderId,
      amount: Math.round(totalPrice * 100), // V2 API expects amount in the smallest currency unit (cents)
      currency: "USD",
      email: email,
      redirect_url: successUrl,
      narration: `Payment for order ${orderId}`,
    };
    
    console.log("Klasha V2 Payload:", klashaPayload);

    const klashaPublicKey = Deno.env.get('KLASHA_PUBLIC_KEY')
    if (!klashaPublicKey) {
      throw new Error('Klasha public key not found in secrets.');
    }

    const klashaResponse = await fetch(KLASHA_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': klashaPublicKey, // V2 checkout uses the public key
      },
      body: JSON.stringify(klashaPayload),
    });
    
    const responseData = await klashaResponse.json();
    console.log("Klasha API V2 Response:", responseData);

    if (!klashaResponse.ok || responseData.status !== 'success') {
        const errorMessage = responseData.message || 'Failed to create Klasha checkout session.';
        console.error("Klasha API Error:", errorMessage, responseData);
        throw new Error(errorMessage);
    }
    
    if (!responseData.data || !responseData.data.checkout_url) {
        console.error("Klasha API Error: No checkout_url in response", responseData);
        throw new Error('Could not retrieve payment URL from Klasha.');
    }

    return new Response(JSON.stringify({ redirectUrl: responseData.data.checkout_url }), {
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
