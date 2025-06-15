
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { discountCode, affiliateCode, basePrice, userId } = await req.json();

    let discountFromCode = 0;
    let discountFromAffiliate = 0;
    let affiliateDataForDiscount = null;
    let discountCodeDataForDiscount = null;

    let affiliateToCredit = null;
    let message = '';

    // 1. Validate affiliate code and determine affiliate to credit
    if (affiliateCode) {
      const { data: affiliateData, error: affiliateError } = await supabase
        .from('affiliates')
        .select('user_id, status, has_discount, affiliate_discount_type, affiliate_discount_value')
        .eq('affiliate_code', affiliateCode)
        .single();

      if (!affiliateError && affiliateData && affiliateData.status === 'approved') {
        affiliateToCredit = affiliateCode;
        if (affiliateData.has_discount) {
            affiliateDataForDiscount = affiliateData;
        }
      }
    }

    // 2. Validate discount code
    if (discountCode) {
        const { data: fetchedDiscountCode, error: discountCodeError } = await supabase
            .from('discount_codes')
            .select('*')
            .eq('code', discountCode)
            .single();

        if (!discountCodeError && fetchedDiscountCode) {
            const now = new Date();
            const isActive = fetchedDiscountCode.is_active;
            const isExpired = fetchedDiscountCode.expires_at && new Date(fetchedDiscountCode.expires_at) < now;
            const usageLimitReached = fetchedDiscountCode.usage_limit && fetchedDiscountCode.times_used >= fetchedDiscountCode.usage_limit;

            if (isActive && !isExpired && !usageLimitReached) {
                discountCodeDataForDiscount = fetchedDiscountCode;
            }
        }
    }
    
    // 3. Calculate potential discounts
    if (affiliateDataForDiscount) {
        if (affiliateDataForDiscount.affiliate_discount_type === 'percentage') {
            discountFromAffiliate = basePrice * (affiliateDataForDiscount.affiliate_discount_value / 100);
        } else {
            discountFromAffiliate = affiliateDataForDiscount.affiliate_discount_value;
        }
    }
    if (discountCodeDataForDiscount) {
        if (discountCodeDataForDiscount.discount_type === 'percentage') {
            discountFromCode = basePrice * (discountCodeDataForDiscount.discount_value / 100);
        } else {
            discountFromCode = discountCodeDataForDiscount.discount_value;
        }
    }

    // 4. Determine which discount to apply
    let finalDiscountAmount = 0;
    let appliedCode = null;

    if (discountFromCode > 0 && discountFromAffiliate > 0) {
      if (discountFromCode <= discountFromAffiliate) {
        finalDiscountAmount = discountFromCode;
        appliedCode = discountCode;
      } else {
        finalDiscountAmount = discountFromAffiliate;
        appliedCode = affiliateCode;
      }
    } else if (discountFromCode > 0) {
      finalDiscountAmount = discountFromCode;
      appliedCode = discountCode;
    } else if (discountFromAffiliate > 0) {
      finalDiscountAmount = discountFromAffiliate;
      appliedCode = affiliateCode;
    }

    // 5. Construct response message
    if (finalDiscountAmount > 0) {
        message = `Code "${appliedCode}" applied successfully.`;
    }
    if (affiliateToCredit) {
        message += ` Sale will be credited to affiliate "${affiliateToCredit}".`;
    }
    
    if (!message) {
         return new Response(JSON.stringify({ error: 'Invalid or expired code(s).' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        });
    }

    return new Response(
      JSON.stringify({ message, discountAmount: finalDiscountAmount, appliedCode, affiliateToCredit }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
