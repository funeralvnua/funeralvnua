// Root layout - лише делегує до [locale]/layout.tsx через next-intl middleware.
// Required for Next.js App Router з i18n.

import type { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
