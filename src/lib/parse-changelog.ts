/**
 * Parses a Keep-a-Changelog-formatted markdown file into version blocks.
 *
 * A version heading has the form `## [vX.Y.Z] - YYYY-MM-DD` or
 * `## [vX.Y.Z]`. The `[Unreleased]` block is skipped.
 *
 * The body of a version block is everything between its heading and the
 * next version heading (or EOF).
 */
export interface ChangelogVersion {
  version: string; // e.g. "v0.15.4"
  slug: string; // anchor-safe, e.g. "v0-15-4"
  date?: string; // "YYYY-MM-DD" if present
  body: string; // raw markdown, no leading heading
}

const VERSION_HEADING_RE = /^##\s+\[([^\]]+)\](?:\s*-\s*(\d{4}-\d{2}-\d{2}))?\s*$/gm;

export function parseChangelog(markdown: string): ChangelogVersion[] {
  const matches = [...markdown.matchAll(VERSION_HEADING_RE)];
  const versions: ChangelogVersion[] = [];

  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    const label = match[1];
    if (label.toLowerCase() === "unreleased") continue;

    const date = match[2];
    const start = match.index! + match[0].length;
    const end = matches[i + 1]?.index ?? markdown.length;
    const body = markdown.slice(start, end).trim();

    versions.push({
      version: label,
      slug: label.replace(/\./g, "-").toLowerCase(),
      date,
      body,
    });
  }

  return versions;
}
