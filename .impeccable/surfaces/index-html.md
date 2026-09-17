---
version: 1
slug: "index-html"
primary_target: "index.html"
related_targets: []
---

# Surface brief: index.html (home)

Scope: the single-page marketing site for Ming Chiang Land Economics & Land Management. Visitor mode: Persuade.

Audience: public-sector commissioners (agencies, local governments, land offices, courts, schools), private owners and families with a one-time high-stakes land matter, and banks or professionals needing a valuation partner. Job: understand the group's full scope, believe it is licensed and experienced, and make contact. Action: "Contact us" (one label site-wide). Proof on hand: five named licensed entities since 2014, the leader's five qualifications, the categories of public commissioners and project types, the academy, full contact details. Constraints: no invented numbers, clients, testimonials or photos of people presented as staff; English primary with Traditional Chinese used only for generic professional titles.

## Direction contract

THESIS: The architect's white massing model. The firm's whole territory is shown as one studio-lit model on a grey base: every block is a service, the subject site is marked in a single colour, and scrolling lifts the camera from model to plan. It refuses the category default of a navy-and-gold skyline hero followed by three equal service cards.

OWN-WORLD: Cool model-white ground, chipboard-grey base fields, near-black ink, and one accent, the vermilion of a Taiwanese seal, used only for the subject site, the primary action and active state. Depth comes only from offset, soft-blurred shadows as under studio light. Sharp corners everywhere, 1px ink rules, no pills, no glass, no gradients. One family, Bricolage Grotesque with optical sizing, from 12px labels to display; Noto Serif TC only for the five professional titles. Components are blocks and plinths: buttons are solid blocks that press down, active rows lift off the base, inactive states are outlined, active states are solid.

STORY: A commissioner or owner sees in one viewport that a single group holds every licence the work needs; finds their own case inside a stack of four practice areas; sees that valuation reaches machinery, aircraft, IP and enterprises; reads the public-sector record; meets Dr. Su You-De and his five qualifications; learns about the academy and the values; contacts the office.

FIRST VIEWPORT: 72px nav with monogram, five links and a "Contact us" block. Left seven columns: two-line headline "From the land parcel to the enterprise value.", one 17-word subtext, primary block "Contact us" and outlined "Explore services". Right five columns bleeding off the edge: a Three.js massing model, white blocks extruding from a grey base over 1.6s, the subject site in vermilion, tilting up to 5 degrees with the pointer. As the visitor scrolls, the camera lifts to a top-down plan and the model hands off to the next section. Static poster and no tilt under reduced motion or without WebGL.

FORM: Candidate 6 of my ordered list of seven grounded worlds (cadastral map sheet, registration transcript and seal, contour survey, cyanotype plan drawings, aerial land mosaic, massing model, appraisal ledger). Seed key e9f2f4df. Challenger verdicts: movida magazine declined, toyism plate declined, sewing pattern envelope declined, brick instructions declined, split-flap board declined, variable font specimen declined. Raises taken from them: split-flap, one ruled row module governs every index on the page; sewing pattern, outlined-versus-solid state grammar for inactive and active; brick instructions, sequences where the new element arrives in the accent; toyism plate, one shared symbol vocabulary for the five offices; movida magazine, an authored monogram mark rather than a text wordmark; variable font specimen, hierarchy by scale contrast with no ornament.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.

Unresolved: the Chinese name of the company, a portrait of Dr. Su, and the firm's own project photography. Placeholder slots are marked in source.

## Decisions recorded after the finish review

- Headline cut: the contract's "From the land parcel to the enterprise value." ships as "From the land parcel to the enterprise." The shorter line reads cleanly, stays true, and holds two lines at 1440px; the advisor's copy note prompted the cut.
- Marquee kept, gradient edge masks removed: the user's brief asks for a highly animated site and the Taste skill permits one marquee per page; under reduced motion it renders as the static wrapped index.
- Entrance motion trimmed: masked word reveals remain on headings, staggered reveals remain only on true sequences (five offices, five credentials, seven values, two public-sector lists), clip reveals remain on media and the plan panel; paragraphs, details, map and form arrive already visible.
- Bilingual (2026-09-17, later): page rewritten in Traditional Chinese as the default with English as the alternate; `繁中 / EN` switcher added to the navigation; Noto Sans TC added for CJK text with CJK-specific tracking and leading; Chinese names (茗強地政與土管, 蘇又德) taken from the firm's earlier repository.
- Motion pass (2026-09-17, later): reveal grammar diversified per section (directional clips, drawn rules, slide/wipe/line-mask groups, dark-section curtain, hero lede as masked words, nav arrival, staged mobile menu, magnetic primary actions and media depth drift on fine pointers only); paragraphs, details, map and form now also arrive with motion, but opacity-only where they are focusable.
- Practice media re-derived from the model: four isometric canvas renders from city-layout.js, one practice highlighted per card, replacing stock photographs.
- Hero poster and og:image are now a raster capture of the massing model itself; the header no longer uses backdrop blur.
- Portrait slot ships as a marked plinth until a portrait of Dr. Su is supplied; the public-sector photograph is a neutral Taiwanese skyline, not a state institution.
