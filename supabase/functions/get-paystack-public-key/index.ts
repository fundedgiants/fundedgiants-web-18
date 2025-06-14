
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (_req) => {
  if (_req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const publicKey = Deno.env.get('PAYSTACK_PUBLIC_KEY');
    if (!publicKey) {
      throw new Error('PAYSTACK_PUBLIC_KEY is not set in environment variables.');
    }
    
    return new Response(JSON.stringify({ publicKey }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error fetching Paystack public key:', error.message);
    return new Response(JSON.stringify({ error: 'Could not retrieve configuration.' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
})
