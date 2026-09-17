---
name: Ming Chiang Land Economics & Land Management
description: The architect's white massing model, a studio-lit world for a licensed land group
colors:
  model-white: "#F3F4F1"
  model-white-2: "#EBECE8"
  chipboard: "#DEDFD9"
  chipboard-2: "#CFD0CA"
  ink: "#17191C"
  ink-2: "#4B4E53"
  ink-3: "#5C5F64"
  on-dark: "#EDEEEA"
  on-dark-2: "#B6B9B3"
  seal-red: "#C63D2A"
  seal-red-deep: "#A83222"
  plan-panel: "#202226"
  white: "#FFFFFF"
  logo-blue: "#1E6FA9"
  logo-navy: "#12345F"
  logo-word: "#1F5F8B"
  logo-gold: "#D4A62A"
typography:
  display:
    fontFamily: "Bricolage Grotesque, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(2.2rem, 4.6vw, 4.25rem)"
    fontWeight: 600
    lineHeight: 1.02
    letterSpacing: "-0.035em"
  hero:
    fontFamily: "Bricolage Grotesque, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(2.6rem, 5vw, 4.5rem)"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Bricolage Grotesque, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(1.75rem, 3vw, 2.75rem)"
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Bricolage Grotesque, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(1.125rem, 1.5vw, 1.375rem)"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  lede:
    fontFamily: "Bricolage Grotesque, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(1.0625rem, 1.3vw, 1.25rem)"
    fontWeight: 400
    lineHeight: 1.5
  body:
    fontFamily: "Bricolage Grotesque, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Bricolage Grotesque, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 600
    lineHeight: 1.4
  body-zh:
    fontFamily: "Bricolage Grotesque, Noto Sans TC, PingFang TC, Microsoft JhengHei, Heiti TC, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.7
  display-zh:
    fontFamily: "Bricolage Grotesque, Noto Sans TC, PingFang TC, Microsoft JhengHei, Heiti TC, sans-serif"
    fontSize: "clamp(2rem, 4vw, 3.75rem)"
    fontWeight: 700
    lineHeight: 1.18
    letterSpacing: "0.01em"
  licence-zh:
    fontFamily: "Noto Serif TC, Noto Serif CJK TC, PingFang TC, Microsoft JhengHei, serif"
    fontSize: "0.9375rem"
    fontWeight: 500
    letterSpacing: "0.04em"
  logo-word:
    fontFamily: "Noto Sans TC Values, Noto Sans CJK TC, PingFang TC, Microsoft JhengHei, sans-serif"
    fontSize: "24px"
    fontWeight: 500
  logo-letter:
    fontFamily: "Bricolage Grotesque, Helvetica Neue, Arial, sans-serif"
    fontSize: "30px"
    fontWeight: 800
    letterSpacing: "-0.02em"
  hero-mobile:
    fontFamily: "Bricolage Grotesque, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(2.4rem, 10vw, 3.6rem)"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.04em"
  hero-lede:
    fontFamily: "Bricolage Grotesque, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(1.0625rem, 1.35vw, 1.3125rem)"
    fontWeight: 400
    lineHeight: 1.5
  marquee:
    fontFamily: "Bricolage Grotesque, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(1.5rem, 2.6vw, 2.5rem)"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  value:
    fontFamily: "Bricolage Grotesque, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(1.375rem, 2vw, 1.875rem)"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  button:
    fontFamily: "Bricolage Grotesque, Helvetica Neue, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.01em"
  small:
    fontFamily: "Bricolage Grotesque, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.9rem"
    fontWeight: 400
    lineHeight: 1.5
  caption:
    fontFamily: "Bricolage Grotesque, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.4
  brand-sub:
    fontFamily: "Bricolage Grotesque, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.1
rounded:
  none: "0px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "40px"
  section: "clamp(96px, 12vw, 176px)"
  gutter: "clamp(20px, 4vw, 64px)"
components:
  button-primary:
    backgroundColor: "{colors.seal-red}"
    textColor: "{colors.white}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: "0 26px"
    height: "52px"
  button-primary-hover:
    backgroundColor: "{colors.seal-red-deep}"
    textColor: "{colors.white}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: "0 26px"
    height: "52px"
  button-outline-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.model-white}"
  input:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "12px 14px"
    height: "48px"
  index-row:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "28px 12px 28px 0"
  plan-panel:
    backgroundColor: "{colors.plan-panel}"
    textColor: "{colors.on-dark-2}"
    rounded: "{rounded.none}"
