
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { totalInitialPrice, discountCode, affiliateCode } = await req.json();
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    let discountFromDiscountCode = 0;
    let discountFromAffiliate = 0;
    let appliedDiscountCode = null;
    let affiliateForAttribution = null;

    // 1. Validate Discount Code
    if (discountCode) {
      const { data: dc, error: dcError } = await supabaseAdmin
        .from('discount_codes')
        .select('*')
        .eq('code', discountCode)
        .eq('is_active', true)
        .single();

      if (dc && (!dc.expires_at || new Date(dc.expires_at) > new Date())) {
        if (dc.discount_type === 'percentage') {
          discountFromDiscountCode = totalInitialPrice * (dc.discount_value / 100);
        } else {
          discountFromDiscountCode = dc.discount_value;
        }
      }
    }

    // 2. Validate Affiliate Code and check for its discount
    if (affiliateCode) {
      const { data: af, error: afError } = await supabaseAdmin
        .from('affiliates')
        .select('*')
        .eq('affiliate_code', affiliateCode)
        .eq('status', 'approved')
        .single();
      
      if (af) {
        affiliateForAttribution = affiliateCode;
        if (af.has_discount && af.affiliate_discount_value) {
          if (af.affiliate_discount_type === 'percentage') {
            discountFromAffiliate = totalInitialPrice * (af.affiliate_discount_value / 100);
          } else {
            discountFromAffiliate = af.affiliate_discount_value;
          }
        }
      }
    }

    // 3. Determine the best discount to apply
    let finalDiscountAmount = 0;
    if (discountFromDiscountCode > discountFromAffiliate) {
      finalDiscountAmount = discountFromDiscountCode;
      appliedDiscountCode = discountCode;
    } else if (discountFromAffiliate > 0) {
      finalDiscountAmount = discountFromAffiliate;
      appliedDiscountCode = affiliateCode;
    }

    // Ensure discount doesn't exceed total price
    finalDiscountAmount = Math.min(finalDiscountAmount, totalInitialPrice);
    
    const finalPrice = totalInitialPrice - finalDiscountAmount;

    let message = 'No valid code entered.';
    if(appliedDiscountCode) {
        message = `Code ${appliedDiscountCode} applied.`;
    } else if (affiliateForAttribution) {
        message = 'Affiliate code accepted.';
    }

    return new Response(JSON.stringify({
      discountAmount: finalDiscountAmount,
      finalPrice: finalPrice,
      appliedDiscountCode: appliedDiscountCode,
      affiliateCodeToTie: affiliateForAttribution,
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
