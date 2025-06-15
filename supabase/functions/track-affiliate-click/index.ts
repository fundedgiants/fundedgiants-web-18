
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req, info) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { affiliateCode } = await req.json()
    if (!affiliateCode) {
      throw new Error('Affiliate code is required.')
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // 1. Find affiliate by code
    const { data: affiliate, error: affiliateError } = await supabaseAdmin
      .from('affiliates')
      .select('id, status')
      .eq('affiliate_code', affiliateCode)
      .single()

    if (affiliateError || !affiliate || affiliate.status !== 'approved') {
      console.warn(`Attempted to track click for invalid or non-approved affiliate code: ${affiliateCode}`)
      // Silently fail to not give information to potential attackers.
      return new Response(JSON.stringify({ message: 'Click processed.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }
    
    // 2. Insert click record
    const userAgent = req.headers.get('user-agent')
    const ipAddress = info.remoteAddr.hostname

    const { error: insertError } = await supabaseAdmin
      .from('affiliate_clicks')
      .insert({
        affiliate_id: affiliate.id,
        user_agent: userAgent,
        ip_address: ipAddress,
      })

    if (insertError) {
      throw insertError
    }

    return new Response(JSON.stringify({ message: 'Click tracked successfully.' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
