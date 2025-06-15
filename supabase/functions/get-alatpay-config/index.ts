
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

serve(async (_req) => {
  // This is needed for browser-based invocations.
  if (_req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const publicKey = Deno.env.get('ALATPAY_PRIMARY_KEY');
    const businessId = Deno.env.get('ALATPAY_BUSINESS_ID');
    if (!publicKey || !businessId) {
      throw new Error('AlatPay config not found in secrets.');
    }
    return new Response(JSON.stringify({ publicKey, businessId }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('get-alatpay-config error:', error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
