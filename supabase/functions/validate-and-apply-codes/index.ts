
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { totalInitialPrice, promoCode } = await req.json();
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    if (!promoCode) {
      return new Response(JSON.stringify({ error: 'Please enter a code.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    let discountFromDiscountCode = 0;
    let discountFromAffiliate = 0;

    // 1. Validate as a standard discount code
    const { data: dc, error: dcError } = await supabaseAdmin
      .from('discount_codes')
      .select('*')
      .eq('code', promoCode)
      .eq('is_active', true)
      .single();

    if (dc && (!dc.expires_at || new Date(dc.expires_at) > new Date())) {
      if (dc.discount_type === 'percentage') {
        discountFromDiscountCode = totalInitialPrice * (dc.discount_value / 100);
      } else {
        discountFromDiscountCode = dc.discount_value;
      }
    }

    // 2. Validate as an affiliate code that provides a discount
    const { data: af, error: afError } = await supabaseAdmin
      .from('affiliates')
      .select('*')
      .eq('affiliate_code', promoCode)
      .eq('status', 'approved')
      .single();
    
    if (af && af.has_discount && af.affiliate_discount_value) {
      if (af.affiliate_discount_type === 'percentage') {
        discountFromAffiliate = totalInitialPrice * (af.affiliate_discount_value / 100);
      } else {
        discountFromAffiliate = af.affiliate_discount_value;
      }
    }

    // 3. Determine the best discount to apply from the single entered code
    const finalDiscountAmount = Math.max(discountFromDiscountCode, discountFromAffiliate);
    const appliedDiscountCode = finalDiscountAmount > 0 ? promoCode : null;

    // Ensure discount doesn't exceed total price
    const cappedDiscount = Math.min(finalDiscountAmount, totalInitialPrice);
    
    const finalPrice = totalInitialPrice - cappedDiscount;

    let message = 'Invalid code entered.';
    if(appliedDiscountCode) {
        message = `Code ${appliedDiscountCode} applied successfully.`;
    }

    return new Response(JSON.stringify({
      discountAmount: cappedDiscount,
      finalPrice: finalPrice,
      appliedDiscountCode: appliedDiscountCode,
      message: message
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
