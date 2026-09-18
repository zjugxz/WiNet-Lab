import records from '../data/publications.json';

export const publicationTypes = {
  journal: 'Journal article',
  conference: 'Conference paper',
  poster: 'Poster',
  book: 'Book',
} as const;

export interface Publication {
  id: string;
  sourceNumber: number;
  title: string;
  authors: string[];
  year: number;
  venue: string;
  venueShort: string;
  type: keyof typeof publicationTypes;
  language: string;
  verification: 'verified' | 'pending';
  originalCitation: string;
  volume?: string;
  issue?: string;
  pages?: string;
  articleNumber?: string;
  doi?: string;
  url?: string;
  publishedOnline?: number[];
  isbnPrint?: string;
}

// Validate at build time so future content edits fail before producing a bad page.
const ids = new Set<string>();
for (const item of records) {
  if (
    !/^p\d+$/.test(item.id) ||
    ids.has(item.id) ||
    !item.title.trim() ||
    !item.venue.trim() ||
    !item.venueShort.trim() ||
    !item.authors.length ||
    item.authors.some((name) => !name.trim()) ||
    !Number.isInteger(item.year) ||
    item.year < 1900 ||
    item.year > 2100 ||
    !Object.hasOwn(publicationTypes, item.type) ||
    !['verified', 'pending'].includes(item.verification)
  ) {
    throw new Error(`Invalid publication: ${item.id}`);
  }
  if (item.url && new URL(item.url).protocol !== 'https:') {
    throw new Error(`Publication links must use HTTPS: ${item.id}`);
  }
  ids.add(item.id);
}

export const publications = (records as Publication[]).toSorted(
  (a, b) => b.year - a.year || a.sourceNumber - b.sourceNumber,
);
export const publicationYears = [
  ...new Set(publications.map((item) => item.year)),
];

export function publicationDetails(item: Publication): string {
  let details = item.volume || '';
  if (item.issue) details += `(${item.issue})`;
  if (item.pages)
    details += `${details ? ': ' : ''}${item.pages.replace(/(\d)-(\d)/g, '$1–$2')}`;
  if (item.articleNumber && !item.pages)
    details += `${details ? ', ' : ''}Article ${item.articleNumber}`;
  return [item.venue, String(item.year), details].filter(Boolean).join(' · ');
}
