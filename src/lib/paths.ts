/** One URL helper for both root sites and GitHub Pages project sites. */
export function sitePath(path = ''): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const suffix = path.replace(/^\/+|\/+$/g, '');
  return `${base}/${suffix}${suffix ? '/' : ''}`;
}
