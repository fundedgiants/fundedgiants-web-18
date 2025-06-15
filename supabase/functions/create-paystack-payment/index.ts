import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { programId, programName, programPrice, totalPrice, selectedAddons, userId, email, affiliateCode } = await req.json();
    const paystackSecretKey = Deno.env.get('PAYSTACK_SECRET_KEY');
    
    if (!paystackSecretKey) throw new Error("Paystack secret key not found in environment variables.");

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
        payment_provider: 'paystack',
        affiliate_code: affiliateCode, // Save the affiliate code
      })
      .select()
      .single();

    if (orderError) throw orderError;

    const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${paystackSecretKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email,
            amount: amountInKobo,
            reference: orderId,
        }),
    });

    const paystackData = await paystackResponse.json();

    if (!paystackResponse.ok || !paystackData.status) {
        console.error('Paystack API error:', paystackData);
        throw new Error(paystackData.message || 'Failed to initialize payment with provider.');
    }

    return new Response(JSON.stringify({ access_code: paystackData.data.access_code }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
    });

  } catch (error) {
    console.error('Error creating Paystack payment:', error.message);
    return new Response(JSON.stringify({ error: `Failed to initialize payment: ${error.message}` }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
