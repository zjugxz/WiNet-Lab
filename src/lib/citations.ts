import { assetPath } from './paths';
import sources from '../data/citations/sources.json';
import { z } from 'astro/zod';

// One source supplies the displayed text, clipboard content and static download.
const files = import.meta.glob<string>('../data/citations/*.{bib,txt,ris}', {
  query: '?raw',
  import: 'default',
  eager: true,
});

const metadata = z
  .record(
    z.string(),
    z.object({
      url: z.url({ protocol: /^https$/ }),
      textStyle: z.enum(['Cell', 'IEEE']),
    }),
  )
  .parse(sources);

export function getCitation(id: string) {
  const source = metadata[id];
  if (!source) throw new Error(`Missing citation source for ${id}`);
  const formats = [
    {
      extension: 'txt',
      label: 'Text',
      description: `${source.textStyle} style · Copy into your document`,
      type: 'text/plain',
    },
    {
      extension: 'bib',
      label: 'BibTeX',
      description: 'For LaTeX and BibTeX-compatible reference tools',
      type: 'application/x-bibtex',
    },
    {
      extension: 'ris',
      label: 'RIS',
      description: 'For EndNote, Zotero and Mendeley',
      type: 'application/x-research-info-systems',
    },
  ].map((format) => {
    const value = files[`../data/citations/${id}.${format.extension}`];
    if (!value?.trim())
      throw new Error(`Missing ${format.label} source for ${id}`);
    return {
      ...format,
      text: value.replace(/\r\n?/g, '\n').trim() + '\n',
      filename: `${id}.${format.extension}`,
      href: assetPath(
        `research/citations/${encodeURIComponent(id)}.${format.extension}`,
      ),
    };
  });
  return { source, formats };
}
