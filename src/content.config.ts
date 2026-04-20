import { defineCollection, z } from "astro:content";
import {
  pluginsLoader,
  docsSectionsLoader,
  markdownFileLoader,
} from "@/content-loaders/niamoto";

export const collections = {
  plugins: defineCollection({
    // TODO(julien): revert to default ref once feat/marketing-sync is merged.
    loader: pluginsLoader({ ref: "feat/marketing-sync" }),
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
