import type { APIRoute, GetStaticPaths } from 'astro';
import researchData from '../data/research.json';
import publicationsData from '../data/publications.json';
import citationSources from '../data/citations/sources.json';
import { researchSchema } from './research';
import { getCitation, type CitationSection } from './citations';

export function citationPaths(
  extension: 'txt' | 'bib' | 'ris',
  section: CitationSection = 'research',
): GetStaticPaths {
  return () => {
    let ids: string[];
    if (section === 'publications') {
      // Every publication registered in sources.json gets exports; p03's
      // publication status is unconfirmed, so it stays out of the registry.
      const registered = new Set(Object.keys(citationSources));
      ids = (publicationsData as { id: string }[])
        .map((p) => p.id)
        .filter((id) => registered.has(id));
    } else {
      const papers = researchSchema
        .parse(researchData)
        .directions.flatMap((d) => d.papers);
      ids = papers
        .filter((p) => p.publication?.status === 'published' && p.citationId)
        .map((p) => p.citationId!);
    }
    return [...new Set(ids)].map((id) => {
      const format = getCitation(id, section).formats.find(
        (f) => f.extension === extension,
      )!;
      return {
        params: { id },
        props: { text: format.text, type: format.type },
      };
    });
  };
}

export const citationResponse: APIRoute = ({ props }) =>
  new Response(props.text, {
    headers: { 'Content-Type': `${props.type}; charset=utf-8` },
  });
