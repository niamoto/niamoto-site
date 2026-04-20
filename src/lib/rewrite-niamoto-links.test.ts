import { describe, expect, it } from "vitest";
import { rewriteNiamotoLinks } from "./rewrite-niamoto-links";

describe("rewriteNiamotoLinks", () => {
  it("rewrites relative docs/... links to GitHub blob URLs", () => {
    const md = "See [the plan](docs/plans/foo.md) for details.";
    const out = rewriteNiamotoLinks(md);
    expect(out).toBe(
      "See [the plan](https://github.com/niamoto/niamoto/blob/main/docs/plans/foo.md) for details."
    );
  });

  it("rewrites relative docs/superpowers/... links", () => {
    const md = "[spec](docs/superpowers/specs/bar.md)";
    const out = rewriteNiamotoLinks(md);
    expect(out).toContain("https://github.com/niamoto/niamoto/blob/main/docs/superpowers/specs/bar.md");
  });

  it("leaves absolute https:// links unchanged", () => {
    const md = "Visit [GitHub](https://github.com/niamoto/niamoto).";
    expect(rewriteNiamotoLinks(md)).toBe(md);
  });

  it("leaves in-page anchors unchanged", () => {
    const md = "Jump to [section](#section-1).";
    expect(rewriteNiamotoLinks(md)).toBe(md);
  });

  it("leaves mailto: links unchanged", () => {
    const md = "[Email us](mailto:hello@niamoto.org)";
    expect(rewriteNiamotoLinks(md)).toBe(md);
  });

  it("rewrites image references to raw.githubusercontent", () => {
    const md = "![logo](docs/assets/logo.png)";
    const out = rewriteNiamotoLinks(md);
    expect(out).toBe(
      "![logo](https://raw.githubusercontent.com/niamoto/niamoto/main/docs/assets/logo.png)"
    );
  });

  it("handles multiple links in one line", () => {
    const md = "See [a](docs/a.md) and [b](docs/b.md).";
    const out = rewriteNiamotoLinks(md);
    expect(out).toContain("/blob/main/docs/a.md");
    expect(out).toContain("/blob/main/docs/b.md");
  });
});
