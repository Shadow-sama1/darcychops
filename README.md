# Darcy Chops

A responsive, single-page Angular storefront for Darcy Chops. It is rendered with Angular SSR and prerendered at `/`; the WhatsApp order flow works without an API.

## Requirements

- Node.js 20.19+ (Node 22+ recommended)
- npm

## Setup and local development

```powershell
npm install
npm start
```

Open `http://localhost:4200`. To create the production SSR and prerender build:

```powershell
npm run build
```

Angular prerenders the `/` route into `dist/darcy-chops/browser`. To run the production Node/Express SSR server:

```powershell
npm run start:ssr
```

The server listens on port `4000` by default; set `PORT` to change it. Run the focused project tests with `npm test`.

## Deployment

### Vercel (static prerender)

Import the project into Vercel. The included `vercel.json` builds the app and deploys the prerendered browser output. This is a static deployment of the server-rendered `/` page; the optional enquiry API is not enabled on Vercel.

### Node host (SSR and optional API)

Deploy the project to a Node host, install dependencies, run `npm run build`, then run `npm run start:ssr`. The Express server serves static assets and renders the app for incoming requests.

The optional `POST /api/enquiry` endpoint is disabled by default. To enable it on a Node host, set `ENABLE_ENQUIRY_API=true` in the server environment and restart the process. It accepts JSON `{ "name": "...", "phone": "...", "message": "..." }`, validates lengths and phone format, allows five requests per IP per 15 minutes (in-memory, per server process), and writes accepted enquiries to the server log. Use a persistent shared rate limiter and protected log/email provider for a multi-instance production setup. The storefront does not depend on this endpoint.

## Where to edit

- **WhatsApp number, city, domain, Instagram and hours:** `src/app/config/site.config.ts`. Set `whatsappNumber` to international digits with no `+` (for example `2348012345678`). Replace all bracketed placeholders before launch, including `[DOMAIN]` in the SSR `allowedHosts` list in `angular.json`.
- **Menu, categories and prices:** `MENU_ITEMS` and `MENU_CATEGORIES` in `src/app/config/site.config.ts`.
- **FAQs:** `FAQS` in the same file. The FAQ section and JSON-LD use this shared data.
- **Copy and layout:** `src/app/app.html`; the responsive design tokens and styles are in `src/styles.scss`.
- **Logo and photos:** replace `public/assets/logo.svg`, `logo-light.svg`, `hero-chops.svg`, and `menu/placeholder.svg` with Darcy Chops brand/food photography. Update the image paths and dimensions in `src/app/app.html` if filenames change. Replace the review examples with approved customer reviews.
- **SEO/share image:** update domain placeholders in `src/index.html`, `public/robots.txt`, and `public/sitemap.xml`; replace `public/assets/social-card.png` with a branded 1200×630 share image and update its URL in `src/app/services/seo.service.ts`.
- **Colours/fonts:** edit the custom properties at the top of `src/styles.scss`; Google Fonts are linked in `src/index.html`.

## Launch checklist

- [ ] Replace `[WHATSAPP_NUMBER]` with an international WhatsApp number without `+`.
- [ ] Set `[CITY]`, `[DOMAIN]`, and `[INSTAGRAM]` to real business details.
- [ ] Add final menu photos, prices, logo assets, and real customer reviews.
- [ ] Confirm menu availability, minimum order, delivery areas, lead time and opening hours.
- [ ] Test every WhatsApp CTA and mobile navigation on real devices.
- [ ] Deploy to the chosen host and verify canonical/social preview URLs.
- [ ] Submit `https://[DOMAIN]/sitemap.xml` to Google Search Console.
- [ ] Enable the enquiry API only if a server-side enquiry workflow is needed.
