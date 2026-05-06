# ritual.vn.ua

Сайт Вінницької міської ритуальної служби.
Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · MDX · next-intl (uk + ru) · Vercel.

## Старт

```bash
pnpm install
cp .env.example .env.local   # заповнити TG_BOT_TOKEN тощо
pnpm dev
```

Відкрити: <http://localhost:3000>

## Скрипти

- `pnpm dev` — режим розробки (Turbopack)
- `pnpm build` — production build
- `pnpm start` — запуск production
- `pnpm lint` — ESLint
- `pnpm typecheck` — TypeScript без emit
- `pnpm format` — Prettier

## Структура

```
app/
  [locale]/        # uk (default), ru — через next-intl
  api/lead/        # форми → Telegram + Gmail SMTP
  sitemap.ts
  robots.ts
  globals.css
  fonts.ts
components/
  ui/              # Button, Input
  layout/          # Header, Footer, StickyCallButton, LanguageSwitcher, PhoneLink
content/           # MDX (послуги, поради, блог)
data/
  locations.json   # ~56 населених пунктів зони обслуговування
i18n/
  routing.ts
  request.ts
  navigation.ts
lib/
  utils.ts
  schema.ts
messages/
  uk.json
  ru.json
middleware.ts      # next-intl
```

## Документація

- `PLAN.md` — архітектура та фази розробки
- `DESIGN.md` — дизайн-система (палітра, типографіка, моки)
- `SEO-CORE.md` — стратегія SEO + семантичне ядро
- `KEYWORDS.md` — аналіз ahr.csv (102 ключі), нові сторінки
- `LOCATIONS.md` — ~56 населених пунктів зони обслуговування

## Деплой

Vercel — автоматичний deploy на push у `main`.
ENV-змінні: див. `.env.example`.
