# План розробки сайту funeral.vn.ua (нова версія)

**Стек:** Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · MDX · Mobile-first · Vercel · **next-intl**
**Мови:** українська (основна, без префіксу — `/`) + російська (`/ru/`)
**Дата:** 2026-04-29

> Дизайн-система та семантичне ядро — окремі документи (`DESIGN.md`, `SEO-CORE.md`).
> Цей документ — технічна архітектура та покрокова реалізація.

---

## 1. Аудит існуючого сайту

### 1.1 Класифікація 34 сторінок

**Послуги — Невідкладні (24/7):**
`/rytualnyi-ahent-vinnytsia/` · `/rytualna-bryhada/` · `/perevezennia-pomerlykh-vinnytsia/` · `/posluhy-morhu-vinnytsia/` · `/oformlennia-dokumentiv-vinnytsia/` · `/rozporiadnyk-pokhoronnoho-protsesu/`

**Послуги — Транспорт і місце:**
`/katafalk-pokhoronnyi-transport/` · `/rytualnyi-zal-proshchannia/` · `/rytualnyi-namet/` · `/mistse-na-kladovyshchi/`

**Послуги — Спеціальні:**
`/viiskove-pokhovannia-vinnytsia/` ⭐ · `/krematsiia/` · `/repatriatsiia-vinnytsia/` · `/ekshumatsiia/` · `/dopomoha-na-pokhovannia-vinnytsia/` · `/dopomoha-na-pokhovannia-rodynam-zahyblykh/` ⭐ · `/chorni-ahenty-vinnytsia/`

**Послуги — Церемоніальні:**
`/posluhy-sviashchennyka/` · `/pokhoronnyi-orkestr/` · `/synhumator/` · `/chytannia-psaltyria/` · `/pomynalnyi_obid/`

**Товари:** `/rytualni-tovary/`

**Інформаційні (cornerstone-кандидати):**
`/tsiny-na-rytualni-posluhy-v-vinnytsi/` ⭐ · `/shcho-robyty-koly-pomerla-blyzka-vam-liudyna/` ⭐ · `/pro-nas/` · `/kontakty/` · `/yak-molytysia-za-spochyloho/` · `/batkivska-subota/` · `/batkivski-suboty-2026-rik/` · `/rik-nezlamnosti/` · `/orhanizatsiia-pokhovan/` · `/rytualni-posluhy-vinnytsia/` · `/blog/`

### 1.2 Основні проблеми

1. Плоска структура без кластерів — слабка перелінковка.
2. WordPress + jQuery → повільні CWV, важкі бандли.
3. Дубльовані title/description, відсутні Schema.org, FAQ-розмітка.
4. Не mobile-first; немає sticky-CTA для невідкладного виклику.
5. Слабкі сигнали довіри (E-A-T): мало фото команди, ліцензій, реальних кейсів.
6. Слабкий Local SEO (NAP-консистентність, GBP, локаційні сторінки).

---

## 2. Цільова архітектура

### 2.1 Карта URL

Головна `/` **є хабом усіх послуг** (за рішенням замовника).
Структура дублюється для російської з префіксом `/ru/...` (slug-и спільні, транслітерація лат.).

