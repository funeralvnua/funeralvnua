import { RitualImage } from '@/components/ui/RitualImage';
import { getPhoto } from '@/lib/photos';

interface MdxPhotoProps {
  photoKey: string;
  caption?: string;
  aspectRatio?: string;
}

export function MdxPhoto({ photoKey, caption, aspectRatio = '16 / 9' }: MdxPhotoProps) {
  if (!getPhoto(photoKey)) return null;

  return (
    <figure className="not-prose my-10">
      <RitualImage
        photoKey={photoKey}
        variant="hero"
        aspectRatio={aspectRatio}
        className="overflow-hidden rounded-2xl shadow-lg ring-1 ring-[--color-border]"
      />
      {caption && (
        <figcaption className="mt-3 text-sm italic text-[--color-ink-muted]">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
