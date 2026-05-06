import { NextResponse } from 'next/server';
import { z } from 'zod';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const schema = z.object({
  name: z.string().trim().min(2).max(80),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9\s\-()]{10,20}$/, 'Невірний формат телефону'),
  message: z.string().trim().max(1000).optional(),
  source: z.string().trim().max(50).optional(),
  locale: z.enum(['uk', 'ru']).optional(),
  honeypot: z.string().max(0),
});

const rateLimit = new Map<string, number>();
const RATE_LIMIT_MS = 30_000;

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const last = rateLimit.get(ip) ?? 0;
  if (Date.now() - last < RATE_LIMIT_MS) {
    return NextResponse.json({ ok: false, error: 'Too many requests' }, { status: 429 });
  }
  rateLimit.set(ip, Date.now());

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Bad JSON' }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'Validation failed' }, { status: 400 });
  }

  const { name, phone, message, source, locale } = parsed.data;
  const text = [
    '🔔 <b>Нова заявка з сайту</b>',
    `👤 ${escapeHtml(name)}`,
    `📞 ${escapeHtml(phone)}`,
    source ? `📍 ${escapeHtml(source)}` : null,
    locale ? `🌐 ${locale}` : null,
    message ? `💬 ${escapeHtml(message)}` : null,
  ]
    .filter(Boolean)
    .join('\n');

  // 1. Telegram
  const tgToken = process.env.TG_BOT_TOKEN;
  const tgChat = process.env.TG_CHAT_ID;
  if (tgToken && tgChat) {
    try {
      await fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: tgChat, text, parse_mode: 'HTML' }),
      });
    } catch (err) {
      console.error('TG send failed', err);
    }
  }

  // 2. Email (Gmail SMTP optional)
  if (process.env.SMTP_USER && process.env.SMTP_PASS && process.env.LEAD_EMAIL) {
    try {
      const nodemailer = await import('nodemailer');
      const transport = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      });
      await transport.sendMail({
        from: process.env.SMTP_USER,
        to: process.env.LEAD_EMAIL,
        subject: `Заявка з сайту: ${name}`,
        text: text.replace(/<\/?b>/g, ''),
      });
    } catch (err) {
      console.error('Email send failed', err);
    }
  }

  return NextResponse.json({ ok: true });
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
