# Rafiki House - Cloudflare Worker

Handles security headers, static asset caching, and API proxying to Supabase Edge Functions.

## Features

- **Security Headers**: HSTS, X-Frame-Options, CSP, etc.
- **Caching**: Optimized cache rules for static assets (JS, CSS, images, fonts)
- **CORS**: Handles preflight requests
- **API Proxy**: Routes `/api/<function-name>` to Supabase Edge Functions

## Setup

```bash
cd cloudflare-worker
npm install
```

## Development

```bash
npm run dev
```

## Deploy

```bash
npm run deploy
```

## API Proxy Usage

Instead of calling Supabase directly, you can call:
- `https://your-worker.workers.dev/api/mpesa-pay`
- `https://your-worker.workers.dev/api/scrape-reviews`

These proxy to your Supabase Edge Functions automatically.

## Environment Variables

Set in Cloudflare dashboard or `wrangler.toml`:
- `SUPABASE_URL` - Your Supabase project URL (already configured)