```
/                                    ⭐ ХАБ: hero + 24/7 CTA + усі послуги (картки) + відгуки + FAQ + контакти
├─ /poslugy/[slug]/                  Окрема сторінка кожної послуги (~22 шт.)
│   • orhanizatsiya-pokhovannya
│   • rytualnyi-ahent
│   • perevezennia-tila
│   • morh-balzamuvannya
│   • oformlennya-dokumentiv
│   • rytualna-bryhada
│   • katafalk
│   • zal-proshchannya
│   • rytualnyi-namet
│   • mistse-na-kladovyshchi
│   • viyskove-pokhovannya          ⭐ pillar (Героям)
│   • krematsiya
│   • repatriatsiya
│   • ekshumatsiya
│   • rozporyadnyk
│   • orkestr
│   • svyashchennyk
│   • psaltyr-synhumator
│   • pomynalnyi-obid
│   • pamyatnyky                     🆕 (~590 V/міс — KEYWORDS.md)
│   • prybyrannya-mohyl              🆕 (~70 V/міс)
├─ /tovary/                          Каталог (труни, вінки, хрести, одяг, пам'ятники)
│   └─ /tovary/[category]/[slug]/    Картки товарів (Schema Product)
├─ /tsiny/                           Прайс + калькулятор пакетів (Економ/Стандарт/Еліт)
├─ /dopomoga/                        Хаб допомоги
│   ├─ /dopomoga/derzhavna/
│   ├─ /dopomoga/rodynam-zagyblych/  ⭐
│   └─ /dopomoga/uchasnykam-bd/
├─ /poradnyk/                        Cornerstone-контент (8 ключових сторінок)
│   ├─ /poradnyk/shcho-robyty-koly-pomerla-lyudyna/        ⭐
│   ├─ /poradnyk/shcho-ne-mozhna-robyty-koly-pomerla-lyudyna/  🆕 ⭐ (~700 V/міс)
│   ├─ /poradnyk/vichna-pamyat/                           🆕 ⭐⭐⭐ (~8250 V/міс — топ інформ.)
│   ├─ /poradnyk/epitafii/                                🆕 ⭐⭐ (~1260 V/міс)
│   ├─ /poradnyk/yak-molytysya-za-spochyloho/
│   ├─ /poradnyk/pomynalni-dni/                           🆕 ⭐⭐⭐ хаб (~5200 V/міс)
│   │   ├─ /poradnyk/batkivski-suboty-2026/
│   │   ├─ /poradnyk/pokrovska-subota/                    🆕
│   │   ├─ /poradnyk/dmytrivska-subota/                   🆕
│   │   └─ /poradnyk/pomynalna-nedilya/                   🆕
│   ├─ /poradnyk/kladovyshcha-vinnytsi/                   🆕 (Local)
│   ├─ /poradnyk/chorni-agenty-yak-rozpiznaty/
│   └─ /poradnyk/[slug]/
├─ /blog/                            Новини (MDX-файли, без CMS)
│   └─ /blog/[slug]/
├─ /pro-nas/
├─ /kontakty/                        Карта, відділення, форма
└─ /lokatsiyi/[slug]/                Local SEO — 3 офіси (Коновальця 83, Підлісна 2, Арабея 1)
                                     Зона обслуговування ~56 локацій — лише блок на головній (без окремої сторінки), див. LOCATIONS.md
```

**i18n-маршрути:**
- `uk` (default, без префіксу): `/`, `/poslugy/[slug]/`, `/tsiny/`, ...
- `ru` (з префіксом): `/ru/`, `/ru/poslugy/[slug]/`, `/ru/tsiny/`, ...
- Slug-и спільні для обох мов (без перекладу шляхів) → простіше підтримка + чисті hreflang.
- Перемикач мови у Header → перенаправляє на той самий slug в іншій мові.

### 2.2 Логіка перелінковки

- Головна → картки усіх послуг (групування за блоками: невідкладні / транспорт / спеціальні / церемоніальні).
- Кожна `/poslugy/[slug]/` → блок «Супутні послуги» (3–4 cross-links) + CTA на форму.
- Cornerstone `/poradnyk/shcho-robyty-koly-pomerla-lyudyna/` → виклик агента + посилання на документи, морг, перевезення.
- Footer: повна мапа сайту, телефон 24/7, адреси, соцмережі.

### 2.3 Редіректи

**Не потрібні** — це новий сайт (новий проєкт, без міграції зі старого). Структура URL — фінальна одразу.

---

## 3. Технічний стек (мінімалізм, без платних сервісів)

| Шар | Рішення | Коментар |
|---|---|---|
| Framework | **Next.js 15 (App Router)** | RSC + ISR + edge |
| Мова | TypeScript (strict) | — |
| Стилі | Tailwind CSS v4 + CSS variables | — |
| UI-примітиви | Radix UI (headless) | a11y з коробки |
| Контент | **Чистий MDX** (`@next/mdx` + gray-matter) | Без CMS — редагування через Git |
| i18n | **next-intl** (uk default + ru) | Routing, hreflang, переклади UI |
| Форми | React Hook Form + Zod | Валідація |
| Бекенд форм | Next.js Route Handler → **Telegram Bot API** + опц. Gmail SMTP | Без сторонніх SaaS |
| Хостинг | **Vercel** (free hobby) | Edge functions, ISR |
| Зображення | next/image + Sharp + AVIF/WebP | CWV |
| Шрифти | next/font/google | Без зовнішніх запитів |
| Карта | Leaflet + OpenStreetMap | Без Google Maps API ключа |
| Аналітика | GA4 (через `@next/third-parties`) + Vercel Web Analytics (free tier) | Без GTM/Clarity |
| Реклама | — | — |
| Захист від спаму | Honeypot + rate-limit (in-memory у edge) | Без reCAPTCHA |

