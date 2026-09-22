import { citationPaths, citationResponse } from '../../../lib/citation-routes';

export const getStaticPaths = citationPaths('bib', 'publications');
export const GET = citationResponse;
