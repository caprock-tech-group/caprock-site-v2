# Caprock Tech — Static Site

This repo is a production-ready static site that deploys on Netlify and talks to your self-hosted AI agent via a Netlify Function.

## Files
- `index.html` — main site (hero, services, pricing, FAQ, contact)
- `thank-you.html` — form success page
- `chat-widget.js` — the floating “Chat with us” bubble
- `netlify/functions/chat.js` — serverless function that proxies to your backend
- `netlify.toml` — routes `/api/chat` to the function
- `assets/logo.svg`, `assets/favicon.png`
- `robots.txt`, `404.html`

## Environment Variables (Netlify)
Set these in **Netlify → Site settings → Environment variables**:
- `BACKEND_URL` — `https://api.caprocktech.com`
- `BACKEND_API_KEY` — your long hex key (same as `/opt/caprock-agent/.env` on your server)

Redeploy after saving env vars.

## Contact details
- **Location:** Amarillo, Texas 79110
- **Email:** info@caprocktech.com
- **Phone:** (806) 316-5070

## Notes
- Google Analytics loads only after cookie consent.
- The form is a Netlify form; submissions appear in your Netlify dashboard.
- Chat calls your Netlify Function at `/api/chat`, which forwards to your private API with the `x-api-key` header.
