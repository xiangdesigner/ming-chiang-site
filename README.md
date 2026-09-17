# Ming Chiang Land Economics & Land Management, website

A single-page marketing site with no build step. Open it through any static server; the Three.js module and the self-hosted fonts do not load from `file://`.

```bash
# from this folder
python -m http.server 8080
# then open http://localhost:8080/
```

Deploy by uploading the folder as-is to any static host (Netlify, Vercel, Cloudflare Pages, GitHub Pages, an S3 bucket, or the office's existing web space).

## Files

| Path | What it is |
|---|---|
| `index.html` | The page. Complete and readable without JavaScript. |
| `styles.css` | Tokens, type, layout, components, responsive rules, reduced-motion overrides. |
| `i18n.js` | The bilingual dictionary (Traditional Chinese and English) and the switcher: swaps text in place, remembers the choice in `localStorage` (`mc-lang`), honours `?lang=zh-TW` / `?lang=en`, and fires `mc:lang` so `main.js` rebuilds its text reveals. |
| `main.js` | Lenis smooth scroll plus GSAP ScrollTrigger choreography (hero entrance, masked word reveals, directional clip reveals, self-drawing rules, the dark-section curtain, sticky stack, depth drift and magnetic actions on fine pointers), header state, mobile menu, contact form, plan-view canvas. |
| `hero-model.js` | The Three.js architectural maquette in the hero (ES module via import map, plus two addons: RoomEnvironment and RoundedBoxGeometry). |
| `city-layout.js` | Seeded layout shared by the 3D model and the 2D plan so both show the same site. |
| `assets/fonts/` | Self-hosted Bricolage Grotesque (latin, latin-ext) and a 17-glyph Noto Serif TC subset. Chinese body and display text uses Noto Sans TC from Google Fonts (loaded in `index.html`); the system falls back to PingFang TC / Microsoft JhengHei offline. |
| `assets/img/` | Seven Unsplash photographs plus the hero poster and the plan fallback rendered from the site's own model. Each photograph ships as WebP and progressive JPEG at 1600px and 800px (`name.webp`, `name-800.webp`, `name-800.jpg`, `name.jpg`); the page picks by screen width through `<picture>` and `srcset`. A 24px blurred placeholder is inlined in the markup (`--lqip`) so every frame is filled from the first paint, and the full picture fades in when decoded. Provenance is in `CREDITS.md` and embedded in every file (JPEG comment, WebP EXIF description). To replace a photo, drop in the four variants under the same names, or regenerate them with Pillow at the same sizes. |
| `PRODUCT.md` | Product truth the design was built from. Facts marked `[inferred]` came from the brief, not an interview. |
| `DESIGN.md`, `.impeccable/design.json` | The design system as built, for anyone extending the site. |

External runtime dependencies, all pinned on jsDelivr: gsap 3.13.0, ScrollTrigger 3.13.0, lenis 1.3.11, three 0.170.0 (core plus `examples/jsm` addons). Copy them next to the page if the site must work offline.

## Before going live: replace these placeholders

1. **Portrait of Dr. Su You-De.** In place at `assets/img/founder.jpg` (609x783, converted from the WebP supplied in chat). For crisp rendering on high-density screens, replace it with the original at 1200x1500 or larger under the same name; the section shows a labelled plinth only if the file goes missing.
2. **Chinese names.** The Chinese copy uses 茗強地政與土管, the five entity names (茗強不動產估價師事務所, 茗強都市計畫技師事務所, 茗強地政士事務所, 茗強不動產經紀有限公司, 茗強資產鑑定有限公司), 茗強學院 and 蘇又德, taken from the firm's earlier project repository. Confirm them against the registered names before launch; each lives in `i18n.js` and `index.html` (default text, `<title>`, metadata and the JSON-LD block).
3. **Project photography.** All photographs are licensed stock. Swap in the firm's own offices, projects and team where available. Keep the same aspect ratios. The plan illustration is generated from the model in code; if you change `city-layout.js`, recapture `assets/img/plan.png` so the no-JavaScript fallback matches.
4. **Contact form backend.** The form opens the visitor's mail app with a pre-filled message to mingattorney@gmail.com and stores nothing. Connect it to a form service or server endpoint if inbox delivery is preferred.
5. **Certified Business Valuer.** Rendered in English only; add the Taiwanese credential name if the firm uses one.
6. **Social image.** In place: `assets/img/favicon.svg` (the logo monogram) with `assets/img/favicon.ico` as a fallback. The `og:image` tag points at `assets/img/poster.jpg` (a render of the model); social networks need an absolute URL, so replace it with the full `https://` address at deploy, ideally a 1200x630 crop.

## Languages

The page is written in Traditional Chinese (Taiwan) and served that way to every first-time visitor; English is applied by `i18n.js` when the visitor picks **EN** in the navigation (`繁中 / EN`), when `?lang=en` is in the URL, or when a saved choice exists. Every visible string, attribute (alt, aria-label, iframe title), form message, the page `<title>`, description and Open Graph tags carry a key in `index.html` (`data-i18n`, `data-i18n-attr`) that maps to both languages in `i18n.js`. To change copy, edit both entries of a key in `i18n.js` and mirror the Chinese one into `index.html` (the default text crawlers see). `hreflang` links for `zh-TW`, `en` and `x-default` are in the head; make them absolute URLs at deploy, as with `og:image`.

## The logo and the intro

The company logo was supplied as an image and recreated as an SVG symbol (`mc-logo` in `index.html`) so it can animate and stay sharp at any size. Compare it with the original and adjust the facet colours or the monogram paths if anything differs; drop the original file into `assets/img/` for reference. The intro overlay (`.preloader`) plays once per browser session and is skipped for reduced-motion visitors and without JavaScript. To disable it, delete the `.preloader` block in `index.html`. The logo's blues and gold are kept as brand colours; the page's vermilion accent was chosen before the logo arrived, so consider re-tinting the accent to the logo blue if the two should match.

The same assembly also plays on a loop above "Find your case." (`.logo-loop` in `index.html`), only while it is on screen, and sits still under reduced motion. A GIF export of one cycle is at `assets/img/logo-intro.gif` (560px wide, 4 seconds, loops) for use in email, social posts or presentations; it is not used by the page itself.

## Motion hooks

Everything animated is opted in through attributes in `index.html`, so content can be moved without touching `main.js`: `data-split="words|lede"` (masked word reveal), `data-image-reveal="l|r|u|d"` (clip direction) with optional `data-depth` (slow drift on wide screens), `data-reveal-group="slide-left|slide-right|wipe|soft"` with `data-reveal-item` children, `data-reveal-lines` (line masks per `li`), `data-reveal-soft-group` (opacity-only, keeps the tab order), the `rule-draw` class (top rule draws itself; add `rule-draw--bottom` / `rule-draw--dark`), and `data-magnetic` on primary actions. Inside `#public-sector` every reveal waits half a second for the curtain. All of it collapses to finished states under `prefers-reduced-motion` and without JavaScript.

## Changing content

- Service lists live in the four practice cards under `#services`. Keep each list to one screen; the cards are sized to the viewport on desktop.
- The valuation marquee under `#valuation` is the only marquee on the page by design.
- Colours, type and spacing are CSS custom properties at the top of `styles.css`; `DESIGN.md` explains where each is allowed.
- The massing model and plan are generated from `city-layout.js` with a fixed seed; change the seed there to get a different, equally synthetic site. Building massing, the highlighted tower and the entrance timing live in `hero-model.js`; after changing them, recapture `assets/img/poster.jpg` (the no-WebGL fallback and social image).
