
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const publicKey = Deno.env.get("KLASHA_PUBLIC_KEY");
    const businessId = Deno.env.get("KLASHA_BUSINESS_ID");

    if (!publicKey) {
      console.error("KLASHA_PUBLIC_KEY is not set in environment variables.");
      throw new Error("Payment provider configuration is missing.");
    }

    return new Response(JSON.stringify({ publicKey, businessId }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching Klasha config:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
