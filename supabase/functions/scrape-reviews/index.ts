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

    // Scrape multiple pages of reviews from the dedicated reviews URL
    const reviewsBaseUrl = "https://www.booking.com/reviews/ke/hotel/rafiki-house.html";
    const hotelPageUrl = "https://www.booking.com/hotel/ke/rafiki-house.html";

    console.log("Scraping reviews from multiple sources...");

    let allContent = "";
    let scrapeSuccess = false;

    // Strategy 1: Scrape the dedicated reviews page (has more reviews)
    const reviewsUrls = [
      reviewsBaseUrl,
      `${reviewsBaseUrl}?page=2`,
      `${reviewsBaseUrl}?page=3`,
      hotelPageUrl,
    ];

    for (const url of reviewsUrls) {
      try {
        console.log(`Scraping: ${url}`);
        const scrapeResponse = await fetch("https://api.firecrawl.dev/v1/scrape", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${firecrawlKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            url,
            formats: ["markdown"],
            onlyMainContent: false,
            waitFor: 5000,
          }),
        });

        const scrapeData = await scrapeResponse.json();

        if (scrapeResponse.ok && scrapeData.success) {
          const markdown = scrapeData.data?.markdown || scrapeData.markdown || "";
          if (markdown.length > 100) {
            console.log(`Got ${markdown.length} chars from ${url}`);
            allContent += `\n\n--- Reviews from ${url} ---\n\n${markdown}`;
            scrapeSuccess = true;
          }
        } else {
          console.log(`Scrape failed for ${url}:`, scrapeData.error || "unknown");
        }
      } catch (err) {
        console.log(`Error scraping ${url}:`, err);
      }
    }

    // Strategy 2: If direct scrape failed, try web search
    if (!scrapeSuccess) {
      console.log("Direct scrape failed, trying search approach...");

      const searchQueries = [
        "Rafiki House Nanyuki Kenya reviews booking.com",
        "Rafiki House Nanyuki guest reviews ratings",
        "site:booking.com Rafiki House Nanyuki reviews",
      ];

      for (const query of searchQueries) {
        try {
          const searchResponse = await fetch("https://api.firecrawl.dev/v1/search", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${firecrawlKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              query,
              limit: 10,
              scrapeOptions: { formats: ["markdown"] },
            }),
          });

          const searchData = await searchResponse.json();

          if (searchResponse.ok && searchData.data) {
            for (const result of searchData.data) {
              const content = result.markdown || result.description || "";
              if (content.length > 50) {
                allContent += `\n\n--- Search result ---\n\n${content}`;
                scrapeSuccess = true;
              }
            }
          }
        } catch (err) {
          console.log(`Search error for "${query}":`, err);
        }
      }
    }

    if (!scrapeSuccess || allContent.length < 100) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Could not scrape Booking.com reviews. The site may be blocking automated access. You can add reviews manually in the admin panel.",
        }),
        { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Total scraped content: ${allContent.length} chars`);

    // Extract reviews using AI - send more content to capture all reviews
    const reviews = await extractReviewsWithAI(allContent);

    if (reviews.length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Could not parse reviews from scraped content. Try adding them manually.",
          contentPreview: allContent.substring(0, 500),
        }),
        { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Extracted ${reviews.length} reviews total`);

    // Save to database
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);
    const saved = await saveReviews(adminClient, reviews);

    return new Response(
      JSON.stringify({
        success: true,
        reviewsAdded: saved.added,
        reviewsUpdated: saved.updated,
        totalExtracted: reviews.length,
        source: "multi_page_scrape",
      }),
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
    console.error("LOVABLE_API_KEY not available");
    return [];
  }

  try {
    // Use a larger content window to capture more reviews
    // Split into chunks if content is very large to avoid token limits
    const maxChunkSize = 40000;
    const chunks: string[] = [];

    if (content.length <= maxChunkSize) {
      chunks.push(content);
    } else {
      // Split content into manageable chunks
      for (let i = 0; i < content.length; i += maxChunkSize) {
        chunks.push(content.substring(i, i + maxChunkSize));
      }
    }

    const allReviews: Review[] = [];

    for (let i = 0; i < chunks.length; i++) {
      console.log(`Processing chunk ${i + 1}/${chunks.length} (${chunks[i].length} chars)`);

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
              content: `You are a data extraction assistant. Extract ALL guest reviews from the provided content about Rafiki House Nanyuki hotel on Booking.com. Do not skip ANY review. Return ONLY a valid JSON array of review objects. Each review object should have these fields:
- reviewer_name (string, required)
- reviewer_country (string, optional - full country name e.g. "Kenya", "United States", "Portugal")
- review_title (string, optional) 
- positive_text (string, optional - the full positive/liked comments, do NOT truncate)
- negative_text (string, optional - the full negative/disliked comments, do NOT truncate)
- score (number 1-10, optional - the review score)
- stay_date (string, optional - e.g. "January 2025")
- room_type (string, optional)
- traveler_type (string, optional - e.g. "Couple", "Family", "Solo traveler", "Group")

IMPORTANT: Extract EVERY single review you can find. Include the FULL text of positive and negative comments without truncating. If you cannot find any reviews, return an empty array [].
Return ONLY the JSON array, no other text or markdown formatting.`,
            },
            {
              role: "user",
              content: `Extract ALL guest reviews from this Booking.com content about Rafiki House Nanyuki. Do not miss any review:\n\n${chunks[i]}`,
            },
          ],
        }),
      });

      if (!response.ok) {
        console.error(`AI extraction failed for chunk ${i + 1}:`, response.status);
        continue;
      }

      const data = await response.json();
      const text = data.choices?.[0]?.message?.content || "";

      // Extract JSON array from the response
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        console.error(`No JSON array found in AI response for chunk ${i + 1}`);
        continue;
      }

      try {
        const reviews = JSON.parse(jsonMatch[0]);
        console.log(`Chunk ${i + 1}: extracted ${reviews.length} reviews`);
        allReviews.push(...reviews);
      } catch (parseErr) {
        console.error(`JSON parse error for chunk ${i + 1}:`, parseErr);
      }
    }

    // Deduplicate by reviewer name
    const seen = new Set<string>();
    const deduplicated = allReviews.filter((r) => {
      const key = r.reviewer_name?.toLowerCase().trim();
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    console.log(`Total unique reviews after dedup: ${deduplicated.length}`);
    return deduplicated;
  } catch (error) {
    console.error("AI extraction error:", error);
    return [];
  }
}

