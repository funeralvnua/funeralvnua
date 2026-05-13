import { useTranslations } from 'next-intl';
import { ShieldCheck, Clock, Wallet, Award } from 'lucide-react';
import { RitualImage } from '@/components/ui/RitualImage';

export function Trust() {
  const t = useTranslations('trust');

  const items = [
    { Icon: Award, title: t('p1Title'), text: t('p1Text') },
    { Icon: Clock, title: t('p2Title'), text: t('p2Text') },
    { Icon: Wallet, title: t('p3Title'), text: t('p3Text') },
    { Icon: ShieldCheck, title: t('p4Title'), text: t('p4Text') },
  ];

  return (
    <section
      aria-labelledby="trust-heading"
      className="relative isolate overflow-hidden py-20 md:py-28"
    >
      {/* Full-bleed фото-фон з затемненням */}
      <div className="absolute inset-0 -z-10">
        <RitualImage
          photoKey="home.trust"
          variant="hero"
          className="h-full w-full"
        />
        <div className="absolute inset-0 bg-[--color-bg]/85" />
        <div className="absolute inset-0 bg-gradient-to-b from-[--color-bg] via-transparent to-[--color-bg]" />
      </div>

      <div className="container-content">
        <div className="max-w-3xl">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[--color-accent]">
            {t('title')}
          </span>
          <h2 id="trust-heading" className="mt-3">
            {t('p1Title')}
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ Icon, title, text }) => (
            <div
              key={title}
              className="card-hover rounded-2xl border border-[--color-border] bg-[--color-surface]/90 p-6 backdrop-blur-sm"
            >
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-md bg-[--color-accent-100]">
                <Icon className="h-5 w-5 text-[--color-accent]" aria-hidden />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-[--color-ink]">{title}</h3>
              <p className="mt-2 text-sm text-[--color-ink-soft]">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
