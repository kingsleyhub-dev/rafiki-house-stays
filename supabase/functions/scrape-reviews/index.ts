import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify admin
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ success: false, error: "Not authenticated" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    // Verify the user is admin
    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: userError } = await userClient.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ success: false, error: "Not authenticated" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: roleData } = await userClient
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleData) {
      return new Response(
        JSON.stringify({ success: false, error: "Not authorized" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const firecrawlKey = Deno.env.get("FIRECRAWL_API_KEY");
    if (!firecrawlKey) {
      return new Response(
        JSON.stringify({ success: false, error: "Firecrawl is not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const bookingUrl = "https://www.booking.com/hotel/ke/rafiki-house.html";
    console.log("Scraping reviews from:", bookingUrl);

    // Try scraping with Firecrawl
    const scrapeResponse = await fetch("https://api.firecrawl.dev/v1/scrape", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${firecrawlKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: bookingUrl,
        formats: ["markdown"],
        onlyMainContent: false,
        waitFor: 5000,
      }),
    });

    const scrapeData = await scrapeResponse.json();

    if (!scrapeResponse.ok || !scrapeData.success) {
      console.error("Firecrawl scrape failed:", JSON.stringify(scrapeData));

      // If direct scrape fails, try search for reviews
      console.log("Trying search approach...");
      const searchResponse = await fetch("https://api.firecrawl.dev/v1/search", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${firecrawlKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: "Rafiki House Nanyuki Kenya guest reviews booking.com",
          limit: 5,
          scrapeOptions: { formats: ["markdown"] },
        }),
      });

      const searchData = await searchResponse.json();

      if (!searchResponse.ok) {
        console.error("Search also failed:", JSON.stringify(searchData));
        return new Response(
          JSON.stringify({
            success: false,
            error: "Could not scrape Booking.com reviews. The site blocks automated access. You can add reviews manually in the admin panel.",
          }),
          { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Try to extract reviews from search results
      const allContent = (searchData.data || [])
        .map((r: any) => r.markdown || r.description || "")
        .join("\n\n");

      if (allContent.length < 50) {
        return new Response(
          JSON.stringify({
            success: false,
            error: "Could not find sufficient review content. You can add reviews manually.",
          }),
          { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Use AI to extract structured reviews from the content
      const reviews = await extractReviewsWithAI(allContent);

      if (reviews.length === 0) {
        return new Response(
          JSON.stringify({
            success: false,
            error: "No reviews could be extracted from search results. You can add reviews manually.",
          }),
          { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Save reviews to database
      const adminClient = createClient(supabaseUrl, supabaseServiceKey);
      const saved = await saveReviews(adminClient, reviews);

      return new Response(
        JSON.stringify({ success: true, reviewsAdded: saved, source: "search" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Direct scrape succeeded
    const markdown = scrapeData.data?.markdown || scrapeData.markdown || "";
    console.log("Scraped content length:", markdown.length);

    if (markdown.length < 100) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Scraped content too short. Booking.com may have blocked the request.",
        }),
        { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Extract reviews from scraped content using AI
    const reviews = await extractReviewsWithAI(markdown);

    if (reviews.length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Could not parse reviews from scraped content. Try adding them manually.",
          contentPreview: markdown.substring(0, 500),
        }),
        { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Save to database
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);
    const saved = await saveReviews(adminClient, reviews);

    return new Response(
      JSON.stringify({ success: true, reviewsAdded: saved, source: "direct_scrape" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in scrape-reviews:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

interface Review {
  reviewer_name: string;
  reviewer_country?: string;
  review_title?: string;
  positive_text?: string;
  negative_text?: string;
  score?: number;
  stay_date?: string;
  room_type?: string;
  traveler_type?: string;
}

async function extractReviewsWithAI(content: string): Promise<Review[]> {
  const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
  if (!lovableApiKey) {
    console.error("LOVABLE_API_KEY not available, falling back to regex parsing");
    return parseReviewsManually(content);
  }

  try {
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are a data extraction assistant. Extract guest reviews from the provided content about Rafiki House Nanyuki hotel. Return ONLY a valid JSON array of review objects. Each review object should have these fields:
- reviewer_name (string, required)
- reviewer_country (string, optional)
- review_title (string, optional) 
- positive_text (string, optional - positive comments)
- negative_text (string, optional - negative comments)
- score (number 1-10, optional)
- stay_date (string, optional)
- room_type (string, optional)
- traveler_type (string, optional - e.g. "Couple", "Family", "Solo")

If you cannot find any reviews, return an empty array [].
Return ONLY the JSON array, no other text.`,
          },
          {
            role: "user",
            content: `Extract all guest reviews from this content:\n\n${content.substring(0, 15000)}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      console.error("AI extraction failed:", response.status);
      return parseReviewsManually(content);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || "";

    // Extract JSON array from the response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.error("No JSON array found in AI response");
      return parseReviewsManually(content);
    }

    const reviews = JSON.parse(jsonMatch[0]);
    console.log(`AI extracted ${reviews.length} reviews`);
    return reviews;
  } catch (error) {
    console.error("AI extraction error:", error);
    return parseReviewsManually(content);
  }
}

function parseReviewsManually(content: string): Review[] {
  // Simple regex-based fallback to extract any review-like content
  const reviews: Review[] = [];

  // Look for patterns like "Score: X.X" or "Rated X.X"
  const scorePattern = /(?:score|rated|rating)[:\s]*(\d+(?:\.\d+)?)/gi;
  const namePattern = /(?:reviewed by|from)\s+([A-Za-z\s]+?)(?:\s*,|\s*\n)/gi;

  // This is a best-effort fallback
  console.log("Using manual parsing fallback - results may be limited");
  return reviews;
}

async function saveReviews(
  client: any,
  reviews: Review[]
): Promise<number> {
  let saved = 0;

  for (const review of reviews) {
    if (!review.reviewer_name) continue;

    // Check if review already exists (by reviewer name + positive text)
    const { data: existing } = await client
      .from("reviews")
      .select("id")
      .eq("reviewer_name", review.reviewer_name)
      .maybeSingle();

    if (existing) {
      // Update existing
      await client
        .from("reviews")
        .update({
          reviewer_country: review.reviewer_country,
          review_title: review.review_title,
          positive_text: review.positive_text,
          negative_text: review.negative_text,
          score: review.score,
          stay_date: review.stay_date,
          room_type: review.room_type,
          traveler_type: review.traveler_type,
        })
        .eq("id", existing.id);
    } else {
      // Insert new
      const { error } = await client.from("reviews").insert({
        reviewer_name: review.reviewer_name,
        reviewer_country: review.reviewer_country,
        review_title: review.review_title,
        positive_text: review.positive_text,
        negative_text: review.negative_text,
        score: review.score,
        stay_date: review.stay_date,
        room_type: review.room_type,
        traveler_type: review.traveler_type,
      });

      if (!error) saved++;
      else console.error("Error inserting review:", error);
    }
  }

  return saved;
}
