import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind class names — `clsx` для умовних, `tailwind-merge` для дедуплікації.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://funeral.vn.ua';

/**
 * Constants — використовуються у компонентах і JSON-LD.
 */
export const SITE = {
  url: SITE_URL,
  phone: process.env.NEXT_PUBLIC_PHONE ?? '+380674597876',
  phoneDisplay: process.env.NEXT_PUBLIC_PHONE_DISPLAY ?? '(067) 459-78-76',
  phoneAlt1: '+380734597876',
  phoneAlt1Display: '(073) 459-78-76',
  emailLead: 'kp.kkp.vmrs@gmail.com',
  addresses: [
    {
      street: 'вул. Євгена Коновальця, 83',
      streetRu: 'ул. Евгения Коновальца, 83',
      lat: 49.2331,
      lon: 28.4682,
    },
    {
      street: 'вул. Підлісна, 2',
      streetRu: 'ул. Подлесная, 2',
      lat: 49.2199,
      lon: 28.4517,
    },
    {
      street: 'вул. Генерала Арабея, 1 (зали прощання)',
      streetRu: 'ул. Генерала Арабея, 1 (залы прощания)',
      lat: 49.2167,
      lon: 28.4417,
    },
  ],
} as const;

/**
 * Build canonical URL with trailing slash. Locale 'uk' = no prefix.
 * Always returns URL with `/` at the end (matches next.config trailingSlash).
 *
 * @example
 * buildUrl('', 'uk')                  → https://funeral.vn.ua/
 * buildUrl('poslugy/krematsiya', 'uk') → https://funeral.vn.ua/poslugy/krematsiya/
 * buildUrl('tsiny', 'ru')              → https://funeral.vn.ua/ru/tsiny/
 */
export function buildUrl(path: string, locale: 'uk' | 'ru' = 'uk'): string {
  const clean = path.replace(/^\/+|\/+$/g, ''); // strip leading/trailing slashes
  const prefix = locale === 'uk' ? '' : '/ru';
  if (!clean) {
    return `${SITE_URL}${prefix}/`;
  }
  return `${SITE_URL}${prefix}/${clean}/`;
}