---

# Design System: Ming Chiang Land Economics & Land Management

## Overview

**Creative North Star: "The White Massing Model"**

The site is an architect's presentation model under studio light: a cool white ground, a chipboard-grey base, blocks whose only depth comes from real cast shadows, and one subject site picked out in the vermilion of a Taiwanese seal. Every surface, control and list on the page is a block or a plinth on that base. The page begins as the model in three dimensions and, as the visitor scrolls, lifts into plan view; later sections keep the plan's ruled row module as their structure.

The personality is precise, calm and expensive rather than decorative. Density is low: one idea per viewport, generous section spacing, short copy. Hierarchy is carried by scale contrast alone, never by labels, ornament or colour washes. The one deliberate dark passage (the public-sector section) is the same model seen at night in plan; it is the only theme switch on the page.

**Key Characteristics:**
- One accent, used only for the subject site, the primary action and active state.
- Depth only from offset, soft-blurred shadows; no gradients, glass, glows or hairline-plus-shadow combinations.
- Sharp corners everywhere; nothing is rounded or pill-shaped.
- One Latin family (Bricolage Grotesque with optical sizing) from 12px labels to display; Noto Sans TC carries Traditional Chinese copy, Noto Serif TC only the four statutory Taiwanese professional titles.
- Motion is authored once as a system: masked word reveals on headings and ledes, directional clip reveals on media, rules that draw themselves, a sticky practice stack, a curtain into the dark passage and the hero's model-to-plan handoff. Each list has its own reveal grammar (offices slide in with their footprint glyphs drawing, credentials slide from the right, public-sector lists wipe, values rise through line masks, the form fades in place) so no two neighbouring sections move the same way. Mouse-driven effects (magnetic primary actions, media depth drift) exist only on fine pointers above 900px; everything is a finished state without JavaScript and under reduced motion.

## Colors

A cool model-white ground with chipboard-grey fields, near-black ink, and a single vermilion accent.

