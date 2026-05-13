import { useTranslations } from 'next-intl';
import { Phone, Check } from 'lucide-react';
import { CallbackForm } from './CallbackForm';
import { RitualImage } from '@/components/ui/RitualImage';
import { SITE } from '@/lib/utils';

export function Hero() {
  const t = useTranslations('hero');
  const tCta = useTranslations('cta');

  return (
    <section className="hero-gradient relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <RitualImage
          photoKey="home.hero"
          variant="hero"
          priority
          className="h-full w-full"
          imgClassName="opacity-15 md:opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[--color-surface] via-[--color-surface]/85 to-[--color-surface]/40" />
      </div>

      <div className="container-content py-14 md:py-24">
        <div className="grid gap-12 md:grid-cols-2 md:items-start">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-[--color-border] bg-[--color-surface]/90 px-4 py-1.5 text-xs uppercase tracking-[0.18em] text-[--color-accent] backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-[--color-accent]" aria-hidden />
              24/7 · Вінниця та область
            </span>

            <h1 className="mt-6">{t('title')}</h1>

            <div className="divider-gold mt-6 max-w-[80px]" />

            <p className="mt-6 max-w-xl text-lg text-[--color-ink-soft] md:text-xl">
              {t('subtitle')}
            </p>

            <ul className="mt-8 space-y-3">
              {(['benefit1', 'benefit2', 'benefit3'] as const).map((k) => (
                <li key={k} className="flex items-start gap-3">
                  <Check className="mt-1 h-5 w-5 shrink-0 text-[--color-accent]" aria-hidden />
                  <span className="text-base text-[--color-ink-soft] md:text-lg">{t(k)}</span>
                </li>
              ))}
            </ul>

            <a
              href={`tel:${SITE.phone}`}
              className="group mt-10 inline-flex items-center gap-3 rounded-full bg-[--color-emergency] px-7 py-4 text-base font-semibold tracking-wide text-white shadow-md transition-all hover:opacity-90"
              aria-label={`${tCta('callNow')} — ${SITE.phoneDisplay}`}
            >
              <Phone className="h-5 w-5 transition-transform group-hover:rotate-12" aria-hidden />
              <span>{tCta('callNow')}</span>
              <span className="hidden text-white/85 md:inline">· {SITE.phoneDisplay}</span>
            </a>
          </div>

          <CallbackForm source="hero" />
        </div>
      </div>
    </section>
  );
}
