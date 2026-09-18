import type { APIRoute, GetStaticPaths } from 'astro';
import researchData from '../data/research.json';
import { researchSchema } from './research';
import { getCitation } from './citations';

export function citationPaths(
  extension: 'txt' | 'bib' | 'ris',
): GetStaticPaths {
  return () => {
    const papers = researchSchema
      .parse(researchData)
      .directions.flatMap((d) => d.papers);
    const ids = new Set(
      papers
        .filter((p) => p.publication?.status === 'published' && p.citationId)
        .map((p) => p.citationId!),
    );
    return [...ids].map((id) => {
      const format = getCitation(id).formats.find(
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
