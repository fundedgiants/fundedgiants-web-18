import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';


serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { programId, programName, programPrice, totalPrice, selectedAddons, userId, affiliateCode } = await req.json();
    const nowPaymentsApiKey = Deno.env.get('NOWPAYMENTS_API_KEY');

    if (!nowPaymentsApiKey) {
      throw new Error('NOWPayments API key not found.');
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        program_id: programId,
        program_name: programName,
        program_price: programPrice,
        total_price: totalPrice,
        selected_addons: selectedAddons,
        user_id: userId,
        payment_provider: 'nowpayments',
        affiliate_code: affiliateCode, // Save the affiliate code
      })
      .select()
      .single();
    
    if (orderError) throw orderError;
    
    const nowPaymentsUrl = 'https://api.nowpayments.io/v1/invoice';
    const nowPaymentsPayload = {
      price_amount: totalPrice,
      price_currency: 'usd',
      order_id: order.id,
      order_description: `${programName} purchase`,
      ipn_callback_url: `${Deno.env.get('SUPABASE_URL')}/functions/handle-nowpayments-ipn`,
      success_url: `${Deno.env.get('CLIENT_URL')}/success?order_id=${order.id}`,
      cancel_url: `${Deno.env.get('CLIENT_URL')}/cancel?order_id=${order.id}`,
    };

    const nowPaymentsHeaders = {
      'x-api-key': nowPaymentsApiKey,
      'Content-Type': 'application/json',
    };

    const nowPaymentsResponse = await fetch(nowPaymentsUrl, {
      method: 'POST',
      headers: nowPaymentsHeaders,
      body: JSON.stringify(nowPaymentsPayload),
    });

    if (!nowPaymentsResponse.ok) {
      const errorData = await nowPaymentsResponse.json();
      console.error('NOWPayments API Error:', errorData);
      throw new Error(`NOWPayments API Error: ${nowPaymentsResponse.statusText}`);
    }

    const { invoice_url, invoice_id } = await nowPaymentsResponse.json();

    // Update the order with the payment provider invoice ID
    const { error: updateError } = await supabaseAdmin
      .from('orders')
      .update({ payment_provider_invoice_id: invoice_id })
      .eq('id', order.id);

    if (updateError) {
      console.error('Error updating order with invoice ID:', updateError);
      throw updateError;
    }

    return new Response(
      JSON.stringify({ invoice_url }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
