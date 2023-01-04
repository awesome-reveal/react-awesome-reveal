declare module 'astro:content' {
	export { z } from 'astro/zod';
	export type CollectionEntry<C extends keyof typeof entryMap> =
		typeof entryMap[C][keyof typeof entryMap[C]] & Render;

	type BaseCollectionConfig<S extends import('astro/zod').ZodRawShape> = {
		schema?: S;
		slug?: (entry: {
			id: CollectionEntry<keyof typeof entryMap>['id'];
			defaultSlug: string;
			collection: string;
			body: string;
			data: import('astro/zod').infer<import('astro/zod').ZodObject<S>>;
		}) => string | Promise<string>;
	};
	export function defineCollection<S extends import('astro/zod').ZodRawShape>(
		input: BaseCollectionConfig<S>
	): BaseCollectionConfig<S>;

	export function getEntry<C extends keyof typeof entryMap, E extends keyof typeof entryMap[C]>(
		collection: C,
		entryKey: E
	): Promise<typeof entryMap[C][E] & Render>;
	export function getCollection<
		C extends keyof typeof entryMap,
		E extends keyof typeof entryMap[C]
	>(
		collection: C,
		filter?: (data: typeof entryMap[C][E]) => boolean
	): Promise<(typeof entryMap[C][E] & Render)[]>;

	type InferEntrySchema<C extends keyof typeof entryMap> = import('astro/zod').infer<
		import('astro/zod').ZodObject<Required<ContentConfig['collections'][C]>['schema']>
	>;

	type Render = {
		render(): Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			injectedFrontmatter: Record<string, any>;
		}>;
	};

	const entryMap: {
		"docs": {
"attention-seekers.md": {
  id: "attention-seekers.md",
  slug: "attention-seekers",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"custom-animations.md": {
  id: "custom-animations.md",
  slug: "custom-animations",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"getting-started.md": {
  id: "getting-started.md",
  slug: "getting-started",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"older-browsers.md": {
  id: "older-browsers.md",
  slug: "older-browsers",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"performances.md": {
  id: "performances.md",
  slug: "performances",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"revealing-effects.md": {
  id: "revealing-effects.md",
  slug: "revealing-effects",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
"typescript-support.md": {
  id: "typescript-support.md",
  slug: "typescript-support",
  body: string,
  collection: "docs",
  data: InferEntrySchema<"docs">
},
},

	};

	type ContentConfig = typeof import("./config");
}
