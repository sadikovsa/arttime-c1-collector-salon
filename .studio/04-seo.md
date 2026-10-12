# SEO — arttime-c1-collector-salon

## 1. Scope и статус

Дата: 2026-10-12. Утверждение всех направлений: `work/arttime-c/APPROVAL.md` (APPROVED_ALL_THREE). Старый WAITING_FOR_VISUAL_APPROVAL в брифе не актуальный статус. Это альтернативная клиентская презентация Art Time, а не отдельный новый бизнес. Изменены только head в `dist/index.html`, `dist/robots.txt`, `dist/sitemap.xml` и metadata-only favicon при отсутствии. Body после SEO побайтно совпал с входом; его SHA256: `69b3e1c129f16ce31f4f20052c7c33c8f03ad867a6073013cade87a7c8fd6395`. CSS/JS, редактура, `.openai`, research и Git не изменены.

Native project ID точно прочитан из `.openai/hosting.json`: `appgprj_6acc6b42976081918dd04c3b122a7e15`. Ожидаемый origin от диспетчера: `https://arttime-c1-collector-salon.dilsan881.chatgpt.site`. Это **планируемая публикация**; статус сервиса и HTTP-доступность в роли SEO НЕ ПРОВЕРЕНО. URL не объявлен опубликованным.

## 2. Metadata и политика индексации

| Поле | Значение |
| --- | --- |
| lang | ru |
| title | Art Time — коллекционный декор для интерьера в Ташкенте |
| description | Коллекция Art Time: картины, часы, вазы и арт-объекты для вашего пространства. Подбор, доставка и размещение. Ташкент, ул. Тимура Малика, 3А. |
| H1 в исходном HTML | Предметы, с которыми хочется жить. |
| canonical / og:url / twitter:url | https://arttime-c1-collector-salon.dilsan881.chatgpt.site/ |
| social image | https://arttime-c1-collector-salon.dilsan881.chatgpt.site/assets/img/social.png |
| robots meta | noindex,follow |

Title: 55 символов; description: 141 символов. У трёх вариантов разные русские title/description и собственные ожидаемые origins. Все абсолютные SEO URL согласованы, включая WebPage JSON-LD и единственный URL в sitemap. OG/Twitter используют одну картинку `/assets/img/social.png`, PNG 1200×630; actual UI screenshot создаёт диспетчер. Проверка наличия и декодирования final screenshot требуется перед публикацией.

`robots.txt`: User-agent:* / Allow:/. Это позволяет прочитать noindex; Disallow:/ помешал бы увидеть запрет индексации. `sitemap.xml` является локальным инвентарём ожидаемой review-страницы и намеренно не рекламируется через robots и не отправлен в Search Console. Финальный основной production-домен и перевод в index выбираются отдельно; все три review-версии остаются noindex,follow.

## 3. Schema и доказанность

Валидно разобран JSON-LD graph: HomeGoodsStore + WebPage + ImageObject. HomeGoodsStore использует одну общую для трёх презентаций identity `https://www.instagram.com/arttime_uz/#store`; это идентификатор на подтверждённом профиле, не три разных магазина. Данные: Art Time, +998980000048, Ташкент, ул. Тимура Малика, 3А, UZ и официальный Instagram. Источники: `work/arttime-c/research/brand-content.json`, `source-review.md`, официальный пост от 06.10.2026. Не добавлены часы, coordinates, legal entity, founding date, отзывы/рейтинг, цены, offers, наличие, SKU, доставка бесплатно или обещание отправки формы. Product rich results/ItemList не заявлены; редакционные названия не превращены в модель/SKU.

## 4. Что фактически проверено

Python HTMLParser разобрал head: один title, одна description, одна robots и canonical, уникальные meta keys, ru lang. Проверены совпадения canonical/OG/Twitter/JSON-LD/sitemap и valid JSON/XML. Один основной H1; контентная иерархия h1→h2→h3 без скачков. Пустые h2 находятся в исходных hidden dialogs и заполняются JS при открытии; не являются дополнительными основными заголовками.

Исходный HTML содержит все 16 product articles; их IDs точно совпали с research catalog. Описания/характеристики и native details присутствуют до JS, карточки имеют оригинальные локальные фото/прямые телефонные ссылки. Это source-проверка crawlable content; runtime noJS проверяет QA. Все hash-ссылки имеют DOM-цели, duplicate IDs нет. Все текущие локальные src/href в script/img/link существуют. 30 изображений с исходным src: все с alt и intrinsic width/height; 0 пустых alt у декоративных повторов. Изображения без исходного src относятся к JS-панелям, их runtime alt/decode проверяет QA. Body сохранён.

## 5. Ограничения и release checks

Lighthouse/PageSpeed/FPS/Core Web Vitals, LCP/CLS/INP: **не измерено в роли SEO**. Парсинг HTML не является замером скорости и не доказывает keyboard/runtime/noJS/scroll. До/после performance-цифр нет; параллельный browser QA не используется для фиктивных лабораторных выводов. Ошибок SEO в доступном исходном контенте, требующих body-редактуры, не найдено. Отдельных индексируемых страниц товаров нет: это single-page review-витрина; для будущего основного магазина нужны самостоятельные product URLs по отдельному согласованию.

Перед native release: проверить существование/размер social.png, затем после фактической публикации проверить HTTP200, публичные canonical/OG/Twitter/robots/schema/sitemap и доступность preview asset. Верифицированный public URL и публикационный статус фиксирует диспетчер по сервису, не по расчёту hostname. Поисковые позиции, объёмы запросов и ranking не заявлены.

STATUS: SEO_READY
