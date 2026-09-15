/** Shared base handling for pages and files on GitHub Pages project sites. */
export function assetPath(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}/${path.replace(/^\/+/, '')}`;
}

export function sitePath(path = ''): string {
  const suffix = path.replace(/^\/+|\/+$/g, '');
  return assetPath(`${suffix}${suffix ? '/' : ''}`);
}