### 3.1 Залежності (orientовно)

```jsonc
{
  "dependencies": {
    "next": "^15",
    "react": "^19",
    "react-dom": "^19",
    "tailwindcss": "^4",
    "@radix-ui/react-accordion": "^1",
    "@radix-ui/react-dialog": "^1",
    "@radix-ui/react-tabs": "^1",
    "react-hook-form": "^7",
    "zod": "^3",
    "@hookform/resolvers": "^3",
    "@next/mdx": "^15",
    "@mdx-js/loader": "^3",
    "@mdx-js/react": "^3",
    "gray-matter": "^4",
    "remark-gfm": "^4",
    "rehype-slug": "^6",
    "rehype-autolink-headings": "^7",
    "schema-dts": "^1",
    "next-intl": "^3",
    "leaflet": "^1.9",
    "react-leaflet": "^4",
    "lucide-react": "^0.4",
    "clsx": "^2",
    "tailwind-merge": "^2",
    "class-variance-authority": "^0.7",
    "nodemailer": "^6"
  }
}
```

---

## 4. Шрифти (Cyrillic-aware, тематична відповідність)

Критерії: повний український гліф-сет (іїєґʼ), стримана естетика, дозволена ліцензія, доступ через `next/font/google` (zero CLS, self-hosted).

### Рекомендований дует

- **Заголовки:** **Cormorant Garamond** (`weight: 400, 500, 600`)
  Класичний серифний антиквенний шрифт. Має повну кирилицю, шанобливо-меморіальну естетику, добре читається у великих кеглях. Альтернатива — **PT Serif** (більш нейтральний, теж повна кирилиця).

- **Основний текст:** **Manrope** (`weight: 400, 500, 600, 700`)
  Гуманістичний sans-serif з повною кирилицею, високою читабельністю на мобільних. Альтернатива — **IBM Plex Sans** (більш технічний) або **Noto Sans** (універсальний).

### Підключення

```ts
// app/fonts.ts
import { Cormorant_Garamond, Manrope } from 'next/font/google';

export const heading = Cormorant_Garamond({
  subsets: ['cyrillic', 'latin'],
  weight: ['400', '500', '600'],
  variable: '--font-heading',
  display: 'swap',
});

export const body = Manrope({
  subsets: ['cyrillic', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});
```

