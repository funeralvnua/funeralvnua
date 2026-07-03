import type { ReactNode } from 'react';
import type { Metadata, Viewport } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing, type Locale } from '@/i18n/routing';
import { GoogleAnalytics } from '@next/third-parties/google';
import { Analytics } from '@vercel/analytics/next';

function isValidLocale(value: string): value is Locale {
  return (routing.locales as readonly string[]).includes(value);
}
import { heading, body } from '@/app/fonts';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { StickyCallButton } from '@/components/layout/StickyCallButton';
import { getLocalBusinessSchema, jsonLdScript } from '@/lib/schema';
import { SITE } from '@/lib/utils';
import { buildUrl } from '@/lib/utils';
import '@/app/globals.css';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};

  const t = await getTranslations({ locale, namespace: 'site' });

  return {
    metadataBase: new URL(SITE.url),
    title: {
      default: t('name'),
      template: `%s | ${t('shortName')}`,
    },
    description: t('description'),
    alternates: {
      canonical: buildUrl('', locale as Locale),
      languages: {
        'uk-UA': buildUrl('', 'uk'),
        'ru-UA': buildUrl('', 'ru'),
        'x-default': buildUrl('', 'uk'),
      },
    },
    openGraph: {
      type: 'website',
      locale: locale === 'uk' ? 'uk_UA' : 'ru_UA',
      siteName: t('name'),
      title: t('name'),
      description: t('description'),
      images: ['/logo.webp'],
    },
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: 'any' },
        { url: '/favicon.svg', type: 'image/svg+xml' },
        { url: '/favicon-96x96.png', type: 'image/png', sizes: '96x96' },
      ],
      apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
      shortcut: '/favicon.ico',
    },
    manifest: '/site.webmanifest',
    robots: { index: true, follow: true },
  };
}

export const viewport: Viewport = {
  themeColor: '#1a1714',
  colorScheme: 'dark',
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  setRequestLocale(locale);

  const messages = await getMessages();
  const businessSchema = getLocalBusinessSchema(locale);
  const tSkip = (await getTranslations({ locale, namespace: 'skip' }))('toContent');

  return (
    <html lang={locale} className={`${heading.variable} ${body.variable}`}>
      <body className="min-h-dvh antialiased">
        <a href="#main" className="skip-link">{tSkip}</a>
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main id="main" className="pb-20 md:pb-0">
            {children}
          </main>
          <Footer />
          <StickyCallButton />
        </NextIntlClientProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLdScript(businessSchema)}
        />
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
        <Analytics />
      </body>
    </html>
  );
}
