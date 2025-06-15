
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const QOREPAY_WEBHOOK_SECRET = Deno.env.get('QOREPAY_WEBHOOK_SECRET');
  // IMPORTANT: QorePay documentation should be checked for the correct signature header.
  const signature = req.headers.get('x-qorepay-signature'); 

  try {
    const body = await req.text();
    
    // TODO: Implement actual signature verification logic from QorePay docs.
    // This is a placeholder. A real implementation would compare the signature
    // with a generated hash of the body and secret key.
    if (!QOREPAY_WEBHOOK_SECRET || !signature) {
      console.warn('Webhook received without signature or secret configured. Skipping validation.');
    }

    const payload = JSON.parse(body);
    const { event, data } = payload;

    // Check if the event is a successful charge
    if (event === 'charge.success') {
      const orderId = data.meta?.order_id;
      const paymentReference = data.payment_reference;

      if (!orderId) {
        console.error('Webhook received for successful charge but missing order_id in metadata.');
        return new Response('Missing order_id', { status: 400 });
      }

      const supabase = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
      );

      const { error } = await supabase
        .from('orders')
        .update({ payment_status: 'completed', payment_provider_invoice_id: paymentReference })
        .eq('id', orderId);

      if (error) {
        console.error(`Error updating order ${orderId}:`, error);
        throw error;
      }
      console.log(`Order ${orderId} marked as completed.`);
    }

    return new Response('Webhook received', { status: 200 });
  } catch (error) {
    console.error('Error processing QorePay webhook:', error.message);
    return new Response(`Webhook error: ${error.message}`, { status: 400 });
  }
});
