import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Вінницька міська ритуальна служба';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpenGraphImage({
  params,
}: {
  params: { locale: string };
}) {
  const isUk = params.locale === 'uk';
  const title = isUk
    ? 'Вінницька міська ритуальна служба'
    : 'Винницкая городская ритуальная служба';
  const subtitle = isUk
    ? 'Цілодобова організація поховань — Вінниця та область'
    : 'Круглосуточная организация похорон — Винница и область';
  const phone = '(067) 459-78-76';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background:
            'linear-gradient(135deg, #1a1714 0%, #221e1a 50%, #2a2520 100%)',
          color: '#f3eee5',
          padding: '80px 96px',
          position: 'relative',
        }}
      >
        {/* Радіальне тінтування — теплий golden glow */}
        <div
          style={{
            position: 'absolute',
            top: -200,
            right: -150,
            width: 600,
            height: 600,
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(201, 165, 96, 0.15) 0%, transparent 70%)',
          }}
        />

        {/* Eyebrow */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            color: '#c9a560',
            fontSize: 22,
            fontWeight: 600,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            marginBottom: 32,
          }}
        >
          <span style={{ width: 8, height: 8, borderRadius: 8, background: '#c9a560' }} />
          24/7 · {isUk ? 'Вінниця та область' : 'Винница и область'}
        </div>

        {/* Title — серифом */}
        <div
          style={{
            display: 'flex',
            fontSize: 72,
            fontWeight: 500,
            lineHeight: 1.1,
            letterSpacing: '-0.01em',
            maxWidth: 900,
          }}
        >
          {title}
        </div>

        {/* Gold divider */}
        <div
          style={{
            display: 'flex',
            width: 100,
            height: 1,
            background:
              'linear-gradient(90deg, #c9a560 0%, transparent 100%)',
            marginTop: 40,
            marginBottom: 32,
          }}
        />

        {/* Subtitle */}
        <div
          style={{
            display: 'flex',
            fontSize: 32,
            color: '#b8b1a3',
            lineHeight: 1.4,
            maxWidth: 900,
          }}
        >
          {subtitle}
        </div>

        {/* Phone — внизу */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginTop: 'auto',
            color: '#c9a560',
            fontSize: 36,
            fontWeight: 700,
            letterSpacing: '0.05em',
          }}
        >
          📞 {phone}
        </div>
      </div>
    ),
    { ...size },
  );
}
