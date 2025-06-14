
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    console.log("Attempting to fetch Klasha config...");
    const publicKey = Deno.env.get("KLASHA_PUBLIC_KEY");
    const businessId = Deno.env.get("KLASHA_BUSINESS_ID");
    console.log(`KLASHA_PUBLIC_KEY retrieved: ${publicKey ? 'Yes' : 'No'}`);
    console.log(`KLASHA_BUSINESS_ID retrieved: ${businessId ? 'Yes' : 'No'}`);

    if (!publicKey) {
      console.error("KLASHA_PUBLIC_KEY is not set in environment variables.");
      throw new Error("Payment provider configuration is missing.");
    }

    console.log("Successfully fetched Klasha config.");
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
