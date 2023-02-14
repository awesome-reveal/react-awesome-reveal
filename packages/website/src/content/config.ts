// eslint-disable-next-line import/no-unresolved
import { defineCollection, z } from "astro:content";

const docs = defineCollection({
  schema: z.object({
    title: z.string(),
    sortOrder: z.number(),
  }),
});

export const collections = {
  docs,
};
