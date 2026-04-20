import { defineCollection, z } from "astro:content";
import {
  pluginsLoader,
  docsSectionsLoader,
  markdownFileLoader,
} from "@/content-loaders/niamoto";

export const collections = {
  plugins: defineCollection({
    loader: pluginsLoader(),
    schema: z.object({
      name: z.string(),
      type: z.enum([
        "transformer",
        "widget",
        "loader",
        "exporter",
        "deployer",
      ]),
      body: z.string(),
      version: z.string(),
    }),
  }),

  docsSections: defineCollection({
    loader: docsSectionsLoader(),
    schema: z.object({
      slug: z.string(),
      title: z.string(),
      audience: z.string().optional(),
      purpose: z.string(),
      href: z.string().url(),
    }),
  }),

  roadmap: defineCollection({
    loader: markdownFileLoader({ path: "ROADMAP.md" }),
    schema: z.object({
      body: z.string(),
    }),
  }),

  changelog: defineCollection({
    loader: markdownFileLoader({ path: "CHANGELOG.md" }),
    schema: z.object({
      body: z.string(),
    }),
  }),
};
