# Image optimization pipeline

## Quick start

```powershell
# 1. install dep (one-time)
pnpm add -D sharp

# 2. drop originals into raw-photos/ (any jpg/png/tiff/webp, any size)

# 3. run
pnpm optimize:images
```

## Output

For each `raw-photos/MY-FILE.jpg` the script generates in `public/images/`:

| File | Size | Use |
|---|---|---|
| `my-file-hero.{jpg,webp,avif}` | 1920w | Hero sections |
| `my-file-hero@2x.{jpg,webp,avif}` | 2560w | Retina hero |
| `my-file-card.{jpg,webp,avif}` | 800w | Service / category cards |
| `my-file-thumb.{jpg,webp,avif}` | 400w | List thumbnails |
| `my-file-og.{jpg,webp,avif}` | 1200×630 (cover-crop) | Open Graph |

Plus a lightweight copy in `raw-photos/for-claude/MY-FILE.webp` (1024w, ~80 KB) — send this folder to Claude for content analysis and page assignment.

## Notes

- Filenames are kebab-cased automatically (`Photo 2025.JPG` → `photo-2025-hero.webp`).
- EXIF orientation is honored (`.rotate()`).
- mozjpeg + webp effort 5 + avif effort 5 → optimal quality/size.
- `raw-photos/` is gitignored — only `public/images/` is committed.
