import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { programId, programName, programPrice, totalPrice, selectedAddons, userId, email, affiliateCode } = await req.json();
    const klashaSecretKey = Deno.env.get('KLASHA_SECRET_KEY');
    
    if (!klashaSecretKey) throw new Error("Klasha secret key not found.");

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
        payment_provider: 'klasha',
        affiliate_code: affiliateCode, // Save the affiliate code
      })
      .select()
      .single();

    if (orderError) throw orderError;
    
    const klashaApiUrl = 'https://api.klasha.com/v1/checkouts';
    const callbackUrl = `${Deno.env.get('SUPABASE_URL')}/api/klasha-callback?orderId=${order.id}`;

    const klashaPayload = {
      amount: totalPrice,
      currency: 'USD',
      email: email,
      phone_number: '', // Klasha requires a phone number, you might need to fetch it from user profile
      firstname: '', // Klasha requires a firstname, you might need to fetch it from user profile
      lastname: '', // Klasha requires a lastname, you might need to fetch it from user profile
      redirect_url: callbackUrl,
      payment_options: ['card', 'bank', 'ussd', 'qr_code'],
    };

    const klashaResponse = await fetch(klashaApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${klashaSecretKey}`,
      },
      body: JSON.stringify(klashaPayload),
    });

    const klashaData = await klashaResponse.json();

    if (!klashaResponse.ok) {
      console.error('Klasha API Error:', klashaData);
      throw new Error(klashaData.message || 'Failed to create Klasha checkout session');
    }

    return new Response(
      JSON.stringify({
        checkout_url: klashaData.data.checkout_url,
        order_id: order.id,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
