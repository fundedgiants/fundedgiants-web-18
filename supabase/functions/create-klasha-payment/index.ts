
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

console.log("create-klasha-payment function started");

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { orderId, totalPrice } = await req.json();
    
    if (!orderId || !totalPrice) {
      throw new Error("Missing orderId or totalPrice in request body");
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log(`Creating Klasha payment for order ${orderId}, amount: ${totalPrice}`);

    // Get order details including customer info
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError) throw orderError;
    if (!order) throw new Error(`Order with id ${orderId} not found.`);

    // Get customer billing info from the order metadata or create default
    const customerInfo = {
      email: order.customer_email || 'customer@example.com',
      first_name: order.customer_first_name || 'Customer',
      last_name: order.customer_last_name || 'Name',
      phone: order.customer_phone || '+2348000000000'
    };

    const KLASHA_SECRET_KEY = Deno.env.get('KLASHA_SECRET_KEY');
    if (!KLASHA_SECRET_KEY) {
      throw new Error('KLASHA_SECRET_KEY not configured');
    }

    // Prepare Klasha payment payload
    const paymentPayload = {
      amount: totalPrice,
      currency: 'NGN',
      email: customerInfo.email,
      tx_ref: `order_${orderId}_${Date.now()}`,
      customer: {
        email: customerInfo.email,
        first_name: customerInfo.first_name,
        last_name: customerInfo.last_name,
        phone: customerInfo.phone
      },
      payment_method: 'bank_transfer',
      redirect_url: `${Deno.env.get('SUPABASE_URL')?.replace('.supabase.co', '.lovableproject.com')}/payment-success?reference=`,
      meta: {
        order_id: orderId,
        program_name: order.program_name,
        account_size: order.program_id
      }
    };

    console.log('Klasha payment payload:', JSON.stringify(paymentPayload, null, 2));

    // Create payment with Klasha
    const response = await fetch('https://gate.klasha.com/api/v1/payments/initiate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${KLASHA_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentPayload),
    });

    const responseData = await response.json();
    console.log('Klasha API response:', JSON.stringify(responseData, null, 2));

    if (!response.ok) {
      throw new Error(`Klasha API error: ${responseData.message || 'Unknown error'}`);
    }

    if (responseData.status !== 'success') {
      throw new Error(`Klasha payment creation failed: ${responseData.message || 'Unknown error'}`);
    }

    // Update order with Klasha transaction reference
    await supabaseAdmin
      .from('orders')
      .update({ 
        payment_reference: responseData.data.tx_ref,
        payment_status: 'pending'
      })
      .eq('id', orderId);

    return new Response(JSON.stringify({
      success: true,
      payment_url: responseData.data.link,
      tx_ref: responseData.data.tx_ref,
      bank_details: responseData.data.bank_details || null
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error creating Klasha payment:', error.message);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
