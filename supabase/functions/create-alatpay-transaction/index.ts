
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders });
    }

    const { orderId, totalPrice, billingInfo, ngnRate, callbackUrl } = await req.json();

    if (!orderId || !totalPrice || !billingInfo || !ngnRate || !callbackUrl) {
      return new Response(JSON.stringify({ error: 'Missing required parameters.' }), { status: 400, headers: corsHeaders });
    }
    
    const secondaryKey = Deno.env.get('ALATPAY_SECONDARY_KEY');
    const businessId = Deno.env.get('ALATPAY_BUSINESS_ID');

    if (!secondaryKey || !businessId) {
      throw new Error('AlatPay server credentials not configured.');
    }

    const amountInKobo = Math.round(totalPrice * ngnRate * 100);

    const payload = {
      business_id: businessId,
      amount: amountInKobo,
      customer_name: `${billingInfo.firstName} ${billingInfo.lastName}`,
      customer_email: billingInfo.email,
      reference: orderId,
      currency: 'NGN',
      callback_url: callbackUrl,
    };

    console.log('AlatPay Request Payload:', JSON.stringify(payload, null, 2));

    const response = await fetch('https://live.alatpay.ng/api/v1/bank/transfer/charge', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${secondaryKey}`,
      },
      body: JSON.stringify(payload),
    });

    const responseData = await response.json();
    console.log('AlatPay Response:', JSON.stringify(responseData, null, 2));

    if (!response.ok || responseData.status !== 'success') {
      throw new Error(responseData.message || 'Failed to create AlatPay transaction.');
    }
    
    const { error: updateError } = await supabaseClient
      .from('orders')
      .update({ payment_provider_invoice_id: responseData.data.reference })
      .eq('id', orderId);

    if (updateError) {
      console.error(`Failed to update order ${orderId} with AlatPay reference:`, updateError);
    }

    return new Response(JSON.stringify(responseData.data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Create AlatPay transaction error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
