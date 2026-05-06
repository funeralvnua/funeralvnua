// Top-level not-found — потрапляють сюди лише запити поза локалями.
// next-intl сам обробляє локалізовані not-found через [locale]/not-found.tsx.

import Link from 'next/link';

export default function NotFound() {
  return (
    <html lang="uk">
      <body
        style={{
          fontFamily: 'system-ui, sans-serif',
          padding: '4rem 1.5rem',
          textAlign: 'center',
          color: '#1a1a1a',
          background: '#f8f5f0',
        }}
      >
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Сторінку не знайдено</h1>
        <p>
          <Link href="/" style={{ color: '#2c4a3e' }}>
            Повернутись на головну →
          </Link>
        </p>
      </body>
    </html>
  );
}
