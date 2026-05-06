'use client';

import { useEffect } from 'react';
import { Phone, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SITE } from '@/lib/utils';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="hero-gradient">
      <div className="container-content py-16 md:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-heading text-5xl text-[--color-accent] md:text-7xl">
            Сталася помилка
          </p>
          <div className="divider-gold mx-auto mt-6 max-w-[80px]" />

          <p className="mt-8 text-lg text-[--color-ink-soft]">
            На жаль, на сторінці виникла технічна помилка. Спробуйте оновити сторінку
            або зателефонуйте нам напряму.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button onClick={reset} variant="outline" size="lg">
              <RefreshCw className="h-4 w-4" aria-hidden />
              Спробувати ще раз
            </Button>
            <a
              href={`tel:${SITE.phone}`}
              className="group inline-flex items-center gap-2 rounded-full bg-[--color-emergency] px-6 py-3 font-semibold text-white shadow-md transition-all hover:opacity-90"
            >
              <Phone className="h-4 w-4 transition-transform group-hover:rotate-12" aria-hidden />
              {SITE.phoneDisplay}
            </a>
          </div>

          {error.digest && (
            <p className="mt-12 text-xs text-[--color-ink-muted]">
              Код помилки: <code className="font-mono">{error.digest}</code>
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
