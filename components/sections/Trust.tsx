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
      <div className="grid gap-10 md:grid-cols-[1fr_1fr] md:items-end">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[--color-accent]">
            {t('title')}
          </span>
        </div>
        <RitualImage
          photoKey="home.trust"
          variant="card"
          aspectRatio="16 / 10"
          className="hidden rounded-2xl shadow-sm md:block"
        />
      </div>

      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(({ Icon, title, text }) => (
          <div
            key={title}
            className="rounded-xl border border-[--color-border] bg-[--color-surface] p-6 transition-colors hover:border-[--color-accent]/50"
          >
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-md bg-[--color-accent-100]">
              <Icon className="h-5 w-5 text-[--color-accent]" aria-hidden />
            </div>
            <h3 className="mt-5 text-lg font-semibold text-[--color-ink]">{title}</h3>
            <p className="mt-2 text-sm text-[--color-ink-soft]">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
