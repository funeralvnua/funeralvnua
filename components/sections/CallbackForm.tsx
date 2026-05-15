'use client';

import { useState, type ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Check, AlertCircle } from 'lucide-react';
import { SITE } from '@/lib/utils';

const makeSchema = (t: ReturnType<typeof useTranslations<'form'>>) =>
  z.object({
    name: z.string().trim().min(2, t('required')).max(80),
    phone: z
      .string()
      .trim()
      .regex(/^\+?[0-9\s\-()]{10,20}$/, t('invalidPhone')),
    consent: z.literal(true, { errorMap: () => ({ message: t('required') }) }),
    honeypot: z.string().max(0),
  });

interface Props {
  source: string;
  header?: ReactNode;
  bare?: boolean;
}

export function CallbackForm({ source, header, bare = false }: Props) {
  const t = useTranslations('form');
  const locale = useLocale();
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const schema = makeSchema(t);
  type FormValues = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { honeypot: '', consent: true },
  });

  const onSubmit = async (data: FormValues) => {
    setStatus('submitting');
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, source, locale }),
      });
      if (!res.ok) throw new Error('Lead failed');
      setStatus('success');
      reset();
    } catch {
      setStatus('error');
    }
  };

  const nameId = `${source}-eda-name`;
  const phoneId = `${source}-eda-phone`;

  return (
    <div
      id={source === 'hero' ? 'callback-form' : undefined}
      className={bare ? undefined : 'editorial-form-card'}
    >
      {header ?? (
        <>
          <div className="text-[10.5px] uppercase tracking-[0.32em] text-[var(--eda-gold,#c9a560)]">
            {t('editorialEyebrow')}
          </div>

          <h2 className="mt-3.5 font-heading text-[26px] font-normal leading-[1.15] text-[var(--eda-ink,#f0e6d2)] md:text-[32px]">
            {t('editorialTitleA')}
            <br />
            <span className="font-normal italic text-[var(--eda-gold-bright,#e8c87a)]">
              {t('editorialTitleB')}
            </span>
          </h2>

          <p className="mt-3 text-[13px] font-light leading-[1.5] text-[var(--eda-ink-faint,#8a7f6e)]">
            {t('editorialSub')}
          </p>
        </>
      )}

      {status === 'success' ? (
        <div className="mt-8 flex flex-col items-center gap-4 py-8">
          <Check className="h-8 w-8 text-[var(--eda-gold-bright,#e8c87a)]" aria-hidden />
          <p className="font-heading text-2xl italic text-[var(--eda-gold-bright,#e8c87a)]">
            {t('successTitle')}
          </p>
          <p className="max-w-[280px] text-center text-[13px] leading-[1.55] text-[var(--eda-ink-faint,#8a7f6e)]">
            {t('successText')}
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-8 space-y-5">
          {/* Honeypot */}
          <input
            {...register('honeypot')}
            type="text"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden
            className="absolute left-[-9999px]"
          />

          <div>
            <label
              htmlFor={nameId}
              className="mb-2 block text-[10px] font-medium uppercase tracking-[0.3em] text-[var(--eda-ink-faint,#8a7f6e)]"
            >
              {t('name')}
            </label>
            <input
              id={nameId}
              {...register('name')}
              placeholder={t('namePlaceholder')}
              className="editorial-input"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? `${nameId}-error` : undefined}
            />
            {errors.name && (
              <p
                id={`${nameId}-error`}
                className="mt-1.5 font-heading text-[13px] italic text-[var(--color-danger)]"
              >
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor={phoneId}
              className="mb-2 block text-[10px] font-medium uppercase tracking-[0.3em] text-[var(--eda-ink-faint,#8a7f6e)]"
            >
              {t('phone')}
            </label>
            <input
              id={phoneId}
              {...register('phone')}
              type="tel"
              inputMode="tel"
              placeholder={t('phonePlaceholder')}
              className="editorial-input"
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? `${phoneId}-error` : undefined}
            />
            {errors.phone && (
              <p
                id={`${phoneId}-error`}
                className="mt-1.5 font-heading text-[13px] italic text-[var(--color-danger)]"
              >
                {errors.phone.message}
              </p>
            )}
          </div>

          <label className="flex cursor-pointer select-none items-start gap-3 pt-1 text-[11.5px] leading-[1.55] text-[var(--eda-ink-faint,#8a7f6e)]">
            <input
              type="checkbox"
              defaultChecked
              {...register('consent')}
              className="mt-0.5 h-3.5 w-3.5 shrink-0 cursor-pointer appearance-none border border-[rgba(201,165,96,0.4)] bg-transparent transition-colors checked:border-[var(--eda-gold,#c9a560)] checked:bg-[var(--eda-gold,#c9a560)]"
              aria-invalid={!!errors.consent}
            />
            <span>
              {t('consent')}.{' '}
              <Link
                href="/polityka-konfidentsiynosti"
                className="border-b border-[rgba(201,165,96,0.3)] text-[var(--eda-gold,#c9a560)] hover:border-[var(--eda-gold,#c9a560)]"
              >
                {t('consentLink')}
              </Link>
            </span>
          </label>
          {errors.consent && (
            <p className="font-heading text-[13px] italic text-[var(--color-danger)]">
              {errors.consent.message}
            </p>
          )}

          <button
            type="submit"
            disabled={status === 'submitting'}
            className="editorial-submit mt-3"
          >
            <span>{status === 'submitting' ? t('submitting') : t('submit')}</span>
          </button>

          {status === 'error' && (
            <div className="flex items-start gap-2 border border-[var(--color-danger)]/40 bg-[var(--color-danger)]/10 p-3 text-sm">
              <AlertCircle
                className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-danger)]"
                aria-hidden
              />
              <span>{t('errorText')}</span>
            </div>
          )}

          <div className="mt-5 text-center text-[11px] tracking-wide text-[var(--eda-ink-faint,#8a7f6e)]">
            {t('editorialFoot')}{' '}
            <a
              href={`tel:${SITE.phone}`}
              className="font-medium text-[var(--eda-gold,#c9a560)] hover:text-[var(--eda-gold-bright,#e8c87a)]"
            >
              {SITE.phoneDisplay}
            </a>
          </div>
        </form>
      )}
    </div>
  );
}
