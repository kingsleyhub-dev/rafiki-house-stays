export interface Env {
  SUPABASE_URL: string;
}

const SECURITY_HEADERS: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "SAMEORIGIN",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
};

const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey, x-client-info",
  "Access-Control-Max-Age": "86400",
};

// Cache durations by file type (in seconds)
const CACHE_RULES: Record<string, number> = {
  ".js": 31536000,
  ".css": 31536000,
  ".jpg": 2592000,
  ".jpeg": 2592000,
  ".png": 2592000,
  ".webp": 2592000,
  ".svg": 2592000,
  ".woff2": 31536000,
  ".woff": 31536000,
  ".ttf": 31536000,
  ".ico": 2592000,
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    // Proxy API calls to Supabase Edge Functions: /api/<function-name>
    if (url.pathname.startsWith("/api/")) {
      return handleApiProxy(request, url, env);
    }

    // For all other requests, fetch from origin and add headers
    const response = await fetch(request);
    const newResponse = new Response(response.body, response);

    // Add security headers
    for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
      newResponse.headers.set(key, value);
    }

    // Add cache headers for static assets
    const ext = url.pathname.substring(url.pathname.lastIndexOf("."));
    const cacheDuration = CACHE_RULES[ext];
    if (cacheDuration) {
      newResponse.headers.set(
        "Cache-Control",
        `public, max-age=${cacheDuration}, immutable`
      );
    }

    // HTML pages: no cache, SPA support
    if (
      !ext ||
      ext === ".html" ||
      !url.pathname.includes(".")
    ) {
      newResponse.headers.set(
        "Cache-Control",
        "public, max-age=0, must-revalidate"
      );
    }

    return newResponse;
  },
};

async function handleApiProxy(
  request: Request,
  url: URL,
  env: Env
): Promise<Response> {
  // Extract function name from /api/<function-name>
  const pathParts = url.pathname.replace("/api/", "").split("/");
  const functionName = pathParts[0];

  if (!functionName) {
    return new Response(
      JSON.stringify({ error: "Function name required" }),
      { status: 400, headers: { "Content-Type": "application/json", ...CORS_HEADERS } }
    );
  }

  // Build the Supabase Edge Function URL
  const supabaseUrl = `${env.SUPABASE_URL}/functions/v1/${functionName}`;

  // Forward the request
  const headers = new Headers(request.headers);
  headers.delete("host");

  try {
    const response = await fetch(supabaseUrl, {
      method: request.method,
      headers,
      body: request.method !== "GET" ? request.body : undefined,
    });

    const newResponse = new Response(response.body, response);

    // Add CORS headers to proxied response
    for (const [key, value] of Object.entries(CORS_HEADERS)) {
      newResponse.headers.set(key, value);
    }

    return newResponse;
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to proxy request" }),
      { status: 502, headers: { "Content-Type": "application/json", ...CORS_HEADERS } }
    );
  }
}
