
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { 
      programId, 
      programName, 
      programPrice, 
      totalPrice, // This is now the final, discounted price
      selectedAddons, 
      userId, 
      email, 
      affiliateCode, // This is the affiliate for attribution
      appliedDiscountCode, // The code that gave the discount
      discountAmount // The amount of the discount
    } = await req.json();
    
    const paystackSecretKey = Deno.env.get('PAYSTACK_SECRET_KEY');
    if (!paystackSecretKey) throw new Error("Paystack secret key not found in environment variables.");

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    
    // Create the order record in Supabase
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
        affiliate_code: affiliateCode, // Save the affiliate code for attribution
        applied_discount_code: appliedDiscountCode,
        discount_amount: discountAmount,
      })
      .select()
      .single();

    if (orderError) throw orderError;
    
    // Paystack requires amount in kobo (lowest currency unit)
    const amountInKobo = Math.round(totalPrice * 100);

    const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${paystackSecretKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email,
            amount: amountInKobo,
            reference: order.id, // Use the unique order ID as the reference
            metadata: {
              order_id: order.id,
              user_id: userId
            }
        }),
    });

    const paystackData = await paystackResponse.json();

    if (!paystackResponse.ok || !paystackData.status) {
        console.error('Paystack API error:', paystackData);
        throw new Error(paystackData.message || 'Failed to initialize payment with provider.');
    }
    
    // The official Paystack library for frontend uses an access_code to pop up the payment modal
    // So we return the authorization_url for redirection
    return new Response(JSON.stringify({ url: paystackData.data.authorization_url }), {
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
