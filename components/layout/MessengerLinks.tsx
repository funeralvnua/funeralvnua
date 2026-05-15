import { SITE } from '@/lib/utils';

interface Props {
  className?: string;
  size?: 'sm' | 'md';
}

export function MessengerLinks({ className, size = 'md' }: Props) {
  const sizeStyles =
    size === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-3.5 py-2 text-sm';

  return (
    <ul
      className={['flex flex-wrap gap-2', className].filter(Boolean).join(' ')}
      aria-label="Месенджери"
    >
      <li>
        <a
          href={SITE.messengers.telegram}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Написати в Telegram"
          className={`inline-flex items-center rounded-full bg-[#229ED9] font-semibold text-white transition-opacity hover:opacity-90 ${sizeStyles}`}
        >
          Telegram
        </a>
      </li>
      <li>
        <a
          href={SITE.messengers.viber}
          aria-label="Написати у Viber"
          className={`inline-flex items-center rounded-full bg-[#7360F2] font-semibold text-white transition-opacity hover:opacity-90 ${sizeStyles}`}
        >
          Viber
        </a>
      </li>
      <li>
        <a
          href={SITE.messengers.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Написати у WhatsApp"
          className={`inline-flex items-center rounded-full bg-[#25D366] font-semibold text-white transition-opacity hover:opacity-90 ${sizeStyles}`}
        >
          WhatsApp
        </a>
      </li>
    </ul>
  );
}
