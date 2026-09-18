import { citationPaths, citationResponse } from '../../../lib/citation-routes';

export const getStaticPaths = citationPaths('txt');
export const GET = citationResponse;
