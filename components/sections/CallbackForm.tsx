'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations, useLocale } from 'next-intl';
import { Input } from '@/components/ui/Input';
import { Link } from '@/i18n/navigation';
import { Check, AlertCircle } from 'lucide-react';

const makeSchema = (t: ReturnType<typeof useTranslations<'form'>>) =>
  z.object({
    name: z.string().trim().min(2, t('required')).max(80),
    phone: z
      .string()
      .trim()
      .regex(/^\+?[0-9\s\-()]{10,20}$/, t('invalidPhone')),
    message: z.string().trim().max(1000).optional(),
    consent: z.literal(true, { errorMap: () => ({ message: t('required') }) }),
    honeypot: z.string().max(0),
  });

interface Props {
  source: string;
}

export function CallbackForm({ source }: Props) {
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

  return (
    <div
      id={source === 'hero' ? 'callback-form' : undefined}
      className="rounded-2xl border border-[--color-border] bg-[--color-surface] p-6 shadow-md md:p-8"
    >
      <h2 className="font-heading text-2xl md:text-3xl">{t('title')}</h2>
      <div className="divider-gold mt-3 max-w-[40px]" />
      <p className="mt-3 text-sm text-[--color-ink-soft]">{t('subtitle')}</p>

      {status === 'success' ? (
        <div className="mt-6 flex items-start gap-3 rounded-md bg-[--color-success]/10 p-4">
          <Check className="mt-0.5 h-5 w-5 text-[--color-success]" aria-hidden />
          <div>
            <p className="font-semibold">{t('successTitle')}</p>
            <p className="text-sm text-[--color-ink-soft]">{t('successText')}</p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 space-y-4">
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
            <label htmlFor={`${source}-name`} className="mb-1 block text-sm font-medium">
              {t('name')} <span className="text-[--color-danger]">*</span>
            </label>
            <Input
              id={`${source}-name`}
              {...register('name')}
              placeholder={t('namePlaceholder')}
              error={!!errors.name}
              aria-describedby={errors.name ? `${source}-name-error` : undefined}
            />
            {errors.name && (
              <p id={`${source}-name-error`} className="mt-1 text-xs text-[--color-danger]">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor={`${source}-phone`} className="mb-1 block text-sm font-medium">
              {t('phone')} <span className="text-[--color-danger]">*</span>
            </label>
            <Input
              id={`${source}-phone`}
              {...register('phone')}
              type="tel"
              inputMode="tel"
              placeholder={t('phonePlaceholder')}
              error={!!errors.phone}
              aria-describedby={errors.phone ? `${source}-phone-error` : undefined}
            />
            {errors.phone && (
              <p id={`${source}-phone-error`} className="mt-1 text-xs text-[--color-danger]">
                {errors.phone.message}
              </p>
            )}
          </div>

          <label className="flex items-start gap-2.5 text-sm text-[--color-ink-soft]">
            <input
              type="checkbox"
              defaultChecked
              {...register('consent')}
              className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-[--color-accent]"
              aria-invalid={!!errors.consent}
            />
            <span>
              {t('consent')}.{' '}
              <Link href="/polityka-konfidentsiynosti" className="underline hover:text-[--color-accent]">
                {t('consentLink')}
              </Link>
            </span>
          </label>
          {errors.consent && (
            <p className="text-xs text-[--color-danger]">{errors.consent.message}</p>
          )}

          <button
            type="submit"
            disabled={status === 'submitting'}
            className="group mt-2 inline-flex w-full items-center justify-center gap-3 rounded-full bg-[--color-emergency] px-7 py-4 font-semibold tracking-wide text-white shadow-md transition-all hover:opacity-90 disabled:opacity-50 disabled:pointer-events-none"
          >
            {status === 'submitting' ? t('submitting') : t('submit')}
          </button>

          {status === 'error' && (
            <div className="flex items-start gap-2 rounded-md bg-[--color-danger]/10 p-3 text-sm">
              <AlertCircle className="mt-0.5 h-4 w-4 text-[--color-danger]" aria-hidden />
              <span>{t('errorText')}</span>
            </div>
          )}
        </form>
      )}
    </div>
  );
}