async function saveReviews(
  client: any,
  reviews: Review[]
): Promise<{ added: number; updated: number }> {
  let added = 0;
  let updated = 0;

  for (const review of reviews) {
    if (!review.reviewer_name) continue;

    // Check if review already exists (by reviewer name)
    const { data: existing } = await client
      .from("reviews")
      .select("id")
      .eq("reviewer_name", review.reviewer_name)
      .maybeSingle();

    if (existing) {
      // Update existing with any new data
      const updateData: any = {};
      if (review.reviewer_country) updateData.reviewer_country = review.reviewer_country;
      if (review.review_title) updateData.review_title = review.review_title;
      if (review.positive_text) updateData.positive_text = review.positive_text;
      if (review.negative_text) updateData.negative_text = review.negative_text;
      if (review.score) updateData.score = review.score;
      if (review.stay_date) updateData.stay_date = review.stay_date;
      if (review.room_type) updateData.room_type = review.room_type;
      if (review.traveler_type) updateData.traveler_type = review.traveler_type;

      if (Object.keys(updateData).length > 0) {
        const { error } = await client
          .from("reviews")
          .update(updateData)
          .eq("id", existing.id);

        if (!error) updated++;
        else console.error("Error updating review:", error);
      }
    } else {
      // Insert new
      const { error } = await client.from("reviews").insert({
        reviewer_name: review.reviewer_name,
        reviewer_country: review.reviewer_country || null,
        review_title: review.review_title || null,
        positive_text: review.positive_text || null,
        negative_text: review.negative_text || null,
        score: review.score || null,
        stay_date: review.stay_date || null,
        room_type: review.room_type || null,
        traveler_type: review.traveler_type || null,
      });

      if (!error) added++;
      else console.error("Error inserting review:", error);
    }
  }

  return { added, updated };
}
