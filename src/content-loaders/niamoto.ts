/**
 * Astro Content Layer loaders for the niamoto GitHub repository.
 *
 * Fetches live data at build time from raw.githubusercontent.com.
 * Rebuilds are triggered by the niamoto repo's marketing-sync workflow.
 */
import type { Loader } from "astro/loaders";

const REPO = "niamoto/niamoto";
const DEFAULT_REF = "main";

const raw = (ref: string, path: string) =>
  `https://raw.githubusercontent.com/${REPO}/${ref}/${path}`;

async function fetchText(url: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url} — HTTP ${res.status}`);
  }
  return res.text();
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url} — HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

type PluginEntry = {
  name: string;
  type: "transformer" | "widget" | "loader" | "exporter" | "deployer";
  body: string;
  version: string;
} & Record<string, unknown>;

export function pluginsLoader({ ref = DEFAULT_REF } = {}): Loader {
  return {
    name: "niamoto-plugins",
    load: async ({ store, parseData, generateDigest, logger }) => {
      const url = raw(ref, ".marketing/plugins.json");
      logger.info(`Fetching ${url}`);
      const entries = await fetchJson<PluginEntry[]>(url);
      store.clear();
      for (const entry of entries) {
        const data = await parseData({ id: entry.name, data: entry });
        store.set({ id: entry.name, data, digest: generateDigest(data) });
      }
      logger.info(`Loaded ${entries.length} plugins`);
    },
  };
}

export function markdownFileLoader({
  path,
  ref = DEFAULT_REF,
  id = "content",
}: {
  path: string;
  ref?: string;
  id?: string;
}): Loader {
  return {
    name: `niamoto-file-${path.replace(/[^a-z0-9]/gi, "-")}`,
    load: async ({ store, parseData, generateDigest, logger }) => {
      const url = raw(ref, path);
      logger.info(`Fetching ${url}`);
      const body = await fetchText(url);
      const data = await parseData({ id, data: { body } });
      store.clear();
      store.set({ id, data, digest: generateDigest(body) });
    },
  };
}

/**
 * Parse a docs section README.md and extract title, audience, purpose.
 *
 * Expected structure:
 *
 *   # Title
 *
 *   > Status: Active
 *   > Audience: ...
 *   > Purpose: ...
 *
 *   First paragraph of body...
 *
 * Audience and Purpose may be absent. When Purpose is absent, falls back
 * on the first regular paragraph after the title + blockquote block.
 */
export function parseSectionReadme(md: string): {
  title: string;
  audience?: string;
  purpose: string;
} {
  const lines = md.split("\n");

  // Title: first H1.
  const h1 = lines.find((l) => l.startsWith("# "));
  const title = h1 ? h1.replace(/^#\s+/, "").trim() : "Untitled";

  // Blockquote metadata.
  const audienceMatch = md.match(/^>\s*Audience:\s*(.+)$/m);
  const purposeMatch = md.match(/^>\s*Purpose:\s*(.+)$/m);

  let purpose = purposeMatch?.[1].trim() ?? "";
  if (!purpose) {
    // Fallback: first non-blockquote, non-heading paragraph after the H1.
    const afterH1 = md.split(/^#\s+.+$/m)[1] ?? "";
    const paragraphs = afterH1
      .split(/\n{2,}/)
      .map((p) => p.trim())
      .filter((p) => p && !p.startsWith(">") && !p.startsWith("#"));
    purpose = paragraphs[0]?.replace(/\n/g, " ") ?? "";
  }

  return {
    title,
    audience: audienceMatch?.[1].trim(),
    purpose,
  };
}

const DOCS_SECTIONS: readonly string[] = [
  "01-getting-started",
  "02-user-guide",
  "03-cli-automation",
  "04-plugin-development",
  "05-ml-detection",
  "06-reference",
  "07-architecture",
  "09-troubleshooting",
  // 08-roadmaps intentionally excluded — the dir is a placeholder.
];

const DOCS_BASE_URL = "https://docs.niamoto.org";

export function docsSectionsLoader({ ref = DEFAULT_REF } = {}): Loader {
  return {
    name: "niamoto-docs-sections",
    load: async ({ store, parseData, generateDigest, logger }) => {
      store.clear();
      for (const slug of DOCS_SECTIONS) {
        const url = raw(ref, `docs/${slug}/README.md`);
        logger.info(`Fetching ${url}`);
        const md = await fetchText(url);
        const parsed = parseSectionReadme(md);
        const entry = {
          slug,
          title: parsed.title,
          audience: parsed.audience,
          purpose: parsed.purpose,
          href: `${DOCS_BASE_URL}/${slug}/README.html`,
        };
        const data = await parseData({ id: slug, data: entry });
        store.set({ id: slug, data, digest: generateDigest(entry) });
      }
      logger.info(`Loaded ${DOCS_SECTIONS.length} docs sections`);
    },
  };
}
