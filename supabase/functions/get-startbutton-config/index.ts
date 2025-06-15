
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

serve(async (_req) => {
  // This is needed for browser-based invocations.
  if (_req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const publicKey = Deno.env.get('STARTBUTTON_PUBLIC_KEY');
    if (!publicKey) {
      throw new Error('StartButton public key not configured in secrets.');
    }
    return new Response(JSON.stringify({ publicKey }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('get-startbutton-config error:', error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
