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
      className="container-content py-16 md:py-24"
    >
      <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-14 lg:items-start">
        {/* LEFT — фото */}
        <RitualImage
          photoKey="home.trust"
          variant="hero"
          aspectRatio="4 / 5"
          className="overflow-hidden rounded-2xl shadow-lg ring-1 ring-[--color-border] lg:sticky lg:top-24"
        />

        {/* RIGHT — заголовок + 4 картки 2×2 */}
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[--color-accent]">
            {t('title')}
          </span>
          <h2 id="trust-heading" className="mt-3">
            {t('p1Title')}
          </h2>
          <div className="divider-gold mt-4 max-w-[60px]" />

          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {items.map(({ Icon, title, text }) => (
              <div
                key={title}
                className="card-hover rounded-2xl border border-[--color-border] bg-[--color-surface] p-6"
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
      </div>
    </section>
  );
}
