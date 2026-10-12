# S1 — Коллекционный салон — GitHub release QA

Оглавление: 1. Вердикт/версия; 2. Проверки; 3. Ограничения.

## 1. Вердикт и версия

**PASS WITH NOTES. BLOCKER0, MAJOR0, открытых MINOR0.** Дата2026-10-12. Готовность локального пакета к уже разрешённой публикации; live URL пока planned. QA не менял source и не выполнял commit/deploy.

Approved checkpoint: cb7427a. Проверенный dist working-tree digest: `5bb747c0fe106bfd2e59451e5b9b929e7b59969aa9bf6d6a5a867adc80c81d5b`.
Алгоритм и общая evidence-карта — `../../qa/release-qa.md`; root привяжет следующий release SHA к этому digest в manifest.

## 2. Проверки scoped контракта

| Проверка | Результат / доказательство |
|---|---|
| Adaptive/network/runtime | PASS: root browser-report.json, fresh320/360/390/768/1280/1440/1920 + noJS390/reduced390; JS/HTTP errors0, hero/footer overflow0. |
| Catalog/search/native motion | PASS: root flow-report.json — catalog16, art2, empty/clear recovery; настоящие wheel forward/reverse states, pause оставляет native scroll. |
| Request/export/channel | PASS: invalid state, product→request, editable TXT equals edited draft; Instagram handoff и storage0. Submit preventsDefault source-reviewed; отдельный POST-network audit не проведён. |
| Share/entry/recovery | PASS: root sharing-report.json — correct ?product=id#catalog entry, invalid ID safe, Escape/focus/URL cleanup. Собственный390: denied clipboard даёт полное selected input, очищает stale q/category, next product resets fallback/status. |
| PracticalFAQ | PASS: собственный rapid3 clicks35ms, native noJS, reduced instant. |
| A11y/fonts | Root axe violations0 desktop; собственные font loads и отдельные focus checks. Не исчерпывающая accessibility certification. |
| SEO | Static/local validation PASS, planned Pages prefix и noindex,follow; внешний deployed URL будет проверять root. |

S1 footer aria-label включает видимое «Наверх». Desktop1440 Modern dialog: object-fit:contain, оригинал декодирован; product-open.png реально открыт и показывает полную рамку. Loaded fonts: Cormorant300–700 normal/italic, Manrope200–800. MINOR reduced icon rotation закрыт final override: open/close/open — 0s, animations0.

Наблюдение глазами — реально открытые `../../qa/arttime-c1-collector-salon/` кадры: desktop-hero.png, product-open.png, sharing-mobile.png. Прочие screenshots не объявляются визуально проверенными этим QA.

Lab Lighthouse: Mobile77/LCP6.69s; отдельный retry72/6.55s. Desktop96/1.33s; retry96/1.40s. Mobile LCP остаётся performance note, согласованного release threshold нет. A11y100/BP100/SEO66; SEO66 связан с intentional noindex. TBT0 не является INP. Последний Lighthouse normal-mode выполнен SEO отдельно до scoped reduced/dynamic image fixes; normal hero/font geometry сохранены.

История исправленных MINOR/MAJOR и superseded evidence находится в combined report. На финальной версии не осталось подтверждённых blocker/major/minor defects. Source changes после этих scoped checks требуют новой проверки соответствующего состояния.

## 3. НЕ ПРОВЕРЕНО и почему

Safari, Firefox, реальные телефоны и screen readers, field INP/CWV/FPS, настоящее browser zoom, полный tab-order/a11y-tree и gradient pixel contrast — НЕ ПРОВЕРЕНО доступными инструментами/отдельным исчерпывающим аудитом. Live Pages prefix/assets/canonical/deeplink ещё не проверены: публикация принадлежит root. Отправка сообщений Instagram/звонки не выполнялись; форма готовит local editable текст.

STATUS: QA_PASS_WITH_NOTES
