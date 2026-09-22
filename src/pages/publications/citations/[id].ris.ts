import { citationPaths, citationResponse } from '../../../lib/citation-routes';

export const getStaticPaths = citationPaths('ris', 'publications');
export const GET = citationResponse;
