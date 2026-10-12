# SEO GitHub Pages — C1

## 1. Scope и фактический статус

2026-10-12. Вход: `.studio/06-distribution.md`, DESIGN.md, UX-CONTRACT.md, `.studio/02b-copy.json`, прежний native `.studio/04-seo.md`. Актуальная hosting-спецификация 06-distribution заменяет native-only URL в старом UX/report. GitHub Pages цель: **https://sadikovsa.github.io/arttime-c1-collector-salon/ — planned, публикация в SEO не проверена**. Native `/workspace/sites` не изменялся; commit/push/publishing/Search Console не выполнялись.

Изменены SEO поля head, robots/sitemap и добавлены responsive derivatives/srcset/sizes плюс lossless compressed font faces для C1/C2. Body редактура, структура, CSS visual rules, JS, motion, исходные img src/модальные JSON и ссылки на оригиналы сохранены в SEO scope. Root отдельно добавил FAQ/product-share/aria/noJS/startup corrections; они сохранены. `icons.css` link/файлы/порядок символических faces сохранены; C2 исходно не имеет icons.css. Подтверждение оригинальных фото и cmap/метрик/осей шрифтов: `../../seo/optimization.json` и `font-validation.json` относительно workspace distribution root.

## 2. Metadata и indexing

| Поле | Значение |
| --- | --- |
| lang | ru |
| title | Art Time — коллекционный декор для интерьера в Ташкенте |
| description | Коллекция Art Time: картины, часы, вазы и арт-объекты для вашего пространства. Подбор, доставка и размещение. Ташкент, ул. Тимура Малика, 3А. |
| H1 | Предметы, с которыми хочется жить. |
| canonical / OG / Twitter / WebPage | https://sadikovsa.github.io/arttime-c1-collector-salon/ |
| social image | https://sadikovsa.github.io/arttime-c1-collector-salon/assets/img/social.png (PNG 1200×630) |
| robots meta | noindex,follow |

Все Pages SEO URLs содержат правильный `/arttime-c1-collector-salon/` prefix; frontend assets остались относительными. Titles/descriptions уникальны между вариантами. Это три альтернативных дизайна одного бизнеса, не три официальных магазина. HomeGoodsStore содержит только подтверждённые Art Time / +998980000048 / Ташкент, Тимура Малика 3А / официальный Instagram, со shared business identity. Нет отзывов/рейтингов/цен/наличия/часов/геоданных/SKU. JSON-LD разобран как JSON; rich-results eligibility не обещана.

`robots.txt` лежит под project prefix и **не управляет robots корня sadikovsa.github.io**; Allow разрешает прочитать HTML noindex, а не индексирует страницу. Никакого Disallow, мешающего прочитать noindex, не добавлено. Sitemap — empty XML inventory: индексируемых страниц нет, URL с noindex не рекламируются. Sitemap не отправлен и не объявлен в robots. Финальный основной production-вариант/index-policy выбираются отдельно.

## 3. Assets, контент и scoped оптимизация

Все 30 исходных изображений декодируются, имеют alt и intrinsic width/height с правильным aspect ratio. У ряда исходных width/height значения масштабированы относительно файла; ratio сохранён, атрибуты не менялись. Social PNG декодирован1200×630; SVG favicon valid XML. Проверены все local HTML src/href/srcset и CSS font URLs, существование и fontTools декодирование TTF/WOFF2. Один H1, 16 catalog articles в initial HTML, уникальные IDs и разрешённые hash anchors. Native details содержит descriptions/характеристики/телефон до JS; runtime noJS проверяет QA. Пустые исходные headings/img в hidden dialogs заполняются runtime и не считаются основной контентной страницей.

Responsive srcset: 320/640px для product thumbnails, дополнительно960px для editorial фото; сохранены исходные full-resolution src и файлы для dialogs/gallery. Размеры/пропорции/видимые тексты не менялись. Новые derivatives quality83 WebP, Lanczos; это уменьшение скачивания, не замена официальных оригиналов. Шрифты: assets/fonts/cormorant-italic.ttf: 715644 → 143624 байт; assets/fonts/cormorant.ttf: 1195560 → 209392 байт; assets/fonts/manrope.ttf: 164700 → 53688 байт. WOFF2 получен из точных существующих TTF без изменения cmap, hmtx metrics или fvar axes, включая real800 S2. Исходные declarations C1 main.css и C2 golostext.css используют прежние family/style/weight/display с WOFF2 src; дополнительная оптимизационная stylesheet удалена, symbols override остаётся после них.

## 4. Lighthouse: фактические результаты

Lighthouse13.5.0 / HeadlessChrome151, local `http://127.0.0.1:8797/arttime-c1-collector-salon/dist/`, mobile/desktop simulated throttling. Последовательные отдельные browser jobs. Инструмент `codex_studio/qa-tools/lighthouse.js`, CHROME_NO_SANDBOX=1; proxy restricts traffic to loopback. Raw JSON/HTML/summary сохранены в `work/arttime-github/seo/evidence/arttime-gh-c1-final-fontsource-summary.json` и соседних файлах. Исходный запуск с EPERM и отдельный C1 server502 не являются замерами сайта; ошибки не скрыты, последующие успешные runs имеют отдельные имена.

| Mode | Perf | A11y | Best | SEO | LCP s | CLS | TBT ms |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| mobile | 77 | 100 | 100 | 66 | 6.69 | 0.00014 | 11 |
| desktop | 96 | 100 | 100 | 66 | 1.33 | 0.00000 | 0 |

До scoped оптимизации: mobile: performance 74, LCP 20.57 s, CLS 0.00007, TBT 28 ms; desktop: performance 83, LCP 2.38 s, CLS 0.00000, TBT 0 ms

SEO score66 вызван намеренным noindex. TBT — лабораторный показатель, **не INP**. INP/field Core Web Vitals/FPS/physical Safari: **не измерено**. Разницу баллов нельзя приписать одному действию: root startup/aria и image/font changes вошли в финальные runs; повторяемость на реальном hosting/устройствах не доказана. Финальный mobile LCP остаётся выше 4 секунд в лабораторной симуляции; это ограничение, а не успешная field-CWV приёмка. 

## 5. Release checks и доказательства

Final HTML SHA256 `13ee2cfea163533529c31c052144b138bd5b23d409292a4c4ac14750a904d22b`, body SHA256 `25e06da96032f82f3dcfa661bc3f91f1f600a36a4c0892abb2ecf05c78685780`. Public HTTP200, Pages deployment source/build status, public asset MIME/canonical/robots/schema и социальное preview после deploy: **НЕ ПРОВЕРЕНО в роли SEO**; подтверждает root по фактическому deployment. Локальное техническое SEO готово, ранжирование не обещано. Совместный отчёт/metric evidence: `work/arttime-github/seo/report.md`, `final-validation.json`.

STATUS: SEO_READY
