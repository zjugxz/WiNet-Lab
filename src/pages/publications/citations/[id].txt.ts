import { citationPaths, citationResponse } from '../../../lib/citation-routes';

export const getStaticPaths = citationPaths('txt', 'publications');
export const GET = citationResponse;
