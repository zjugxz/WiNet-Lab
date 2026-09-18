import type { APIRoute, GetStaticPaths } from 'astro';
import researchData from '../../../data/research.json';
import { researchSchema } from '../../../lib/research';
import { getBibtex } from '../../../lib/citations';

export const getStaticPaths: GetStaticPaths = () => {
  const papers = researchSchema
    .parse(researchData)
    .directions.flatMap((d) => d.papers);
  const ids = new Set(
    papers
      .filter((p) => p.publication?.status === 'published' && p.bibtex)
      .map((p) => p.bibtex!),
  );
  return [...ids].map((id) => ({
    params: { id },
    props: { bibtex: getBibtex(id) },
  }));
};

export const GET: APIRoute = ({ props }) =>
  new Response(props.bibtex, {
    headers: { 'Content-Type': 'application/x-bibtex; charset=utf-8' },
  });
