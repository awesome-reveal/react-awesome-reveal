import type { CollectionEntry } from "astro:content";

type DocSlug = CollectionEntry<"docs">["slug"];

export function getDocPathname<S extends DocSlug>(slug: S): `/docs/${S}` {
  return `/docs/${slug}`;
}
