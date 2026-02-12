import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { phoneNumber, amount } = await req.json();

    if (!phoneNumber || !amount) {
      return new Response(
        JSON.stringify({ error: "phoneNumber and amount are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const consumerKey = Deno.env.get("MPESA_CONSUMER_KEY");
    const consumerSecret = Deno.env.get("MPESA_CONSUMER_SECRET");
    const passkey = Deno.env.get("MPESA_PASSKEY");

    if (!consumerKey || !consumerSecret || !passkey) {
      return new Response(
        JSON.stringify({ error: "M-Pesa credentials not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Step 1: Get OAuth token
    const authString = btoa(`${consumerKey}:${consumerSecret}`);
    const tokenRes = await fetch(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        method: "GET",
        headers: { Authorization: `Basic ${authString}` },
      }
    );

    if (!tokenRes.ok) {
      const errText = await tokenRes.text();
      console.error("Token error:", errText);
      return new Response(
        JSON.stringify({ error: "Failed to authenticate with M-Pesa", details: errText }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    // Step 2: Perform STK Push
    const shortcode = "174379";
    const timestamp = new Date()
      .toISOString()
      .replace(/[-T:.Z]/g, "")
      .substring(0, 14);
    const password = btoa(`${shortcode}${passkey}${timestamp}`);

    const stkPayload = {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: Math.ceil(amount),
      PartyA: phoneNumber,
      PartyB: shortcode,
      PhoneNumber: phoneNumber,
      CallBackURL: "https://dqpvnfzjvdesikpuibab.supabase.co/functions/v1/mpesa-pay",
      AccountReference: "RafikiHouse",
      TransactionDesc: "Booking Payment",
    };

    const stkRes = await fetch(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(stkPayload),
      }
    );

    const stkData = await stkRes.json();
    console.log("STK Push response:", JSON.stringify(stkData));

    return new Response(JSON.stringify(stkData), {
      status: stkRes.ok ? 200 : 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("M-Pesa error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: String(error) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
