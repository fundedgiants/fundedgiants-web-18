
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { crypto } from "https://deno.land/std@0.168.0/crypto/mod.ts";
import { encode } from "https://deno.land/std@0.168.0/encoding/hex.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const NOWPAYMENTS_IPN_SECRET = Deno.env.get('NOWPAYMENTS_IPN_SECRET_KEY')

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  // Must clone the request to read the body twice (once for raw text, once for JSON)
  const reqClone = req.clone();

  try {
    const rawBody = await reqClone.text();
    const signatureHeader = req.headers.get('x-nowpayments-sig');

    if (!NOWPAYMENTS_IPN_SECRET) {
      console.error('NOWPAYMENTS_IPN_SECRET_KEY is not set. IPN verification failed. This is insecure.');
      return new Response(JSON.stringify({ error: 'IPN secret not configured' }), {
          status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (!signatureHeader) {
      console.error('Missing x-nowpayments-sig header');
      return new Response(JSON.stringify({ error: 'Missing signature' }), {
          status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const key = await crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(NOWPAYMENTS_IPN_SECRET),
        { name: "HMAC", hash: "SHA-512" },
        false,
        ["sign"]
    );
    const signature = await crypto.subtle.sign(
        "HMAC",
        key,
        new TextEncoder().encode(rawBody)
    );

    const generatedSignatureHex = new TextDecoder().decode(encode(new Uint8Array(signature)));

    if (generatedSignatureHex !== signatureHeader) {
        console.error('Invalid IPN signature');
        return new Response(JSON.stringify({ error: 'Invalid signature' }), {
            status: 401,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }

    console.log('IPN Signature verified successfully.');
    
    // We use the service_role key to bypass RLS for this server-to-server interaction.
    const supabaseAdmin = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const ipnData = await req.json()
    console.log('Received NowPayments IPN:', ipnData)

    const { order_id, payment_status, payment_id } = ipnData

    if (!order_id || !payment_status) {
      console.error('Invalid IPN data received');
      return new Response(JSON.stringify({ error: 'Invalid IPN data' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { error } = await supabaseAdmin
      .from('orders')
      .update({ 
        payment_status: payment_status,
        payment_provider_invoice_id: payment_id ? payment_id.toString() : null,
      })
      .eq('id', order_id)

    if (error) {
      console.error('Error updating order status from IPN:', error)
      return new Response(JSON.stringify({ error: 'Failed to update order' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    console.log(`Order ${order_id} status updated to ${payment_status}`)
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Error processing NowPayments IPN:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
