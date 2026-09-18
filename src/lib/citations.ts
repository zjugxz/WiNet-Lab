import { assetPath } from './paths';

// One source supplies the displayed text, clipboard content and static download.
const files = import.meta.glob<string>('../data/citations/*.bib', {
  query: '?raw',
  import: 'default',
  eager: true,
});

export function getBibtex(id: string): string {
  const value = files[`../data/citations/${id}.bib`];
  if (!value) throw new Error(`Missing BibTeX source for ${id}`);
  return value.replace(/\r\n?/g, '\n').trim() + '\n';
}

export function bibtexPath(id: string): string {
  return assetPath(`research/citations/${encodeURIComponent(id)}.bib`);
}
