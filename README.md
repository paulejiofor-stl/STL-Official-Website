# Standpoint Technology — Official Website

The marketing website for Standpoint Technology Limited (standpointng.com).
Plain HTML, Tailwind CSS and a little vanilla JavaScript. No framework, no database.

## Pages

| Page | Source file | Live address |
|---|---|---|
| Home | `src/pages/index.html` | `/` |
| Services | `src/pages/services.html` | `/services/` |
| Industries & Clients | `src/pages/industries.html` | `/industries/` |
| ServicePoint (B2C) | `src/pages/servicepoint.html` | `/servicepoint/` |
| About | `src/pages/about.html` | `/about/` |
| Contact | `src/pages/contact.html` | `/contact/` |
| Not found | `src/pages/404.html` | any missing page |

Shared pieces (header, footer, the dark "Let's talk" band, client strip) live in `src/partials/`.
Change them once and every page updates on the next build.

## Run it

```bash
npm install
npm run build     # writes the finished site to dist/
npm run dev       # rebuilds CSS on save (re-run build after changing pages or partials)
```

Open `dist/index.html` in a browser, or serve the folder: `npx serve dist`.

## Deploy (Cloudflare Workers)

- Build command: `npm run build`
- Deploy command: `npx wrangler deploy` (settings are in `wrangler.jsonc`, which serves the `dist/` folder)
- `public/_redirects` sends old WordPress and Dorik addresses (e.g. `/about-us/`, `/clients_and_industires`) to the new pages.

## Brand

Colours, logo files and fonts come from the official Standpoint brand kit (logo 05b, "Hive Duo").

| Token | Hex | Use |
|---|---|---|
| `midnight` | `#00163B` | Dark sections |
| `navy` | `#002355` | Headings, buttons, links |
| `slate` | `#183D56` | Body text |
| `signal` | `#F5DF6F` | Highlights on dark, bullets |
| `pink` | `#C84092` | Micro-accents only (dots, dividers, focus) |

Type: **Inter Tight** (headings) + **Inter** (body), self-hosted in `public/assets/fonts/`.
Tokens live in `tailwind.config.js`; reusable styles (buttons, cards, eyebrows) in `src/css/main.css`.

## Common edits

- **Client & partner logos:** transparent PNGs live in `public/assets/logos/`. The scrolling strip is
  `src/partials/clients.html`; the grids are on the Industries and About pages. To add a logo, drop the file in
  and copy one of the existing `<li>` lines.
- **Contact form:** by default it opens the visitor's email app addressed to info@standpointng.com.
  To receive submissions directly, add `data-endpoint="https://…"` (e.g. Formspree or a Cloudflare Pages Function)
  to the `<form>` in `src/pages/contact.html`.
- **Numbers and claims:** stats appear on the Home, About, Services and Industries pages. Search for `250,000`, `150,000` or `data-count` to update them.
