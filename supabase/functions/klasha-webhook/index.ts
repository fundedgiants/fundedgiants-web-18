
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

console.log("klasha-webhook function started");

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const signature = req.headers.get('klasha-signature');
    const body = await req.text();
    
    console.log('Klasha webhook received:', body);
    console.log('Klasha signature:', signature);

    const KLASHA_SECRET_KEY = Deno.env.get('KLASHA_SECRET_KEY');
    if (!KLASHA_SECRET_KEY) {
      throw new Error('KLASHA_SECRET_KEY not configured');
    }

    // Parse the webhook payload
    const webhookData = JSON.parse(body);
    console.log('Parsed webhook data:', JSON.stringify(webhookData, null, 2));

    // Verify webhook signature if provided
    if (signature) {
      // Implement signature verification based on Klasha's webhook security
      const crypto = await import('node:crypto');
      const computedSignature = crypto.createHmac('sha256', KLASHA_SECRET_KEY)
        .update(body)
        .digest('hex');
      
      if (signature !== computedSignature) {
        console.error('Invalid webhook signature');
        return new Response('Invalid signature', { status: 400 });
      }
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Extract transaction data
    const { event, data } = webhookData;
    const txRef = data?.tx_ref;
    const status = data?.status;
    const amount = data?.amount;

    if (!txRef) {
      throw new Error('No transaction reference found in webhook');
    }

    // Find the order by payment reference
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('payment_reference', txRef)
      .single();

    if (orderError) {
      console.error('Error finding order:', orderError);
      throw new Error(`Order not found for tx_ref: ${txRef}`);
    }

    if (!order) {
      throw new Error(`No order found with payment reference: ${txRef}`);
    }

    console.log(`Processing webhook for order ${order.id}, event: ${event}, status: ${status}`);

    // Update order status based on webhook event
    let newPaymentStatus = order.payment_status;
    
    switch (event) {
      case 'payment.successful':
      case 'charge.completed':
        newPaymentStatus = 'completed';
        break;
      case 'payment.failed':
      case 'charge.failed':
        newPaymentStatus = 'failed';
        break;
      case 'payment.pending':
        newPaymentStatus = 'pending';
        break;
      default:
        console.log(`Unhandled webhook event: ${event}`);
        break;
    }

    // Update the order status
    const { error: updateError } = await supabaseAdmin
      .from('orders')
      .update({ 
        payment_status: newPaymentStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', order.id);

    if (updateError) {
      console.error('Error updating order:', updateError);
      throw updateError;
    }

    console.log(`Order ${order.id} updated to status: ${newPaymentStatus}`);

    // If payment is successful, trigger post-payment actions
    if (newPaymentStatus === 'completed') {
      console.log(`Payment completed for order ${order.id}, triggering post-payment actions`);
      
      // Send to CRM
      try {
        await supabaseAdmin.functions.invoke('send-purchase-to-crm', {
          body: { order_id: order.id }
        });
        console.log('Successfully triggered CRM function');
      } catch (crmError) {
        console.error('Error triggering CRM function:', crmError);
        // Don't fail the webhook for CRM errors
      }

      // Send purchase confirmation
      try {
        await supabaseAdmin.functions.invoke('send-purchase-confirmation', {
          body: { orderId: order.id }
        });
        console.log('Successfully triggered purchase confirmation');
      } catch (confirmError) {
        console.error('Error triggering purchase confirmation:', confirmError);
        // Don't fail the webhook for confirmation errors
      }
    }

    return new Response(JSON.stringify({ 
      success: true,
      message: 'Webhook processed successfully'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error processing Klasha webhook:', error.message);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
