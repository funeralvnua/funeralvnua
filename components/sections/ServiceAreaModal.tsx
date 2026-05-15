'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { X, MapPin } from 'lucide-react';
import { CallbackForm } from './CallbackForm';

interface Location {
  slug: string;
  name: string;
  distanceKm: number;
}

interface Props {
  location: Location | null;
  onClose: () => void;
}

export function ServiceAreaModal({ location, onClose }: Props) {
  const t = useTranslations('serviceArea');
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dlg = dialogRef.current;
    if (!dlg) return;
    if (location) {
      if (!dlg.open) dlg.showModal();
      document.body.style.overflow = 'hidden';
    } else {
      if (dlg.open) dlg.close();
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [location]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose();
      }}
      className="serviceArea-dialog mx-auto my-auto max-h-[92dvh] w-[min(94vw,520px)] overflow-y-auto overscroll-contain bg-transparent p-0 backdrop:bg-black/75 backdrop:backdrop-blur-sm"
    >
      {location && (
        <div className="editorial-form-card relative">
          <button
            type="button"
            onClick={onClose}
            aria-label={t('closeAria')}
            className="absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(201,165,96,0.3)] text-[var(--eda-gold,#c9a560)] transition-colors hover:border-[var(--eda-gold,#c9a560)] hover:bg-[var(--eda-gold,#c9a560)] hover:text-[#1a1410] md:right-4 md:top-4"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>

          <CallbackForm
            source={`service-area:${location.slug}`}
            bare
            header={
              <>
                <div className="pr-12 text-[10.5px] uppercase tracking-[0.32em] text-[var(--eda-gold,#c9a560)]">
                  {t('modalEyebrow')}
                </div>

                <h2 className="mt-3.5 pr-12 font-heading text-[24px] font-normal leading-[1.15] text-[var(--eda-ink,#f0e6d2)] sm:text-[26px] md:text-[32px]">
                  {t('modalTitle')}
                  <br />
                  <span className="font-normal italic text-[var(--eda-gold-bright,#e8c87a)]">
                    {t('modalTitleAccent')}
                  </span>
                </h2>

                <div className="mt-4 border-y border-[rgba(201,165,96,0.18)] py-3">
                  <div className="flex items-center gap-2 text-[10.5px] uppercase tracking-[0.28em] text-[var(--eda-ink-faint,#8a7f6e)]">
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-[var(--eda-gold,#c9a560)]" aria-hidden />
                    {t('modalSubPrefix')}
                  </div>
                  <div className="mt-1.5 flex items-baseline justify-between gap-3">
                    <span className="min-w-0 break-words font-heading text-lg italic text-[var(--eda-ink,#f0e6d2)]">
                      {location.name}
                    </span>
                    <span className="shrink-0 font-mono text-xs text-[var(--eda-ink-faint,#8a7f6e)]">
                      ~{location.distanceKm} {t('kmShort')}
                    </span>
                  </div>
                </div>
              </>
            }
          />
        </div>
      )}
    </dialog>
  );
}
