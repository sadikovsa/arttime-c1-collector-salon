# S1 — build notes

## 1. Результат и файлы

Полный buildless static сайт: `dist/index.html`, `dist/assets/css/tokens.css`, `dist/assets/css/main.css`, `dist/assets/js/main.js`. Локальные существующие фото иfonts сохранены. Root добавил настоящий variable italic `cormorant-italic.ttf`; он подключён вCSS и preloaded. `DESIGN.md` описывает финальные состояния.

Утверждённое изображение S1 реально просмотрено инструментомview_image; supplied hero WebP также просмотрен. Сравнение в живом браузере не выполнялось в ролиfrontend: root выполняет scoped QA. Отдельные live motion-reference сайты в этой роли НЕ ПРОВЕРЕНО; реализация опирается на утверждённый контракт S1.

## 2. Контент и UX

В начальномHTML16product articles с истинными описаниями/спецификациями иnative fallback details. Полноценные category/search, original-photo native product dialog, local inquiry prefill.2curatorial photo/text panels.5actual filling cases и2отдельные интерьерные идеи, viewer next/prev.3services illustrated native details,4FAQ плюс иллюстрация. Оригинальные телефон/Instagram/адрес.

Небольшая редактура публичной gallery copy убирает происхождение и отрицательное утверждение об авторстве: «Опубликованная… Авторство ремонта…» →«Подбор наполнения под характер пространства»; «Бренд показал…» →«Наполнение минус первого этажа и завершённый интерьер». Факты изcopy JSON сохранены, source ledger не изменён.

Request form honest local preparation: validate name/contact, editable result,copy/TXT и recovery clipboard. Нетnetwork submit, нет сохранения контактов, нет сообщения «отправлено». В noJS доступен телефон/Instagram.

## 3. Инвентарь движения

Native sticky210svh desktop /135svh mobile. Винная плоскость сжимается transform scaleX, single photo переходит вfullframe, заголовок opacity/translateY. data-scene[data-progress] пригоден для0/50/100 QA. Реверс напрямую отscroll, pause не меняетscene geometry/scrollY, reduced/noJS статичный normal flow.270ms native details animations с отменой предыдущей иобратным движением;270ms mobile menu. Hover фото scale1.025–1.035, никаких бесконечных эффектов.

## 4. Быстродействие и доступность

VanillaJS defer, no runtime frameworks/CDN. LCP image preload priorityhigh, WebP responsive640/960/1536, intrinsic dimensions всех статичных фото. Нижеhero lazy/async; локальныеfont-display swap и2critical font preload. Семантические секции/навигация/одинh1,skip link,labels,visible focus44px targets, native dialogs, native noJS fallback. Большиеmotion вычисленияrAF/passive.

## 5. Проверки

PASS: `node --check dist/assets/js/main.js`; parseHTML:16product cards/7gallery references; всеasset src/href существуют; якоря разрешаются;ID уникальны. Проверена font metadata: original Cormorant regular и real italic локальный отroot.

НЕ ПРОВЕРЕНО: actual browser rendering,console/404,desktop/mobile screenshots,keyboard journey,реальный scroll туда/назад,rapid-reversal details/menu,reduce/noJS,T XT download/clipboard inbrowser. Это следующий шагroot QA; не выдаётся за успешный browser run. FPS/Core Web Vitals не измерены.

Root desktop screenshot фактически просмотрен после первой сборки. Найдено: specificity `.site-nav a` выводила mobile phone наdesktop, дублируя контакт. Исправлено `.site-nav .mobile-phone{display:none}` сmobile-only override. Фотографический кадр получил верхний/нижний gradient overlay дляконтраста навигации иподписи без изменения самогоimage. Новые скриншоты иaxe после этой коррекции НЕ ПРОВЕРЕНО в ролиfrontend.

Scoped QA correction: все10узлов`color-contrast` изroot axereport используют общий muted наstone. Token изменён`#6e6559`→`#655c51`, математический WCAGконтраст на`#e4dccf`≈4.82:1. Сохранён тёплый approved palette, остальные стили не менялись. Browser axe rerun выполняетroot.

## 6. Передача

Открыть `dist` через root localhost127.0.0.1 сервер. Верстальщик сервер/деплой/SEO не выполнял по назначенной зоне. SEO владелецroot: одна Russian marketing catalog page,collection/interior filling/services/local selection inTashkent. Нетplaceholder content/выдуманных цен/инвентаря/reviews/backend.

Test selectors: `[data-menu-toggle]`, `[data-filter]`, `[data-search]`, `[data-search-clear]`, `[data-reset]`, `[data-product]`, `[data-product-dialog]`, `[data-gallery]`, `[data-gallery-dialog]`, `[data-request]`, `[data-request-form]`, `[data-prepared-text]`, `[data-copy]`, `[data-download]`, `[data-motion-toggle]`, `[data-scene]`.

STATUS: BUILD_READY
