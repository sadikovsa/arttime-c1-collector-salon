# S1 — motion specification

## 1. Scope and observed baseline
Baseline actually opened at http://127.0.0.1:8797/arttime-c1-collector-salon/dist/ in local Chromium, desktop 1440×900 and mobile 390×844; original hero photos decoded and fonts ready. Screenshots: motion-evidence/baseline-{desktop,mobile}.png. Wine plane, glass objects, editorial layout, original images/fonts and factual copy remain authoritative. This is the selected animate refinement; no new concept exploration or reference claim. Original source/live root remain untouched.

## 2. Focal moment — glass vitrine opens
One visible photo, inside its own material wrapper: 680 ms bounded clip crop releases from 1.5% inset to full bounds, while two translucent reflective leaves withdraw sideways. Photo never starts hidden and image/text/CTA are available immediately; Only decoration waits for available-photo decoding and two presentation frames; the image/text/CTA remain in ordinary visible HTML with no preload barrier, opacity hiding or task delay. Light fades with leaves, not the hero. ease cubic-bezier(.16,1,.3,1). Mobile 520 ms, reduced/paused skip. Finite leaves removed after completion/cancel; no replay on scroll.

Existing native sticky scene remains: desktop 210svh range, photo translateX18%/scale1.04 →9%/1.02 →0%/1; wine plane scaleX1→.5→0; reverse computes identical states. Mobile retains its bounded 1→1.07 photo scale and readable text. Material wrapper owns reveal, image alone owns scroll transform. Pause freezes existing scroll and settles all transient effects to fully readable destination; resume follows current scroll. Oversized hero content switches to static normal flow so growing text never becomes inert/clipped.

## 3. Continuity and feedback
Product photo/title has one semantic action over their bounds; arrow is its visual cue. Source photo duplicates only transiently into the original-photo destination (360 ms desktop / 280 ms mobile), contained in dialog bounds. Modal state/focus is immediate. Close 160 ms, interruption generation guarded; reduced/paused close instant. Gallery next/prev withdraws outgoing photo 180 ms with modest directional translation, incoming photo has 260 ms crop release; latest requested index updates synchronously, no obsolete decode result can apply. Closing cancels pending layers. No repeated section fades.

Catalogue changes acknowledge current count with a 140 ms small opacity change; native card layout/filter/URL updates remain immediate. Primary inquiry remains filled; share becomes spaced ghost action. A changed source field marks prepared text stale while preserving manual text, disables copy/TXT, and provides explicit regenerate. Draft edits invalidate pending clipboard confirmations; empty draft cannot export. Feedback stays visible in reduce/pause without movement.

## 4. Budget and accessibility
Vanilla CSS/WAAPI, no added fonts/assets/library, no loop, no wheel interception, no opacity-zero hero. At most two focal leaves or one transient photo layer per active viewer, automatically cleaned. Only transform/opacity and bounded clip-path; existing 270 ms menu/details retain height exception and instant reduced icons. Separate wrappers prevent transform ownership conflict. `motion-paused` disables incidental CSS hover transitions too. Reduced/noJS show readable normal content, original gallery links and native details. Native focus/restoration remains; every actual control ≥44 px. Functional small labels raised modestly to 11–12 px.

## 5. Verification plan and limits
One batched desktop/mobile behavior/visual pass plus reduced/noJS and controlled 200% text scaling. Check initial visible state, scroll0/50/100/reversal, pause/new modal motion, rapid open/close/next+next/next+prev, photos decode, actions/focus/Escape, stale draft + deferred clipboard, no overflow. Fix observed issues in one batch, at most one confirm. Root owns final QA/review/publication. Controlled text scaling is not actual-browser-zoom certification. Existing simulated mobile LCP6.69s is prior lab evidence; no new performance/FPS claim. Full optimization backlog stays separate.

STATUS: MOTION_SPEC_READY
