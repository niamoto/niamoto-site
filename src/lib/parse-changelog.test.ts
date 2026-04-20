import { describe, expect, it } from "vitest";
import { parseChangelog } from "./parse-changelog";

const SAMPLE = `# Changelog

All notable changes...

## [Unreleased]

## [v0.15.4] - 2026-04-19

### Features

- Redesign dashboard
- New import flow

### Bug Fixes

- Fix dark mode

## [v0.15.3] - 2026-04-18

### Bug Fixes

- Allow accented names

## [v0.15.2] - 2026-04-17

### Other

- Internal refactor
`;

describe("parseChangelog", () => {
  it("extracts each released version (skips Unreleased)", () => {
    const versions = parseChangelog(SAMPLE);
    expect(versions.map((v) => v.version)).toEqual(["v0.15.4", "v0.15.3", "v0.15.2"]);
  });

  it("extracts dates when present", () => {
    const versions = parseChangelog(SAMPLE);
    expect(versions[0].date).toBe("2026-04-19");
  });

  it("produces an anchor-safe slug per version", () => {
    const versions = parseChangelog(SAMPLE);
    expect(versions[0].slug).toBe("v0-15-4");
  });

  it("includes the version body as raw markdown", () => {
    const versions = parseChangelog(SAMPLE);
    expect(versions[0].body).toContain("### Features");
    expect(versions[0].body).toContain("Redesign dashboard");
    expect(versions[0].body).not.toContain("## [v0.15.3]");
  });

  it("returns empty array for a file with no versions", () => {
    expect(parseChangelog("# Changelog\n\nNothing released yet.\n")).toEqual([]);
  });

  it("handles Unreleased at the start without errors", () => {
    const md = "# Changelog\n\n## [Unreleased]\n\n## [v1.0.0] - 2026-01-01\n\nInitial.\n";
    const versions = parseChangelog(md);
    expect(versions).toHaveLength(1);
    expect(versions[0].version).toBe("v1.0.0");
  });
});