Альтернативні комбінації для розгляду на етапі дизайну:
- **PT Serif + IBM Plex Sans** (стриманіше, більш «офіційно»)
- **Lora + Manrope** (м'якше)
- **Noto Serif + Noto Sans** (універсально, повний гліф-сет)

Фінальний вибір — окремо у `DESIGN.md`.

---

## 4a. Інтернаціоналізація (i18n)

### 4a.1 Стратегія

- **Локалі:** `uk` (default, без префіксу), `ru` (`/ru/...`).
- **Бібліотека:** `next-intl` v3 — інтегрується з App Router, підтримує RSC, генерує hreflang.
- **Spell:** український — основний контент і мовні сигнали для пошуку (Google переважно ранжує uk-контент для запитів з України).
- **Slug-и:** єдині для обох мов (латинська транслітерація). Перевага — простіше канонічні URL і відсутність дубль-маршрутів.

### 4a.2 Налаштування next-intl

```ts
// i18n/routing.ts
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['uk', 'ru'],
  defaultLocale: 'uk',
  localePrefix: 'as-needed',   // uk без префіксу, ru з /ru/
});
```

```ts
// middleware.ts
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
export default createMiddleware(routing);
export const config = { matcher: ['/', '/(uk|ru)/:path*', '/((?!_next|api|.*\\..*).*)'] };
```

App Router структура:
```
/app/[locale]/layout.tsx
/app/[locale]/page.tsx
/app/[locale]/poslugy/[slug]/page.tsx
...
```

### 4a.3 Переклади UI (статичні рядки)

Лежать у `messages/uk.json` і `messages/ru.json` — кнопки, навігація, форми, плейсхолдери, заголовки секцій.

```jsonc
// messages/uk.json
{
  "nav": { "services": "Послуги", "prices": "Ціни", "contacts": "Контакти" },
  "cta": { "callNow": "Викликати агента 24/7", "callMeBack": "Передзвоніть мені" },
  "form": { "name": "Ваше ім'я", "phone": "Телефон", "send": "Надіслати" }
}
```

### 4a.4 Контент (MDX) — два варіанти

**Варіант A (рекомендований):** окремий файл на мову.
```
/content/poslugy/rytualnyi-ahent.uk.mdx
/content/poslugy/rytualnyi-ahent.ru.mdx
```
Лоадер обирає файл за поточною локаллю. Якщо `*.ru.mdx` відсутній — fallback на `*.uk.mdx` + `<noindex>` + лог.

**Варіант B:** окремі дерева `/content/uk/...` та `/content/ru/...`.
Менше підходить — складніше підтримувати сумісність slug-ів.

### 4a.5 Перекладацький воркфлоу

- Власник тексту пише українською → перекладач адаптує російською (або AI-чернетка з ручною вичиткою).
- Усі переклади у Git — версіонуються разом із кодом.
- Якщо потрібна швидкість — російська версія може запускатись поетапно (спочатку головна + 5–7 ключових послуг, решта пізніше з noindex).

### 4a.6 Перемикач мови

`<LanguageSwitcher>` у Header:
- Зберігає поточний slug, підставляє іншу локаль.
- Запам'ятовує вибір через cookie `NEXT_LOCALE` (next-intl робить автоматично).
- Доступність: `<button aria-label="Перемкнути мову">`.

---

## 5. Контент (MDX без CMS)

### 5.1 Структура (з локалями)

```
/content
  /poslugy/
    rytualnyi-ahent.uk.mdx
    rytualnyi-ahent.ru.mdx
    morh-balzamuvannya.uk.mdx
    morh-balzamuvannya.ru.mdx
    viyskove-pokhovannya.uk.mdx
    viyskove-pokhovannya.ru.mdx
    ...
  /poradnyk/
    shcho-robyty-koly-pomerla-lyudyna.uk.mdx
    shcho-robyty-koly-pomerla-lyudyna.ru.mdx
    ...
  /blog/
    2026-04-15-batkivski-suboty.uk.mdx
    2026-04-15-batkivski-suboty.ru.mdx
    ...
  /tovary/
    truny/standard.uk.mdx
    truny/standard.ru.mdx
    ...
```

### 5.2 Frontmatter (єдиний формат)

```yaml
---
title: "Послуги моргу та бальзамування у Вінниці"
description: "Цілодобова підготовка тіла..."
slug: "morh-balzamuvannya"
category: "nevidkladni"            # для групування на головній
priority: 10                       # порядок відображення
icon: "heart"                      # lucide-react ім'я
priceFrom: 1500
faq:
  - q: "Скільки часу зберігається тіло?"
    a: "До 14 днів у холодильній камері..."
related: ["rytualnyi-ahent", "perevezennia-tila", "oformlennya-dokumentiv"]
publishedAt: "2026-04-29"
updatedAt: "2026-04-29"
---
```

### 5.3 Парсинг

Утиліти у `lib/content.ts`: `getAllPosts(type, locale)`, `getPostBySlug(type, slug, locale)`, `getRelated(slugs, locale)`. Читання з ФС у RSC, кешування через Next.js fetch-кеш + `force-static` де можливо. Fallback: якщо `*.ru.mdx` відсутній → беремо `*.uk.mdx` і додаємо `noindex` для цієї локалі.

### 5.4 Блог без CMS — workflow

1. Додавання нового посту = новий `.mdx` файл у `/content/blog/`.
2. Commit → push на GitHub → автодеплой на Vercel.
3. Власник може редагувати прямо у GitHub UI (web editor) — немає потреби у CMS.
4. Якщо в майбутньому знадобиться нетехнічний редактор — можна додати **Decap CMS** (безкоштовний, працює поверх Git, без бекенду) одним рухом.

---

## 6. Форми → Telegram + Email (без сторонніх сервісів)

### 6.1 Архітектура

```
[Browser]  →  POST /api/lead  (Next.js Route Handler, Edge runtime)
                      │
                      ├─→  Telegram Bot API   (sendMessage у чат власника)
                      └─→  Gmail SMTP         (Nodemailer, опційно)
```

### 6.2 Налаштування

**Telegram (основний канал, обов'язковий):**
1. Створити бота через `@BotFather` → отримати `BOT_TOKEN`.
2. Дізнатися `CHAT_ID` (особистий або групи) — через `@userinfobot` або `getUpdates`.
3. Зберегти у Vercel Environment Variables.

**Email (резервний, опційний):**
- Безкоштовний варіант: Gmail з App Password (`https://myaccount.google.com/apppasswords`) → Nodemailer SMTP.
- Лімит Gmail: 500 листів/добу — більш ніж достатньо.
- Альтернатива: будь-яка інша поштова скринька з SMTP.

### 6.3 Код Route Handler

```ts
// app/api/lead/route.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(2).max(80),
  phone: z.string().regex(/^\+?[0-9\s\-()]{10,20}$/),
  message: z.string().max(1000).optional(),
  source: z.string().optional(),    // звідки форма (hero/footer/service)
  honeypot: z.string().max(0),      // має бути порожнім
});

export const runtime = 'nodejs';    // потрібен для Nodemailer

const rateLimit = new Map<string, number>();   // in-memory (per-instance)

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown';
  const last = rateLimit.get(ip) ?? 0;
  if (Date.now() - last < 30_000) {
    return NextResponse.json({ ok: false, error: 'Too many requests' }, { status: 429 });
  }
  rateLimit.set(ip, Date.now());

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ ok: false }, { status: 400 });

  const { name, phone, message, source } = parsed.data;
  const text = `🔔 Нова заявка\n👤 ${name}\n📞 ${phone}\n📍 ${source ?? '-'}\n💬 ${message ?? '-'}`;

  // Telegram
  await fetch(`https://api.telegram.org/bot${process.env.TG_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: process.env.TG_CHAT_ID, text, parse_mode: 'HTML' }),
  });

  // Email (опційно)
  if (process.env.SMTP_USER) {
    const nodemailer = await import('nodemailer');
    const t = nodemailer.createTransport({
      host: 'smtp.gmail.com', port: 465, secure: true,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
    await t.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.LEAD_EMAIL,
      subject: `Заявка: ${name}`,
      text,
    });
  }

  return NextResponse.json({ ok: true });
}
```

### 6.4 ENV-змінні (Vercel)

```
TG_BOT_TOKEN=...
TG_CHAT_ID=...
SMTP_USER=info@example.com           # опц.
SMTP_PASS=app-password               # опц.
LEAD_EMAIL=owner@example.com         # опц.
NEXT_PUBLIC_PHONE=+380677107110
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### 6.5 Захист від спаму

