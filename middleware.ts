import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing, {
  // hreflang оголошуємо лише через HTML <link rel="alternate"> + sitemap
  // (формат uk-UA / ru-UA). Middleware Link-header додавав би дублюючі uk/ru.
  alternateLinks: false,
  // Не редіректити автоматично за Accept-Language — користувач сам обирає мову.
  localeDetection: false,
});

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
