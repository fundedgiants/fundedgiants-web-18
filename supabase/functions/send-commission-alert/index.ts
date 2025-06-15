
import { Resend } from "npm:resend@3.4.0";
import { corsHeaders } from '../_shared/cors.ts';

console.log("send-commission-alert function script started");

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
        console.warn('RESEND_API_KEY is not set. Skipping email sending.');
        return new Response(JSON.stringify({ message: "Skipped: RESEND_API_KEY not configured." }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        });
    }

    const resend = new Resend(resendApiKey);

    const { affiliateEmail, affiliateFirstName, commissionAmount, customerName } = await req.json();
    if (!affiliateEmail || !affiliateFirstName || commissionAmount === undefined || !customerName) {
      throw new Error("Missing required parameters in request body");
    }
    
    const formattedCommission = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(commissionAmount);

    const { data, error: emailError } = await resend.emails.send({
      from: 'AudaXious FX <onboarding@resend.dev>',
      to: [affiliateEmail],
      subject: `You've earned a commission!`,
      html: `<h1>Congratulations, ${affiliateFirstName}!</h1>
             <p>You've just earned a commission of <strong>${formattedCommission}</strong> from a purchase made by ${customerName}.</p>
             <p>The commission is now pending and will be available for payout according to our terms.</p>
             <p>Keep up the great work!</p>
             <p>Best regards,<br>The AudaXious FX Team</p>`,
    });

    if (emailError) {
      throw emailError;
    }
    
    console.log(`Commission alert email sent to ${affiliateEmail}`, data);

    return new Response(JSON.stringify({ message: "Commission alert email sent successfully." }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error sending commission alert email:', error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
