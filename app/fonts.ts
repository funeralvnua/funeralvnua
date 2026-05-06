import { Cormorant_Garamond, Manrope } from 'next/font/google';

export const heading = Cormorant_Garamond({
  subsets: ['cyrillic', 'latin'],
  weight: ['500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

export const body = Manrope({
  subsets: ['cyrillic', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-manrope',
  display: 'swap',
});
