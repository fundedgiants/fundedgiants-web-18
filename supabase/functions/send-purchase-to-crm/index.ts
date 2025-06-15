import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

console.log("send-purchase-to-crm function script started");

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { order_id } = await req.json();
    if (!order_id) {
      throw new Error("Missing order_id in request body");
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log(`Processing order_id: ${order_id}`);

    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('id', order_id)
      .single();

    if (orderError) throw orderError;
    if (!order) throw new Error(`Order with id ${order_id} not found.`);
    
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', order.user_id)
      .single();

    if (profileError) {
        console.warn(`Could not fetch profile for user ${order.user_id}: ${profileError.message}`);
    }
    
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.getUserById(order.user_id);
    if(authError) throw authError;
    
    // --- Commission Alert Logic ---
    if (order.payment_status === 'completed' && order.affiliate_code) {
        console.log(`Order ${order_id} has affiliate code, preparing commission alert.`);

        const { data: referral, error: referralError } = await supabaseAdmin
            .from('affiliate_referrals')
            .select('commission_amount, affiliate_id')
            .eq('order_id', order_id)
            .single();

        if (referralError) {
            console.error(`Error fetching referral for order ${order_id}:`, referralError.message);
        } else if (referral) {
            const { data: affiliate, error: affiliateError } = await supabaseAdmin
                .from('affiliates')
                .select('user_id, personal_info')
                .eq('id', referral.affiliate_id)
                .single();

            if (affiliateError) {
                console.error(`Error fetching affiliate ${referral.affiliate_id}:`, affiliateError.message);
            } else if (affiliate) {
                const { data: affiliateUser, error: affiliateUserError } = await supabaseAdmin.auth.admin.getUserById(affiliate.user_id);
                
                const customerName = profile?.first_name || 'A customer';

                if (!affiliateUserError && affiliateUser?.user?.email) {
                    const affiliateEmail = affiliateUser.user.email;
                    const affiliateFirstName = (affiliate.personal_info as any)?.firstName || 'Affiliate';

                    console.log(`Invoking send-commission-alert for affiliate ${affiliateEmail}`);
                    supabaseAdmin.functions.invoke('send-commission-alert', {
                        body: {
                            affiliateEmail,
                            affiliateFirstName,
                            commissionAmount: referral.commission_amount,
                            customerName
                        }
                    }).then(({error}) => {
                        if (error) console.error('Error invoking send-commission-alert:', error);
                        else console.log('Successfully invoked send-commission-alert.');
                    });
                } else if (affiliateUserError) {
                    console.error(`Error fetching affiliate user data for ${affiliate.user_id}:`, affiliateUserError.message);
                }
            }
        }
    }
    // --- End Commission Alert Logic ---

    const crmPayload = {
      user: {
        email: authUser.user.email,
        firstName: profile?.first_name,
        lastName: profile?.last_name,
        phone: profile?.phone,
        country: profile?.country,
        address: profile?.address,
        city: profile?.city,
        state: profile?.state,
        zipCode: profile?.zip_code,
      },
      purchase: {
        orderId: order.id,
        programName: order.program_name,
        accountSize: order.program_id,
        platform: order.platform,
        totalPrice: order.total_price,
        addOns: order.selected_addons,
        paymentMethod: order.payment_method,
        purchaseDate: order.created_at
      }
    };
    
    console.log("Constructed CRM Payload (will be sent to CRM API in the future):", JSON.stringify(crmPayload, null, 2));

    return new Response(JSON.stringify({ message: "Payload processed and logged.", crmPayload }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error processing CRM request:', error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
