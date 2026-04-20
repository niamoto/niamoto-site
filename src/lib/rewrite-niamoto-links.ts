/**
 * Rewrites relative `docs/...` links in a markdown string to point at the
 * niamoto GitHub repo.
 *
 * - Regular markdown links `[text](docs/foo.md)` → `github.com/.../blob/main/docs/foo.md`
 * - Image references `![alt](docs/foo.png)` → `raw.githubusercontent.com/.../main/docs/foo.png`
 * - Absolute URLs, anchors, mailto:, and other protocols are left untouched.
 *
 * Only `docs/*` paths are rewritten — this matches the convention used in
 * ROADMAP.md and CHANGELOG.md for intra-repo references. Other relative
 * paths (e.g. just `foo.md`) pass through unchanged.
 */
const REPO_BLOB = "https://github.com/niamoto/niamoto/blob/main";
const REPO_RAW = "https://raw.githubusercontent.com/niamoto/niamoto/main";

const LINK_RE = /(!?)\[([^\]]*)\]\((docs\/[^)]+)\)/g;

export function rewriteNiamotoLinks(markdown: string): string {
  return markdown.replace(LINK_RE, (_match, bang: string, text: string, path: string) => {
    const base = bang === "!" ? REPO_RAW : REPO_BLOB;
    return `${bang}[${text}](${base}/${path})`;
  });
}
