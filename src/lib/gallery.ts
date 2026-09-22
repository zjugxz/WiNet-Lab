import { assetPath } from './paths';
import { z } from 'astro/zod';

const text = z.string().trim().min(1);
const id = text.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const photo = text
  .regex(/^gallery\/[a-z0-9-]+\/[a-z0-9-]+\.webp$/, 'Use public/gallery/<group-id>/<photo-id>.webp')
  .refine(
    (src) => !/[:\\?#]/.test(src) && !src.includes('..'),
    'Photos must be file paths relative to public/',
  );

const groupSchema = z.object({
  id,
  title: text,
  date: text.regex(/^\d{4}(-\d{2})?$/, 'Use YYYY or YYYY-MM'),
  description: text.optional(),
  photos: z
    .array(
      z.object({
        id,
        src: photo,
        alt: text,
      }),
    )
    .min(1),
});
const uniqueIds = (items: { id: string }[]) =>
  new Set(items.map((item) => item.id)).size === items.length;
export const gallerySchema = z.object({
  intro: text,
  groups: z
    .array(groupSchema)
    .refine(uniqueIds, 'Group IDs must be unique')
    .refine(
      (groups) =>
        new Set(groups.flatMap((g) => g.photos.map((p) => p.id))).size ===
        groups.reduce((n, g) => n + g.photos.length, 0),
      'Photo IDs must be unique across groups',
    ),
});
export type GalleryGroup = z.infer<typeof groupSchema>;

/** Same-origin gallery photos keep working under the Pages base path. */
export function galleryPhotoPath(src: string): string {
  return assetPath(src.split('/').map(encodeURIComponent).join('/'));
}