- Honeypot-поле (`<input name="honeypot" hidden>`).
- Rate-limit (30 сек між заявками з одного IP).
- Zod-валідація формату телефону.
- Обмеження довжини полів.

---

## 7. SEO (технічний — деталі контенту в SEO-CORE.md)

### 7.1 Метадані

`generateMetadata` у кожному `page.tsx`:
- Унікальний title (50–60 знаків) і description (140–160) **для кожної локалі**.
- Open Graph (og:image — генерується через `opengraph-image.tsx`, з локалізованим текстом).
- Twitter Card.
- Canonical (на власний URL поточної локалі).
- `alternates.languages` → hreflang для uk + ru + x-default (uk).

### 7.2 Structured Data (JSON-LD)

Helper `components/seo/JsonLd.tsx`:
- `LocalBusiness` (тип `FuneralHome`) — у `layout.tsx` (глобально).
- `Service` — на кожній `/poslugy/[slug]/`.
- `Product` + `Offer` — на картках товарів.
- `FAQPage` — там, де є FAQ.
- `BreadcrumbList` — на всіх не-головних.
- `Article` — у блозі та порадниках.

### 7.3 Файли

- `app/sitemap.ts` — автогенерація з MDX-контенту, **записує обидві локалі** з блоками `<xhtml:link rel="alternate" hreflang="...">`.
- `app/robots.ts` — allow all + sitemap.
- `app/opengraph-image.tsx` — динамічна OG (per locale).