### Primary
- **Seal Red** (#C63D2A): the subject site in the model, the primary "Contact us" block, active list marks, error text on white or model-white only. Contrast with white text is 5.1:1. Never used for small text on chipboard grey or on the dark section, where it falls below 4.5:1.
- **Seal Red Deep** (#A83222): hover state of the primary block.

### Neutral
- **Model White** (#F3F4F1): page ground, the header once the page has scrolled, paper practice cards.
- **Model White 2** (#EBECE8): reserved secondary tint inside the same family.
- **Chipboard** (#DEDFD9): base fields: grey practice cards, the academy section, the footer, the map placeholder.
- **Chipboard 2** (#CFD0CA): scrollbar thumb; the darkest light-family tint.
- **Ink** (#17191C): all headings and primary text, outline-button hover fill, the dark public-sector passage.
- **Ink 2** (#4B4E53): ledes, descriptions and secondary copy (7.5:1 on model white).
- **Ink 3** (#5C5F64): muted labels, licence names, form hints (4.7:1 on chipboard, 5.7:1 on model white).
- **On Dark** (#EDEEEA) and **On Dark 2** (#B6B9B3): text on the ink passage; secondary text there is tinted from the ink family, never neutral grey.
- **Plan Panel** (#202226): the framed plan figure inside the dark passage.
- **White** (#FFFFFF): only the text on Seal Red blocks and the fill of form fields; never a page or section ground.
- **Logo colours** (facet blue #1E6FA9 and its ramp, monogram navy #12345F, value-word blue #1F5F8B, letter gold #D4A62A): brand-bound, used only inside the company mark and the intro; never for page UI.
- Rules: `rgba(23,25,28,0.14)` hairline, `rgba(23,25,28,0.32)` strong rule, `rgba(237,238,234,0.16)` on dark.

### Named Rules
**The Subject Site Rule.** Vermilion marks exactly one thing per view: the site, the action, or the active row. If two vermilion elements are visible at once, one of them is wrong.

**The Theme Lock.** The page is light. The public-sector passage is the single permitted inversion and is the same model seen in plan; no other section may go dark.

## Typography

**Display Font:** Bricolage Grotesque (with Helvetica Neue, Arial, sans-serif), self-hosted, variable weight 300 to 800, optical sizing on.
**Body Font:** Bricolage Grotesque, the same file.
**Licence Font:** Noto Serif TC 500, a 17-glyph subset that covers only 不動產估價師, 都市計畫技師, 地政士 and 不動產經紀人.
**Chinese Body and Display Font:** Noto Sans TC 400/500/700 from Google Fonts, used only when the page is in Traditional Chinese (`html[lang="zh-TW"]`, the default). Bricolage Grotesque stays first in the stack so Latin words and numerals keep the brand face; CJK glyphs fall through to Noto Sans TC, then PingFang TC and Microsoft JhengHei. In Chinese, headings drop the negative tracking (0.01em), sit at line-height 1.18 and weight 700, body copy runs at 1.7 to 1.75, and the display scale is one step smaller (hero clamp(2.3rem, 4.4vw, 4rem), display clamp(2rem, 4vw, 3.75rem)). Statutory titles show in the language the page is not in: Chinese in serif on the English page, English in Bricolage on the Chinese page.

**Character:** A grotesk with an engineer's condensation at display sizes and a plain, legible text cut at small sizes. Emphasis comes from weight and scale only; there are no italics on the page and no second Latin family.

### Hierarchy
- **Hero** (600, clamp(2.6rem, 5vw, 4.5rem), 1.0, -0.04em): the one headline, two lines on desktop, max-width 660px.
- **Display** (600, clamp(2.2rem, 4.6vw, 4.25rem), 1.02, -0.035em): every section heading, max 14ch, sentence case with a full stop.
- **Headline** (600, clamp(1.75rem, 3vw, 2.75rem), 1.05, -0.03em): practice-card titles.
- **Title** (600, clamp(1.125rem, 1.5vw, 1.375rem), -0.02em): office names in the index; value words use clamp(1.375rem, 2vw, 1.875rem).
- **Lede** (400, clamp(1.0625rem, 1.3vw, 1.25rem), 1.5, Ink 2): the paragraph directly under a heading, max 58ch (44ch in the hero).
- **Body** (400, 1.0625rem, 1.55): descriptions, form text, footer.
- **Label** (600, 0.9375rem): form labels, list titles in the dark passage, nav links (500). Never uppercase, never tracked.
- **Button** (600, 1rem, -0.01em): block labels.
- **Marquee** (600, clamp(1.5rem, 2.6vw, 2.5rem)): the valuation strip words; **Value** (600, clamp(1.375rem, 2vw, 1.875rem)): the seven value words.
- **Small** (0.9rem) for form hints, errors and notes; **Caption** (0.8125rem) for the plan-panel caption; **Brand sub** (0.75rem) for the wordmark's second line. Nothing on the page is set below 0.75rem.
- **Hero on mobile** (600, clamp(2.4rem, 10vw, 3.6rem)); **Hero lede** (clamp(1.0625rem, 1.35vw, 1.3125rem)).
- **Numerals:** tabular figures on telephone, fax and address.

### Named Rules
**The No-Eyebrow Rule.** Headings stand alone. No small uppercase label above or beside a heading, no section numbers, no middle-dot metadata strips.

**The Full-Stop Rule.** Section headings are short sentences ending in a period: "Find your case." "Talk to the office."

## Layout

A 1440px container with a fluid gutter of clamp(20px, 4vw, 64px). Sections are spaced by clamp(96px, 12vw, 176px) top and bottom, with more space above a heading than below it. Desktop compositions are asymmetric two-column grids expressed in fractions: 5/7 for the offices index (left statement sticky at nav height plus 32px), 5/6 for practice cards and leadership, 6/5 for the dark passage, academy and contact. The hero is a 7-column copy block with a 60%-wide stage bleeding off the right edge. Column gaps are clamp(40px, 6vw, 96px) or clamp(40px, 7vw, 120px).

Breakpoints: 1100px collapses the offices and public-sector grids; 900px is the mobile break (nav becomes a full-screen menu, the hero stage drops under the copy at 78vw tall, practice cards stop sticking, all grids go single column); 600px tightens rows and lists. The 72px fixed header (64px on mobile) is transparent over the hero and gains the model-white fill and hairline once the page scrolls 24px.

The page is paced like a studio walkthrough: hero, index, sticky stack, marquee and cinematic band, dark passage, portrait split, grey academy block, contact, footer. No two adjacent sections share a layout family.

## Elevation & Depth

Depth is physical: a block standing on the base casts an offset, soft-blurred shadow, and nothing else creates depth. Surfaces are flat at rest and never combine a visible hairline with a wide shadow.

### Shadow Vocabulary
- **Lift** (`0 18px 40px -14px rgba(23,25,28,0.30), 0 3px 8px -2px rgba(23,25,28,0.10)`): media figures, the portrait plinth, the map, and the primary block on hover.
- **Block** (`0 12px 28px -12px rgba(23,25,28,0.40), 0 2px 4px -1px rgba(23,25,28,0.14)`): the primary block at rest.
- **Press** (`0 4px 10px -6px rgba(23,25,28,0.35)`): any block while pressed, with `translateY(1px) scale(0.97)`.

### Named Rules
**The Studio Light Rule.** Shadows always carry an offset and a blur, never a zero-offset halo and never a hard block shadow. The Three.js hero uses one directional key light with PCF soft shadows for the same reason.

## Shapes

Radius is 0 everywhere: blocks, buttons, inputs, figures, panels, the map frame. Borders are 1px hairlines in the rule colours and are used as ruled row modules (top rule on a list, bottom rule on each row), never as decorative grids. Media is cropped to fixed aspect ratios (4:3 practice media, 4:5 portrait slot and plan panel, 3:2 public photo, 16:10 academy media and map). Reveals use `clip-path: inset()` from the bottom edge; the marquee and band use straight edge masks.

## Components

### Buttons
Blocks that press down. Solid blocks carry the Block shadow at rest and the Lift shadow on hover.
- **Shape:** square (0px), min-height 52px (42px small variant in the header), padding 0 26px, weight 600, one line only.
- **Primary:** Seal Red fill, white text, no border. Hover: Seal Red Deep, `translateY(-2px)`, Lift shadow. Active: `translateY(1px) scale(0.97)`, Press shadow, 140ms strong ease-out.
- **Outline:** transparent fill, 1px strong rule border, Ink text. Hover: Ink fill, Model White text.
- **Busy:** `aria-busy="true"` swaps the label for a progress phrase; cursor progress.
- Hover treatments are gated behind `(hover: hover) and (pointer: fine)`.

### Index Row (offices, credentials, details)
- **Shape:** grid of 20px footprint glyph, body, trailing licence; 28px vertical padding; top strong rule on the list, hairline under each row.
- **Footprint glyph:** each office has its own footprint drawn from the model vocabulary (2x2 site, slab over two blocks, offset parcels, tower beside two blocks, one whole block) as outlined squares; on a fine pointer the glyph fills Seal Red. This outline-versus-solid grammar is the page's state language.
- **Rows do not lift:** they are not links, so they carry no hover elevation.

### Practice Card (sticky stack)
- **Shape:** full-bleed, min-height 100svh on desktop, sticky at top 0, alternating Model White and Chipboard fills, top hairline.
- **Content:** 6/5 grid, a 4:3 photograph with the Lift shadow, headline, lede, two-column service list with 8px ink squares and a single top rule.
- **Recede:** as the next card arrives the previous one scales to 0.94 and darkens through a real ink overlay element (`.stack__dim`, opacity 0 to 0.32); it never becomes transparent.

### Inputs / Fields
- **Style:** white fill, 1px strong rule, 0px radius, 48px min height, 12px 14px padding, label above in Label style, hint below in Ink 3.
- **Focus:** Ink border plus a two-ring halo (`0 0 0 2px model-white, 0 0 0 4px seal-red`).
- **Error:** Seal Red border and a Seal Red error line that fades into a reserved slot below the field (no layout shift) with `aria-describedby`; the first invalid field receives focus. Focus rings appear instantly; only border colour transitions.

### Navigation
- **Style:** 72px fixed bar; monogram plus two-line wordmark left; five links (Ink 2, 500) with a 1px underline that scales in from the left on hover; a small primary block "Contact us" right.
- **Scrolled:** opaque Model White with a hairline; no blur or glass.
- **Mobile:** a "Menu" toggle (press feedback scale 0.97, icons crossfade) opens a full-screen Model White panel with 1.75rem links and the primary block; 220ms in, 150ms out, Escape closes.

### Plan Panel (signature)
The model seen from above: a Plan Panel fill with a 1px on-dark hairline, the site blocks drawn in translucent on-dark fills by height, the subject parcel solid Seal Red, a dashed site boundary and a one-line caption. It is a figure, never a background.

### Company Mark and Intro (signature)
The supplied logo, recreated as SVG (symbol `mc-logo`): a hexagon of eighteen blue facets (#0B2E55 to #5FB3E0) around a white hexagon carrying the "MC" monogram in #12345F, ringed in the full version by six gold letters (#D4A62A, Bricolage 800) and their values in blue (#1F5F8B, Noto Sans TC 500): M 互助, R 可靠, A 精確, F 清新, E 熱忱, C 認真. The mark appears at 40px in the header and footer and 96px on the portrait plinth. Once per session, with motion allowed, the page opens on the mark assembling: facets scale in from the centre with a 35ms stagger, the white core follows, the monogram draws as a stroke then fills, the six values rise in, and after a short hold the overlay wipes upward while the model's blocks begin to extrude. About 3.3s in total; skipped under reduced motion, without JavaScript, and on repeat visits in the same session. The same assembly loops above "Find your case." (assemble, hold 1.6s, dissolve 0.5s, pause 0.6s) while in view, and renders as the static full mark under reduced motion. The logo's blues and gold are brand colours and sit outside the page palette by design.

### Massing Model (signature)
The Three.js hero is an architectural maquette, not a box grid. Every building is composed from bevelled box parts (podium, setback tower, crown, rooftop units) drawn as one instanced mesh with slight per-building tonal variation; city blocks sit on raised sidewalk slabs above a road card with faint lane marks and crossings; empty lots carry a few matte model trees. The highlighted property is a stepped three-tier tower in Seal Red acrylic with floor plates, vertical fins and a rooftop terrace, on its own instanced mesh with a light clearcoat. The base is a two-tier bevelled card with a soft ground shadow. Lighting: one warm directional key with 2048px PCF-soft shadows (1024px on phones), a low hemisphere, a cool fill, a faint rim, and a very restrained room environment kept mainly for the acrylic reflections; ACES tone mapping at 0.9 exposure. Contact occlusion is baked into an overlay that fades in with the buildings; atmospheric fog softens the far corner.

Entrance (about 3.9s, after the logo intro when it plays): the base rises and the slab grid appears, buildings rise ring by ring from the centre, rooftop units and trees follow, the property rises last tier by tier and its plates and fins fade in, the camera dollies in and leans toward the property, and the red gains a faint emissive settle. Afterwards the camera breathes with a very slow drift (half frame rate, only while the hero is in view) and tilts up to about 5 degrees with the pointer. On scroll the camera orbits up to plan view with a slow dolly; the model itself never rotates. Device pixel ratio is capped at 1.5 (1 on phones), the shadow pass re-renders only while shapes change, and rendering is on demand otherwise. Reduced motion shows the finished model; no WebGL shows a captured poster of the same model.

## Do's and Don'ts

### Do:
- **Do** use Seal Red for one thing per view: the site, the primary action, or the active mark.
- **Do** build every list as a ruled row module: one strong top rule, hairlines between rows, outlined mark that fills on hover.
- **Do** give every media figure a fixed aspect ratio, a clip reveal with a direction (`data-image-reveal="l|r|u|d"`, alternating across neighbours), and the Lift shadow.
- **Do** keep section headings to short sentences with a full stop and let them stand alone.
- **Do** ship finished content without JavaScript and under reduced motion; entrance states hide only behind `html.has-motion`.

### Don't:
- **Don't** add eyebrows, kickers, section numbers, uppercase tracked labels or middle-dot metadata.
- **Don't** round any corner, add gradients or glass, or pair a hairline border with a wide shadow.
- **Don't** put Seal Red small text on Chipboard or on the dark passage; it fails 4.5:1 there.
- **Don't** invert another section to dark; the public-sector passage is the only one.
- **Don't** introduce a second Latin family or italics; emphasis is weight and scale.
