# Art Time — поведение сайтов

Business authority: research/brand-content.json, product-catalog.json, source-review.md. User approval: APPROVAL.md. Locale ru-RU, Russian copy, Tashkent market. Marketing catalog sites; no accounts, payments or inventory backend.

## Owners and flows

Each independently hosted site has its own main.js behavior owner, tokens.css visual owner, and DESIGN.md. Within each site reuse the same dialog, accordion and status helpers across repeated components. Visual differences across S1/S2/S3 are intentional, based on approved DIRECTIONS.md; factual content and inquiry behavior are consistent.

- Category/search → matching static products → product details → prepare inquiry or call/Instagram. All16 products exist in initial HTML for noJS/SEO; enhancement filters them. Filter/search URL state may be restored with URLSearchParams. Clear search is immediate, IME-safe, empty results offer reset. No load-more is needed for16 finite items.
- Product action native button, initial noJS fallback details or direct phone/Instagram. Modal is native dialog with accessible title, close, Escape, focus restoration, inert background, bounded internal scroll. A visually rich product detail must include original photo, description, verified specification and price by inquiry.
- Accordion native details remains functional without JS; JS animates open/close height and opacity270ms, last click wins. Reduced motion instantaneous. No CSS sibling moving animation except accordion height.
- Gallery viewer only for actual available images; next/previous controls and accessible close. Client cases limited to proven decorative filling, not architectural authorship; branded inspiration images kept separate from factual case group.
- Request form prepares editable text locally; no network submission and no false 'sent' message. Labels, novalidate, custom errors, aria-invalid/describedby, first invalid focus, no alert/confirm/prompt. Fields name, contact, selected object and message; textarea resize none with sufficient height. Download TXT or copy with truthful status and recovery if clipboard fails; original telephone and Instagram always available. No contact data persisted to localStorage or cookies.
- Menu enhanced open/close smooth270ms with keyboard/Escape and restored focus; navigation usable without JS. Desktop full menu visible without modal dependence.
- Scroll scene native vertical scrolling, actual progress0/50/100 and reversal; no wheel interception. Pause control disables large movement without hiding content or changing scroll position. Reduced motion and noJS expose normal readable sections. Only transform/opacity aside from disclosure height.

## Shared constraints

No underlined links, including hover and text-width border substitutes. Visible focus, native semantic controls,44px targets, global operable tokenized scrollbar. Main content container max1200px; hero/scenes may bleed. Compact footer with verified address. Do not create fake WhatsApp/Telegram/email, prices, clients, reviews, guarantees, delivery fees or current stock. Source and generation ledger internal; no public demo/AI/source notices per user's editorial preference.

## Verification

Actual desktop/mobile screenshots, console/404, keyboard, noJS/reduced, search/empty/reset, category counts, product/request dialogs, native fallback, original pictures, real scroll forward/back and pause/resume. Frames and computed progress prove states, not measured FPS. Service measurements not claimed without tools. SEO adds absolute expected Site URL only from native registration, noindex while client variants are under review, correct real business contact in JSON-LD.