### 7.3a hreflang

У `generateMetadata`:
```ts
return {
  alternates: {
    canonical: `https://funeral.vn.ua${pathUk}`,
    languages: {
      'uk-UA': `https://funeral.vn.ua${pathUk}`,
      'ru-UA': `https://funeral.vn.ua/ru${pathUk}`,
      'x-default': `https://funeral.vn.ua${pathUk}`,
    },
  },
};
```
Sitemap дублює це через `<xhtml:link>` для кожного URL.

### 7.4 Цілі Core Web Vitals (75-percentile mobile)

- **LCP** < 2.0s
- **INP** < 200ms
- **CLS** < 0.05

### 7.5 Безпека/гігієна

- HTTPS (Vercel за замовч.).
- HSTS, CSP, X-Content-Type-Options — через `next.config.ts` `headers()`.
- Без cookies-tracking → банер не потрібен (GA4 у consent-mode або взагалі вимкнути cookie-tracking).

---

## 8. Структура репозиторію

```
funeral.vn.ua/
├─ app/
│  ├─ [locale]/
│  │  ├─ layout.tsx             # глобальний (header, footer, JSON-LD Organization)
│  │  ├─ page.tsx               # ГОЛОВНА = ХАБ (hero + усі послуги + відгуки + FAQ)
│  │  ├─ poslugy/[slug]/page.tsx
│  │  ├─ tovary/page.tsx
│  │  ├─ tovary/[category]/[slug]/page.tsx
│  │  ├─ tsiny/page.tsx
│  │  ├─ dopomoga/[slug]/page.tsx
│  │  ├─ poradnyk/[slug]/page.tsx
│  │  ├─ blog/page.tsx
│  │  ├─ blog/[slug]/page.tsx
│  │  ├─ pro-nas/page.tsx
│  │  ├─ kontakty/page.tsx
│  │  ├─ lokatsiyi/[slug]/page.tsx
│  │  ├─ opengraph-image.tsx
│  │  └─ not-found.tsx
│  ├─ api/lead/route.ts
│  ├─ sitemap.ts                # генерує uk + ru з hreflang
│  ├─ robots.ts
│  └─ fonts.ts
├─ middleware.ts                # next-intl routing (uk default, ru with prefix)
├─ i18n/
│  ├─ routing.ts                # locales config
│  └─ request.ts                # getRequestConfig
├─ messages/
│  ├─ uk.json                   # переклади UI (uk)
│  └─ ru.json                   # переклади UI (ru)
├─ components/
│  ├─ ui/                       # Button, Input, Accordion, Dialog, Tabs
│  ├─ sections/                 # Hero, ServiceGrid, PriceTable, FAQ, CTABar, ContactForm, Reviews, Map
│  ├─ layout/                   # Header, Footer, StickyCallButton, LanguageSwitcher
│  └─ seo/                      # JsonLd, Breadcrumbs
├─ content/
│  ├─ poslugy/*.{uk,ru}.mdx
│  ├─ poradnyk/*.{uk,ru}.mdx
│  ├─ blog/*.{uk,ru}.mdx
│  └─ tovary/<category>/*.{uk,ru}.mdx
├─ lib/
│  ├─ content.ts                # парсинг MDX (з підтримкою locale)
│  ├─ schema.ts                 # хелпери JSON-LD
│  └─ utils.ts                  # cn, formatPhone
├─ public/
│  ├─ images/                   # реальні фото залів, транспорту
│  ├─ favicon.ico
│  └─ robots-manual.txt
├─ next.config.ts               # redirects(), images, headers, next-intl plugin
├─ tailwind.config.ts
├─ tsconfig.json
└─ package.json
```

---

## 9. Покрокова реалізація

### Фаза 1 — Ініціалізація (день 1)

1. `pnpm create next-app@latest funeral.vn.ua --typescript --app --tailwind --eslint`
2. Додати залежності з §3.1.
3. Налаштувати `tsconfig.json` (paths: `@/*`), `next.config.ts` (images domains, headers, MDX).
4. Підключити шрифти у `app/fonts.ts`.
5. Створити CSS-змінні (`app/globals.css`) і Tailwind-теми.
6. Налаштувати ESLint + Prettier + Husky (pre-commit).
7. Створити репозиторій GitHub, підключити до Vercel preview.

### Фаза 2 — Каркас + i18n (дні 2–4)

1. Налаштувати `next-intl`: `i18n/routing.ts`, `middleware.ts`, `i18n/request.ts`.
2. Перенести роути під `app/[locale]/`.
3. Створити базові `messages/uk.json` і `messages/ru.json` (навігація, CTA, форма, footer).
4. `<LanguageSwitcher>` у Header.
5. `app/[locale]/layout.tsx`: Header (лого, телефон 24/7, навігація, перемикач мови), Footer (мапа сайту, NAP), `<StickyCallButton>` для mobile.
6. UI-примітиви (Button, Input, Accordion, Dialog) на основі Radix.
7. Глобальний `<JsonLd>` з `Organization` / `LocalBusiness` (локалізований).
8. `app/[locale]/not-found.tsx`, `app/error.tsx`.
9. `app/sitemap.ts` (з hreflang для обох локалей), `app/robots.ts`.

### Фаза 3 — Контент-шар MDX (дні 5–6)

1. `lib/content.ts` — функції читання `/content/**/*.{locale}.mdx` із fallback на `uk`.
2. Налаштувати MDX-провайдер (`mdx-components.tsx`) — кастомні `<h1>`, `<a>`, `<table>`.
3. Додати `remark-gfm`, `rehype-slug`, `rehype-autolink-headings`.
4. Створити шаблони сторінок: `poslugy/[slug]`, `poradnyk/[slug]`, `blog/[slug]` (читають за локаллю з URL).

### Фаза 4 — Головна (дні 7–9)

1. `Hero` — заголовок, телефон 24/7, форма «передзвоніть», фон-фото зали.
2. `ServiceGrid` — 4 групи карток (невідкладні / транспорт / спеціальні / церемоніальні).
3. `PricePackages` — 3 картки (Економ 12k / Стандарт 20k / Еліт 45k+).
4. `Trust` — фото команди, ліцензії, статистика.
5. `Reviews` — статичні відгуки з фото (MDX-файли у `/content/reviews/`).
6. `FAQ` — нативний `<details>` + Schema FAQPage.
7. `ServiceArea` — секція «Райони обслуговування»: пошук + tabs (Вінницький район / Вінницька область) + алфавітна сітка ~56 населених пунктів (текстові елементи, без окремих сторінок) + CTA «Дивитись повну зону обслуговування» → `/zona-obslugovuvannya/`. Дані з `data/locations.json`. Schema `ItemList`. Деталі — `LOCATIONS.md`.
8. `OfficesMap` — карта Leaflet з 3 офісами (Коновальця 83, Підлісна 2, Арабея 1).
9. `ContactForm` — форма + телефон + месенджери.

### Фаза 5 — Сторінки послуг (дні 10–14)

1. Шаблон `poslugy/[slug]/page.tsx`:
   - Хлібні крихти.
   - H1 + intro.
   - Що входить (список).
   - Прайс / пакети.
   - HowTo (кроки виклику).
   - FAQ.
   - Сигнали довіри.
   - Форма + телефон.
   - Супутні послуги.
2. Перенести контент усіх 22 послуг у MDX (з переписуванням під SEO) — українська версія.
3. Російські переклади (`*.ru.mdx`) — паралельно або після uk-готовності.
4. JSON-LD `Service` + `FAQPage` + `BreadcrumbList` — локалізовані.

### Фаза 6 — Інші розділи (дні 15–19)

1. `/tsiny/` — таблиці пакетів + калькулятор (чекбокси послуг → сума).
2. `/tovary/` — каталог + категорії (Schema `Product`).
3. `/dopomoga/[slug]/` — три сторінки про державну допомогу.
4. `/poradnyk/[slug]/` — cornerstone-контент.
5. `/blog/` + `/blog/[slug]/` — список + пост.
6. `/pro-nas/`, `/kontakty/`.
7. `/lokatsiyi/[slug]/` — лише 3 сторінки для офісів (Коновальця 83, Підлісна 2, Арабея 1).
8. Зона обслуговування — лише блок `<ServiceArea>` на головній (без окремої сторінки). Дані з `data/locations.json`. `LocalBusiness.areaServed` JSON-LD з усіма 56 локаціями.

### Фаза 7 — Форми + інтеграції (день 20)

1. `app/api/lead/route.ts` (Telegram + опц. Gmail). У повідомленні передавати локаль форми.
2. ENV-змінні у Vercel.
3. Тест на staging (uk + ru).
4. Підключити GA4 через `@next/third-parties/google` (з `language` параметром).
5. Vercel Web Analytics (одна змінна, безкоштовно).

### Фаза 8 — (видалено)

Редіректи не потрібні — новий сайт без міграції.

### Фаза 9 — QA (дні 22–25)

- Lighthouse mobile ≥95 на всіх ключових сторінках (uk + ru).
- axe DevTools — 0 critical a11y issues.
- Перевірка JSON-LD через Rich Results Test (обидві локалі).
- Перевірка hreflang через Search Console / hreflang validator.
- Перевірка форм (Telegram прийшло, email прийшов, спам відсічений).
- Тест на iPhone SE (375px), iPhone 14 Pro Max, Galaxy S23, iPad.
- Перевірка PWA-параметрів (manifest, theme-color).
- Перевірка перемикача мови на всіх типах сторінок.

### Фаза 10 — Реліз (день 26)

1. DNS на Vercel (A/CNAME).
2. Submit `sitemap.xml` у Search Console (з обома локалями).
3. У GSC: International Targeting → перевірка hreflang.
4. Перевірка `Coverage` у GSC через 1–2 дні.
5. Налаштування GBP (синхронізація NAP).

### Фаза 11 — Постзапуск (30 днів)

- Щотижневий моніторинг CWV у GSC.
- Аналіз форм (CR, джерела).
- Fix-list по знайденим проблемам.
- План публікацій блогу (1–2 пости/тиждень).

---

## 10. Перевірочний список перед запуском

- [ ] Lighthouse Performance / SEO / Accessibility / Best Practices ≥ 95 (uk + ru)
- [ ] Telegram-бот отримує тестову заявку (з обох локалей)
- [ ] Email (Gmail SMTP) отримує тестову заявку
- [ ] sitemap.xml містить усі сторінки + hreflang для uk/ru
- [ ] robots.txt дозволяє індексацію + посилається на sitemap
- [ ] hreflang валідний (uk-UA, ru-UA, x-default)
- [ ] JSON-LD валідується на Rich Results Test (LocalBusiness, Service, FAQ, Breadcrumb) — обидві локалі
- [ ] Open Graph працює (Facebook Sharing Debugger) — обидві локалі
- [ ] Sticky-CTA «Викликати агента» видно на mobile
- [ ] Перемикач мови працює на всіх типах сторінок (зберігає slug)
- [ ] Усі MDX-файли мають `*.uk.mdx` + `*.ru.mdx` (або явний fallback із noindex)
- [ ] Honeypot + rate-limit працюють
- [ ] Реальні фото (не сток) на головній і ключових сторінках
- [ ] Політика конфіденційності + публічна оферта (uk + ru)
- [ ] GBP синхронізовано (NAP консистентний)
- [ ] GA4 + Vercel Analytics підключено

---

## 11. Залишається для окремих документів

- **DESIGN.md** — палітра, типографіка (фінальна), компонентна бібліотека, моки головної + типової послуги, мобільний sticky-bar, стани форм, доступність, перемикач мови.
- **SEO-CORE.md** ✅ — семантичне ядро, кластери, meta, контент-план, перелінковка.
- **LOCATIONS.md** ✅ — повний список ~56 населених пунктів, structured data, дизайн блоку на головній, programmatic-сторінки.
- **TRANSLATIONS.md** — список усіх MDX, що потребують ru-перекладу + статус готовності + словник термінів (uk → ru).
- **KEYWORDS.md** ✅ — повний аналіз ahr.csv: 102 ключі розподілено по сторінках, виявлено 9 нових сторінок з реальним попитом (`vichna-pamyat`, `epitafii`, `pomynalni-dni`, `pamyatnyky` тощо).

---

*Документ — основа для розробки. Кожна фаза перевіряється перед переходом до наступної.*
