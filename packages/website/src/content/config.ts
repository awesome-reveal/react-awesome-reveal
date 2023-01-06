import { defineCollection, z } from "astro:content";

const docs = defineCollection({
  schema: {
    title: z.string(),
    sortOrder: z.number(),
  },
});

export const collections = { docs };
