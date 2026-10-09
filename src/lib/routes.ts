// URL builders shared by server and client code (no database imports here).

export function categoryHref(slug: string) {
  return `/categories/${slug}`;
}

export function collectionHref(slug: string) {
  return `/collections/${slug}`;
}
