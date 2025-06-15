
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { Resend } from "npm:resend@3.4.0";
import { corsHeaders } from '../_shared/cors.ts';

console.log("send-purchase-confirmation function script started");

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { order_id } = await req.json();
    if (!order_id) {
      throw new Error("Missing order_id in request body");
    }

    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
        console.warn('RESEND_API_KEY is not set. Skipping email sending.');
        return new Response(JSON.stringify({ message: "Skipped: RESEND_API_KEY not configured." }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        });
    }

    const resend = new Resend(resendApiKey);

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    
    console.log(`Processing order_id for email: ${order_id}`);

    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('id', order_id)
      .single();

    if (orderError) throw orderError;
    if (!order) throw new Error(`Order with id ${order_id} not found.`);
    
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('first_name')
      .eq('id', order.user_id)
      .single();
    
    if (profileError) console.warn(`Could not fetch profile for user ${order.user_id}: ${profileError.message}`);

    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.getUserById(order.user_id);
    if(authError) throw authError;

    const userEmail = authUser.user.email;
    const firstName = profile?.first_name || 'there';

    const { data, error: emailError } = await resend.emails.send({
      from: 'AudaXious FX <onboarding@resend.dev>',
      to: [userEmail],
      subject: 'Your Purchase Confirmation',
      html: `<h1>Thank you for your purchase, ${firstName}!</h1><p>We've received your payment for the ${order.program_name} - ${order.program_id} challenge.</p><p>Your total price was $${order.total_price}.</p><p>We are setting up your account and will notify you shortly when it's ready.</p><p>Best regards,<br>The AudaXious FX Team</p>`,
    });

    if (emailError) {
      throw emailError;
    }
    
    console.log(`Purchase confirmation email sent to ${userEmail}`, data);

    return new Response(JSON.stringify({ message: "Confirmation email sent successfully." }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error sending confirmation email:', error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
