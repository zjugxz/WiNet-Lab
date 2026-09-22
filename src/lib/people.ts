import { assetPath } from './paths';
import { z } from 'astro/zod';

const text = z.string().trim().min(1);
const id = text.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const photo = text
  .regex(/^people\/[a-z0-9-]+\.webp$/, 'Use public/people/<id>.webp')
  .refine(
    (src) => !/[:\\?#]/.test(src) && !src.includes('..'),
    'Photo must be a file path relative to public/',
  );
const externalUrl = text.regex(/^https?:\/\/\S+$/, 'Use an http(s) URL');

const memberSchema = z.object({
  id,
  name: text,
  role: text.optional(),
  photo,
  age: z.number().int().min(15).max(100).optional(),
  email: text.regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Use a plain email address'),
  website: externalUrl.optional(),
  googleScholar: externalUrl.optional(),
  bio: z.array(text).min(1),
});
// Graduated members are listed without photos, dialogs or detail pages; only
// the fields needed for a compact alumni row are accepted.
const alumniSchema = z.object({
  id,
  name: text,
  degree: text.optional(),
  period: text.optional(),
  current: text.optional(),
  note: text.optional(),
  website: externalUrl.optional(),
});
const uniqueIds = (items: { id: string }[]) =>
  new Set(items.map((item) => item.id)).size === items.length;
const sectionSchema = z.object({
  id,
  title: text,
  members: z
    .array(memberSchema)
    .min(1)
    .refine(uniqueIds, 'Member IDs must be unique within each section'),
});
export const peopleSchema = z
  .object({
    sections: z
      .array(sectionSchema)
      .refine(uniqueIds, 'Section IDs must be unique'),
    alumni: z.array(alumniSchema).default([]),
  })
  .refine(
    (people) =>
      new Set([
        ...people.sections.flatMap((s) => s.members.map((m) => m.id)),
        ...people.alumni.map((m) => m.id),
      ]).size ===
      people.sections.reduce((n, s) => n + s.members.length, 0) +
        people.alumni.length,
    'Member and alumni IDs must be unique across the whole page',
  );
export type PeopleMember = z.infer<typeof memberSchema>;
export type PeopleSection = z.infer<typeof sectionSchema>;
export type PeopleAlumnus = z.infer<typeof alumniSchema>;

/** Same-origin photos keep working under the Pages base path. */
export function peoplePhotoPath(src: string): string {
  return assetPath(src.split('/').map(encodeURIComponent).join('/'));
}
