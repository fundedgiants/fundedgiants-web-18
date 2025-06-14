
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const NOWPAYMENTS_API_KEY = Deno.env.get('NOWPAYMENTS_API_KEY')
const IPN_CALLBACK_URL = `${Deno.env.get('SUPABASE_URL')}/functions/v1/nowpayments-ipn`

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create a Supabase client with the user's auth token
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    const { orderId, totalPrice } = await req.json()

    if (!orderId || !totalPrice) {
      return new Response(JSON.stringify({ error: 'orderId and totalPrice are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    console.log(`Creating NowPayments invoice for order ${orderId} with price ${totalPrice}`);

    const nowpaymentsResponse = await fetch('https://api.nowpayments.io/v1/invoice', {
      method: 'POST',
      headers: {
        'x-api-key': NOWPAYMENTS_API_KEY!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        price_amount: totalPrice,
        price_currency: 'usd',
        order_id: orderId,
        ipn_callback_url: IPN_CALLBACK_URL,
        is_fixed_rate: true,
      }),
    })

    if (!nowpaymentsResponse.ok) {
      const errorBody = await nowpaymentsResponse.json()
      console.error('NowPayments API error:', errorBody)
      return new Response(JSON.stringify({ error: 'Failed to create NowPayments invoice', details: errorBody }), {
        status: nowpaymentsResponse.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const invoice = await nowpaymentsResponse.json()
    console.log('NowPayments invoice created:', invoice);

    // Update the order with the payment provider invoice ID
    const { error: updateError } = await supabase
      .from('orders')
      .update({ payment_provider_invoice_id: invoice.id.toString() })
      .eq('id', orderId)

    if (updateError) {
      console.error('Error updating order with invoice ID:', updateError)
      // Not returning an error to the user, as the invoice is created. But logging it.
    }

    return new Response(JSON.stringify({ invoice_url: invoice.invoice_url }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Error creating NowPayments invoice:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
