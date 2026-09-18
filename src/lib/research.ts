import { assetPath } from './paths';
import { z } from 'astro/zod';

const text = z.string().trim().min(1);
const id = text.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const file = text.refine(isLocalFile, 'Use a file path relative to public/');
const download = z.object({
  src: file,
  filename: text.regex(/^[^/\\]+$/).optional(),
});
const paperSchema = z
  .object({
    id,
    title: text,
    summary: text,
    citation: text.optional(),
    citationId: id.optional(),
    publication: z
      .object({
        venue: text.optional(),
        year: z.number().int().min(1900).max(2100).optional(),
        status: z.enum(['published', 'submitted']),
      })
      .optional(),
    preview: z
      .discriminatedUnion('type', [
        z.object({ type: z.literal('image'), src: file, alt: text }),
        z.object({
          type: z.literal('video'),
          src: file,
          poster: file.optional(),
          captions: z
            .object({ src: file, language: text, label: text })
            .optional(),
        }),
      ])
      .optional(),
    // null withholds the file and shows a non-downloadable submission placeholder.
    pdf: download.nullable().optional(),
    demo: download.optional(),
  })
  .refine(
    (paper) => !paper.citationId || paper.publication?.status === 'published',
    {
      message: 'Only published papers may provide citations',
      path: ['citationId'],
    },
  );
const uniqueIds = (items: { id: string }[]) =>
  new Set(items.map((item) => item.id)).size === items.length;
const directionSchema = z.object({
  id,
  title: text,
  subtitle: text,
  papers: z
    .array(paperSchema)
    .refine(uniqueIds, 'Paper IDs must be unique within each direction'),
});
export const researchSchema = z.object({
  directions: z
    .array(directionSchema)
    .refine(uniqueIds, 'Direction IDs must be unique'),
});
export type ResearchPaper = z.infer<typeof paperSchema>;
export type ResearchDirectionData = z.infer<typeof directionSchema>;

function isLocalFile(src: string): boolean {
  return (
    Boolean(src.trim()) &&
    !/[:\\?#]/.test(src) &&
    !src.startsWith('/') &&
    src
      .split('/')
      .every((segment) => segment && segment !== '.' && segment !== '..')
  );
}

/** Same-origin files keep native downloads working under the Pages base path. */
export function researchAssetPath(src: string): string {
  if (!isLocalFile(src)) {
    throw new Error(
      `Research assets must use a file path relative to public/: ${src}`,
    );
  }
  return assetPath(src.split('/').map(encodeURIComponent).join('/'));
}
