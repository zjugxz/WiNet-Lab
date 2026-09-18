import { citationPaths, citationResponse } from '../../../lib/citation-routes';

export const getStaticPaths = citationPaths('ris');
export const GET = citationResponse;
