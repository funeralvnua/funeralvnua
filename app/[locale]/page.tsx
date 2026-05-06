import { setRequestLocale } from 'next-intl/server';
import { Hero } from '@/components/sections/Hero';
import { ServiceGrid } from '@/components/sections/ServiceGrid';
import { PricePackages } from '@/components/sections/PricePackages';
import { Trust } from '@/components/sections/Trust';
import { Reviews } from '@/components/sections/Reviews';
import { ServiceArea } from '@/components/sections/ServiceArea';
import { FAQ } from '@/components/sections/FAQ';
import { Contacts } from '@/components/sections/Contacts';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <ServiceGrid />
      <PricePackages />
      <Trust />
      <Reviews />
      <ServiceArea />
      <FAQ />
      <Contacts />
    </>
  );
}
