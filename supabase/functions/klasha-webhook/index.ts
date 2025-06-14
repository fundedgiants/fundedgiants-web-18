
import { createClient, SupabaseClient } from 'npm:@supabase/supabase-js@2'
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createHmac } from 'https://deno.land/std@0.177.0/node/crypto.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-klasha-signature',
}

async function updateOrderStatus(supabase: SupabaseClient, orderId: string, status: string) {
  const { error } = await supabase
    .from('orders')
    .update({ payment_status: status })
    .eq('id', orderId)

  if (error) {
    console.error(`Failed to update order ${orderId} to ${status}:`, error)
    throw error
  }
  console.log(`Order ${orderId} status updated to ${status}`)
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const webhookSecret = Deno.env.get('KLASHA_WEBHOOK_SECRET')
    if (!webhookSecret) throw new Error('KLASHA_WEBHOOK_SECRET secret is not set in Supabase.')

    const signature = req.headers.get('x-klasha-signature')
    if (!signature) throw new Error('Missing x-klasha-signature header.')

    const bodyText = await req.text()
    const hash = createHmac('sha512', webhookSecret).update(bodyText).digest('hex')

    if (hash !== signature) {
      throw new Error('Invalid webhook signature.')
    }
    
    console.log('Klasha webhook signature verified successfully.')
    
    const payload = JSON.parse(bodyText)
    const { tx_ref: orderId, status, payment_status } = payload.data

    if (!orderId) {
        console.error('Webhook payload missing tx_ref:', payload)
        return new Response(JSON.stringify({ error: 'Missing transaction reference' }), { status: 400 })
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const finalStatus = status || payment_status;

    switch (finalStatus) {
      case 'successful':
        await updateOrderStatus(supabaseAdmin, orderId, 'paid')
        break
      case 'failed':
        await updateOrderStatus(supabaseAdmin, orderId, 'failed')
        break
      case 'pending':
        // A pending status might not require an update, but we log it.
        console.log(`Order ${orderId} is pending.`)
        break
      default:
        console.log(`Unhandled Klasha webhook event status: ${finalStatus}`)
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error('Error processing Klasha webhook:', error.message)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
