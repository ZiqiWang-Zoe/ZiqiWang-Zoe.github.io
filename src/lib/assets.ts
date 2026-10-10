/** Resolve public assets under the GitHub Pages repository base path. */
export const assetUrl = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`;
