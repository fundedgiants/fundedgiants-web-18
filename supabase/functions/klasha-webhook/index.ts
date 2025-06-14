
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { createHmac } from "https://deno.land/std@0.177.0/node/crypto.ts";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const signature = req.headers.get("x-klasha-signature");
    const webhookSecret = Deno.env.get("KLASHA_WEBHOOK_SECRET");

    if (!signature || !webhookSecret) {
      console.error("Missing signature or webhook secret");
      return new Response("Signature or secret missing", { status: 400 });
    }

    const body = await req.text();
    const hmac = createHmac("sha512", webhookSecret);
    const digest = hmac.update(body).digest("hex");

    if (digest !== signature) {
      console.error("Invalid webhook signature");
      return new Response("Invalid signature", { status: 401 });
    }

    const payload = JSON.parse(body);

    console.log("Received Klasha webhook:", payload.event);

    if (payload.event === "payment.success") {
      const { tx_ref: orderId, status } = payload.data;

      if (status === "successful" && orderId) {
        const supabaseAdmin = createClient(
          Deno.env.get("SUPABASE_URL") ?? "",
          Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
        );

        // Update order status to 'completed'
        const { data: order, error: orderError } = await supabaseAdmin
          .from("orders")
          .update({ payment_status: "completed" })
          .eq("id", orderId)
          .eq("payment_status", "pending")
          .select()
          .single();

        if (orderError) {
          console.error(`Webhook: Order update failed for ${orderId}:`, orderError);
          // If order not found or already processed, it's not a critical error
          if (orderError.code !== 'PGRST116') throw orderError;
        }

        if (order) {
            console.log(`Order ${orderId} updated to completed.`);
            // You can add logic here to create the trading account, send emails, etc.
        } else {
            console.log(`Webhook: Order ${orderId} not found or already processed.`);
        }
      }
    }

    return new Response(JSON.stringify({ status: "success" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Klasha webhook error:", error.message);
    return new Response(`Webhook Error: ${error.message}`, { status: 400 });
  }
});
