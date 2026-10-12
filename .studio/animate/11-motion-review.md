# S1 Art Time — independent scoped motion review

Contents: 1 scope/verdict · 2 visible design judgment · 3 observed interactions · 4 one correction · 5 evidence/limits.

## 1. Scope and verdict
2026-10-12. Fresh independent reviewer read studio/common/lessons, Impeccable animate and craft-floor, applicable DecoFlowers/interior motion guidance. Reviewed the selected existing S1 Collector Salon refinement, without source edits, new concepts, a repeated baseline audit, Lighthouse, SEO or publication. Actual local Chromium compared original `http://127.0.0.1:8797/arttime-c1-collector-salon/dist/` with stage `http://127.0.0.1:8798/`, fresh1440×900 and390×844 contexts. `/animate/` remains a planned release location at this review, not a claimed published URL.

**REVIEW_SHIP for this scoped animate refinement after one targeted correction.** No remaining observed material design/motion blocker. This supports shipping the reviewed scope; it does not replace owner approval or imply full accessibility/performance certification.

## 2. Visible design judgment
The salon identity survives: wine plane, cream italic display lettering, tall glass silhouettes, warm stone photograph, roomy editorial sections, restrained original-product presentation. Existing native scroll is the principal authored spatial movement: the wine plane withdraws while the photograph fills the viewport. Forward/reverse frames visibly match their phase, rather than swapping to a duplicate hero. This refinement does not claim a tunnel or architectural zoom-through.

The added vitrine entrance is a quiet material opening: bounded photographic edges and a translucent vertical reflection release, then return to the original composition. Warm active desktop and corrected cold active desktop both show the real photograph, not merely an opacity value. Mobile retains its photograph above readable text and a reachable collection action. It is intentionally restrained, and glass-specific enough for this approved world; there is no repeated section-entry choreography or extraneous loop. Modal continuity preserves the original full product photograph. Supporting movement remains quieter than the hero.

Primary inquiry and secondary sharing now read as separate actions: filled wine button versus transparent outlined button, measured14px separation,54px heights at both widths. Visible modal/gallery photographs and captions are legible in the observed layouts. At390 product secondary actions continue inside the scrollable modal below the initial frame; the close control remains findable. The gallery's portrait presentation keeps image, caption, counter and arrows together without excessive empty stage. Existing baseline editorial labels/style choices are outside this motion-only review; craft-floor was applied to the changed behavior, not used to redesign the selected world.

## 3. Exact observed behavior
| Check |1440×900|390×844|
|---|---|---|
| Hero horizontal document overflow |0px|0px|
| Native wheel forward/reverse |0→495→990→495→0px|0→148→295→147→0px|
| Photo phase transforms |scale1.04/x259.2→1.02/x129.6→1/x0; exact reverse|scale1→1.03524→1.07→1.035→1|
| Wine-plane phase |scaleX1→.5→0→.5→1|No desktop cover transform; image/text retained|
| Real click over product title |Opens original-product dialog|Opens original-product dialog|
| Real click over product photo |Opens dialog|Opens dialog|
| Escape / actual opener focus |Restored|Restored|
| Primary request action |Dialog closed; object field `Картина Modern`|Same|
| Gallery Next+Next |1/5→3/5, correct kitchen photo|Same|
| Gallery Next+Prev from3/5 |Finishes3/5|Same|
| Gallery Escape/opener focus |Restored|Restored|
| Page errors in bounded pass |0|0|

These were native pointer/wheel/keyboard operations, not paused-animation state forcing. Descendant title locator click was initially refused by Playwright because the semantic product action intentionally covers the title; actual coordinate clicks over that visible title correctly opened the product. That was a harness adjustment, not a user-facing defect.

## 4. One material finding and correction
Initial cold desktop screenshots repeatedly captured a blank right photo area while the decorative animation had already begun. Complete/naturalWidth/opacity1 did not prove presentation. Warm reload made the photo visible under the same active clip, ruling out enlarged cover geometry or general clipping failure. Recorded in `focal-finding.md`; severityP2 for the promised focal experience, not a blocked task.

Root corrected only decorative readiness: photo decode then presentation frame before starting the vitrine leaves. Default photograph/text/CTA remain ordinary visible content; no loading screen or task delay was added. One bounded cold-context confirmation at1440/390 now visibly shows the real photograph during active material movement (`confirmed-cold-1440-active.png`, `confirmed-cold-390-active.png`). Captured active animation times0/50ms, headings opacity1, CTA visible, overflow0. At the observed settled end both contexts have0transient layers,0animations,clip:none,0page errors. The earlier blank cold frames are superseded for release by these confirmation frames, while preserved as evidence of the finding.

## 5. Evidence and honest limits
Reviewer-owned files are this directory: `observations.json`, original/final hero, catalog, product, request and gallery screenshots; `warm-focal.json`/`warm-*.png`; `correction-confirm.json`/`confirmed-cold-*.png`; scripts close their own browser in `finally`. All own browsers have exited; root-owned local servers were not stopped. No visible recording overlay was used.

Final reviewed runtime hashes:
- main.js `fd8a6606447f5c37ec4f5b8917d0e3b2dd02ed4e13d7edfcae62b09a13654e12`
- motion.css `f85bfae0cc25fe3ff6cc0d8df458ec4032e43f7bf9a4ab34a746fe36078258bc`
- index.html `4c419c5f801348ed20e6700300cf3ada87eee1409bbe4dc4ee55a90be8ae7991`

Root separately owns and reports the wider responsive/reduced/noJS/paused/stale-draft/clipboard matrix, SEO, detector and performance checks. This reviewer did not independently rerun those full paths. Physical-device FPS/INP, Firefox/Safari, full WCAG/screen-reader order, browser zoom and live deployment: **НЕ ПРОВЕРЕНО in this review**. Screenshots and computed phase values prove visible states and native reversal, not measured frame rate. No request to decorate remaining sections or broaden the design scope.

STATUS: REVIEW_SHIP
