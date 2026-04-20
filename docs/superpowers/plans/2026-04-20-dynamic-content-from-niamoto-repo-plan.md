# Dynamic Content From Niamoto Repo — Implementation Plan

> **For Claude:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace hard-coded plugin/documentation content in niamoto-site with dynamic fetches from the niamoto GitHub repository; add new `/roadmap` and `/changelog` pages sourced from `ROADMAP.md` and `CHANGELOG.md`; auto-rebuild on every niamoto push.

**Architecture:** Niamoto repo produces `.marketing/plugins.json` via an AST extractor run in CI. Niamoto-site uses Astro 5 Content Layer loaders to fetch plugins JSON, docs section READMEs, `ROADMAP.md`, `CHANGELOG.md` from `raw.githubusercontent.com` at build time. A GitHub Actions workflow in niamoto repo regenerates the manifest and pings a Coolify deploy webhook on every push to tracked paths.

**Tech Stack:**
- niamoto repo: Python 3.12 (stdlib `ast`, `pathlib`, `json`, `tomllib`), pytest, GitHub Actions
- niamoto-site repo: Astro 5.6, TypeScript strict, Content Layer API, `marked` (markdown → HTML), Tailwind v4
- Deployment: Coolify deploy webhook (existing)

**Spec:** [`docs/superpowers/specs/2026-04-20-dynamic-content-from-niamoto-repo-design.md`](../specs/2026-04-20-dynamic-content-from-niamoto-repo-design.md)

---

## Cross-repo coordination

This plan touches two git repositories. Each task declares its **Working directory** explicitly. Commits stay inside their respective repos; no cross-repo commits.

**Ordering constraint:** Phase 1 (niamoto repo) must produce `.marketing/plugins.json` on `main` **before** Phase 2's smoke build in niamoto-site (the loader fetches from `main`). Phase 1 Task 2 handles this.

**Branch strategy:**
- niamoto-site: stay on current branch (`feat/landing-alternatives` or whatever is active).
- niamoto: create a new feature branch `feat/marketing-sync` before Task 1 and merge to `main` after Task 3.

## File Structure

### niamoto repo (new)
- `scripts/generate-plugin-manifest.py` — AST extractor, single file, ~80 LOC.
- `tests/scripts/test_generate_plugin_manifest.py` — pytest with inline fixture files, ~90 LOC.
- `.marketing/plugins.json` — generated artifact, committed.
- `.github/workflows/marketing-sync.yml` — sync workflow, ~45 LOC.

### niamoto-site repo (new)
- `src/content-loaders/niamoto.ts` — three loader factories (`pluginsLoader`, `docsSectionsLoader`, `markdownFileLoader`) + `parseSectionReadme` helper, ~140 LOC.
- `src/content.config.ts` — four collections declaration, ~45 LOC.
- `src/lib/rewrite-niamoto-links.ts` — rewrites relative `docs/...` links to GitHub blob URLs, ~30 LOC.
- `src/lib/rewrite-niamoto-links.test.ts` — vitest spec, ~40 LOC.
- `src/lib/parse-changelog.ts` — splits `CHANGELOG.md` into version blocks, ~50 LOC.
- `src/lib/parse-changelog.test.ts` — vitest spec, ~50 LOC.
- `src/pages/roadmap.astro` — new page, ~90 LOC.
- `src/pages/changelog.astro` — new page, ~130 LOC.
- `src/pages/fr/roadmap.astro` — FR shell (renders same as EN with FR chrome), ~5 LOC.
- `src/pages/fr/changelog.astro` — FR shell, ~5 LOC.
- `vitest.config.ts` — added if not present, ~15 LOC.

### niamoto-site repo (modified)
- `src/pages/plugins/index.astro` — uses `getCollection("plugins")`.
- `src/pages/documentation/index.astro` — uses `getCollection("docsSections")`, drops sidebar + recipes.
- `src/components/alt/frond-live/FrondHeader.astro` — add Changelog entry.
- `src/components/alt/shared/FrondFooter.astro` — add Roadmap + Changelog in Project column.
- `src/i18n/alt/shared.en.ts` — add `changelog`, `roadmap` keys.
- `src/i18n/alt/shared.fr.ts` — add `changelog`, `roadmap` keys.
- `src/styles/alt/base.css` — add `@source` globs for new pages and lib dir.
- `package.json` — add `marked`, `vitest`, `@types/node` devDeps.

---

## Chunk 1: niamoto repo infra (Phase 1)

### Task 1: AST plugin manifest extractor

**Working directory:** `~/Dev/clients/niamoto`

**Files:**
- Create: `scripts/generate-plugin-manifest.py`
- Create: `tests/scripts/__init__.py`
- Create: `tests/scripts/test_generate_plugin_manifest.py`

**Pre-flight:**

- [ ] **Step 0: Create feature branch**

```bash
cd ~/Dev/clients/niamoto
git checkout main && git pull
git checkout -b feat/marketing-sync
```

- [ ] **Step 1: Write failing test with fixture**

Create `tests/scripts/__init__.py` as an empty file.

Create `tests/scripts/test_generate_plugin_manifest.py`:

```python
"""Tests for scripts/generate-plugin-manifest.py."""
from __future__ import annotations

import importlib.util
import json
import sys
from pathlib import Path

import pytest

SCRIPT = Path(__file__).resolve().parents[2] / "scripts" / "generate-plugin-manifest.py"


def _load_module():
    spec = importlib.util.spec_from_file_location("plugin_manifest", SCRIPT)
    assert spec and spec.loader
    module = importlib.util.module_from_spec(spec)
    sys.modules["plugin_manifest"] = module
    spec.loader.exec_module(module)
    return module


@pytest.fixture
def fake_plugins_tree(tmp_path: Path) -> Path:
    """Create a minimal plugins tree with two registered classes."""
    root = tmp_path / "plugins"
    (root / "widgets").mkdir(parents=True)
    (root / "transformers").mkdir(parents=True)

    (root / "widgets" / "bar_plot.py").write_text(
        '''
from niamoto.core.plugins.base import PluginType, register, WidgetPlugin


@register("bar_plot", PluginType.WIDGET)
class BarPlotWidget(WidgetPlugin):
    """Widget to display a bar plot using Plotly.

    This second paragraph is ignored by the extractor.
    """
    pass
'''.lstrip()
    )

    (root / "transformers" / "top_ranking.py").write_text(
        '''
from niamoto.core.plugins.base import PluginType, register


@register("top_ranking", PluginType.TRANSFORMER)
class TopRanking:
    """Rank the top N values of a field."""
    pass
'''.lstrip()
    )

    # A file without any @register decorator — should be skipped silently.
    (root / "widgets" / "_helpers.py").write_text(
        "def helper():\n    return 1\n"
    )

    return root


def test_extracts_two_plugins(fake_plugins_tree: Path):
    module = _load_module()
    plugins = module.extract_plugins(fake_plugins_tree)

    assert len(plugins) == 2
    names = {p["name"] for p in plugins}
    assert names == {"bar_plot", "top_ranking"}


def test_output_shape(fake_plugins_tree: Path):
    module = _load_module()
    plugins = module.extract_plugins(fake_plugins_tree)

    bar_plot = next(p for p in plugins if p["name"] == "bar_plot")
    assert bar_plot == {
        "name": "bar_plot",
        "type": "widget",
        "body": "Widget to display a bar plot using Plotly.",
    }


def test_sorted_by_type_then_name(fake_plugins_tree: Path):
    module = _load_module()
    plugins = module.extract_plugins(fake_plugins_tree)

    # transformer comes before widget alphabetically
    assert [p["type"] for p in plugins] == ["transformer", "widget"]


def test_handles_missing_docstring(tmp_path: Path):
    root = tmp_path / "plugins"
    root.mkdir()
    (root / "nodoc.py").write_text(
        '''
from niamoto.core.plugins.base import PluginType, register


@register("nodoc", PluginType.LOADER)
class NoDocLoader:
    pass
'''.lstrip()
    )

    module = _load_module()
    plugins = module.extract_plugins(root)
    assert plugins == [{"name": "nodoc", "type": "loader", "body": ""}]


def test_type_fallback_from_class_attr(tmp_path: Path):
    """If @register is called without a type, fall back on the `type` class attr."""
    root = tmp_path / "plugins"
    root.mkdir()
    (root / "implicit.py").write_text(
        '''
from niamoto.core.plugins.base import PluginType, register


@register("implicit")
class ImplicitExporter:
    """An exporter declaring its type via class attribute."""
    type = PluginType.EXPORTER
'''.lstrip()
    )

    module = _load_module()
    plugins = module.extract_plugins(root)
    assert plugins[0]["type"] == "exporter"
```

- [ ] **Step 2: Run test to verify it fails**

Run: `uv run pytest tests/scripts/test_generate_plugin_manifest.py -v`
Expected: FAIL — `FileNotFoundError` on `scripts/generate-plugin-manifest.py` (script does not exist yet).

- [ ] **Step 3: Implement the extractor**

Create `scripts/generate-plugin-manifest.py`:

```python
#!/usr/bin/env python3
"""Extract plugin metadata from the Niamoto source tree via AST.

Writes `.marketing/plugins.json` — a sorted list of `{name, type, body,
version}` entries — consumed by the niamoto-site marketing site.

Runs in CI on every push to `main` that touches plugin sources.
"""
from __future__ import annotations

import ast
import json
import sys
import tomllib
from pathlib import Path
from typing import Any

REPO_ROOT = Path(__file__).resolve().parents[1]
PLUGINS_DIR = REPO_ROOT / "src" / "niamoto" / "core" / "plugins"
OUTPUT = REPO_ROOT / ".marketing" / "plugins.json"
PYPROJECT = REPO_ROOT / "pyproject.toml"


def _read_package_version() -> str:
    """Extract the project version from pyproject.toml."""
    with PYPROJECT.open("rb") as fh:
        data = tomllib.load(fh)
    return data["project"]["version"]


def _decorator_name(decorator: ast.expr) -> str | None:
    """Return the callable name of a decorator, or None."""
    if isinstance(decorator, ast.Call):
        func = decorator.func
        if isinstance(func, ast.Name):
            return func.id
        if isinstance(func, ast.Attribute):
            return func.attr
    return None


def _extract_type_from_register_args(call: ast.Call) -> str | None:
    """If @register has a second positional arg like PluginType.WIDGET, return 'widget'."""
    if len(call.args) < 2:
        return None
    second = call.args[1]
    if isinstance(second, ast.Attribute):
        # e.g., PluginType.WIDGET -> 'widget'
        return second.attr.lower()
    return None


def _extract_type_from_class_body(cls_node: ast.ClassDef) -> str | None:
    """Fallback: look for `type = PluginType.X` inside the class body."""
    for stmt in cls_node.body:
        if isinstance(stmt, ast.Assign):
            for target in stmt.targets:
                if isinstance(target, ast.Name) and target.id == "type":
                    value = stmt.value
                    if isinstance(value, ast.Attribute):
                        return value.attr.lower()
    return None


def _first_paragraph(docstring: str | None) -> str:
    """Return the first paragraph of a docstring, stripped."""
    if not docstring:
        return ""
    return docstring.split("\n\n", 1)[0].strip().replace("\n", " ")


def _plugins_in_file(path: Path) -> list[dict[str, Any]]:
    """Parse a single .py file and return all @register'd plugins."""
    try:
        tree = ast.parse(path.read_text(encoding="utf-8"))
    except SyntaxError as exc:
        print(f"SyntaxError in {path}: {exc}", file=sys.stderr)
        return []

    results: list[dict[str, Any]] = []
    for node in ast.walk(tree):
        if not isinstance(node, ast.ClassDef):
            continue
        for deco in node.decorator_list:
            if _decorator_name(deco) != "register":
                continue
            if not isinstance(deco, ast.Call) or not deco.args:
                continue
            first_arg = deco.args[0]
            if not (isinstance(first_arg, ast.Constant) and isinstance(first_arg.value, str)):
                continue
            name = first_arg.value
            ptype = _extract_type_from_register_args(deco) or _extract_type_from_class_body(node)
            if ptype is None:
                print(f"Skipped {name} in {path}: cannot determine type", file=sys.stderr)
                continue
            results.append(
                {
                    "name": name,
                    "type": ptype,
                    "body": _first_paragraph(ast.get_docstring(node)),
                }
            )
    return results


def extract_plugins(plugins_root: Path) -> list[dict[str, Any]]:
    """Walk a plugins directory and collect every registered plugin."""
    collected: list[dict[str, Any]] = []
    for py_file in sorted(plugins_root.rglob("*.py")):
        if "__pycache__" in py_file.parts:
            continue
        collected.extend(_plugins_in_file(py_file))
    collected.sort(key=lambda p: (p["type"], p["name"]))
    return collected


def main() -> int:
    plugins = extract_plugins(PLUGINS_DIR)
    version = _read_package_version()
    for plugin in plugins:
        plugin["version"] = version

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps(plugins, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Wrote {len(plugins)} plugins to {OUTPUT.relative_to(REPO_ROOT)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
```

- [ ] **Step 4: Run test to verify it passes**

Run: `uv run pytest tests/scripts/test_generate_plugin_manifest.py -v`
Expected: PASS — all 5 tests green.

- [ ] **Step 5: Smoke test against real source tree**

Run: `uv run python scripts/generate-plugin-manifest.py`
Expected: Script prints something like `Wrote 67 plugins to .marketing/plugins.json`.

Inspect the output:
```bash
head -30 .marketing/plugins.json
jq 'group_by(.type) | map({type: .[0].type, count: length})' .marketing/plugins.json
```
Expected: A valid JSON array, ~60-70 entries, types include `deployer`, `exporter`, `loader`, `transformer`, `widget`.

- [ ] **Step 6: Commit**

```bash
cd ~/Dev/clients/niamoto
git add scripts/generate-plugin-manifest.py tests/scripts/
git commit -m "feat(scripts): add AST-based plugin manifest extractor"
```

---

### Task 2: Initial plugin manifest commit

**Working directory:** `~/Dev/clients/niamoto`

**Files:**
- Create: `.marketing/plugins.json` (committed artifact from Task 1's smoke test)

- [ ] **Step 1: Verify the manifest exists and is well-formed**

Run: `test -f .marketing/plugins.json && jq -e 'length > 0 and all(.[]; has("name") and has("type") and has("body") and has("version"))' .marketing/plugins.json`
Expected: exit 0, prints `true`.

- [ ] **Step 2: Commit the initial manifest**

```bash
cd ~/Dev/clients/niamoto
git add .marketing/plugins.json
git commit -m "chore: initial .marketing/plugins.json"
```

- [ ] **Step 3: Push the branch so CI can resolve later**

```bash
git push -u origin feat/marketing-sync
```
(Do not merge yet — Task 3 adds the workflow on the same branch.)

---

### Task 3: Marketing sync GitHub Actions workflow

**Working directory:** `~/Dev/clients/niamoto`

**Files:**
- Create: `.github/workflows/marketing-sync.yml`

- [ ] **Step 1: Write the workflow**

Create `.github/workflows/marketing-sync.yml`:

```yaml
name: Marketing site sync

on:
  push:
    branches: [main]
    paths:
      - "src/niamoto/core/plugins/**"
      - "docs/0*/README.md"
      - "ROADMAP.md"
      - "CHANGELOG.md"
      - "pyproject.toml"
      - ".marketing/**"
      - "scripts/generate-plugin-manifest.py"
      - ".github/workflows/marketing-sync.yml"
  workflow_dispatch:

permissions:
  contents: write

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
        with:
          fetch-depth: 0

      - uses: actions/setup-python@v6
        with:
          python-version: "3.12"

      - name: Regenerate plugin manifest
        run: python scripts/generate-plugin-manifest.py

      - name: Commit manifest if changed
        run: |
          if ! git diff --quiet -- .marketing/plugins.json; then
            git config user.name "niamoto-bot"
            git config user.email "bot@niamoto.org"
            git add .marketing/plugins.json
            git commit -m "chore: regenerate .marketing/plugins.json [skip ci]"
            git push
          else
            echo "Plugin manifest unchanged — skipping commit."
          fi

      - name: Trigger niamoto-site rebuild
        run: |
          curl --fail -X GET "$COOLIFY_WEBHOOK" \
            -H "Authorization: Bearer $COOLIFY_TOKEN"
        env:
          COOLIFY_WEBHOOK: ${{ secrets.COOLIFY_WEBHOOK }}
          COOLIFY_TOKEN: ${{ secrets.COOLIFY_TOKEN }}
```

- [ ] **Step 2: Validate YAML syntax**

Run: `python -c "import yaml; yaml.safe_load(open('.github/workflows/marketing-sync.yml'))"`
Expected: Exit 0, no output (valid YAML).

- [ ] **Step 3: Commit**

```bash
cd ~/Dev/clients/niamoto
git add .github/workflows/marketing-sync.yml
git commit -m "ci: add marketing-sync workflow (triggers niamoto-site redeploy)"
```

- [ ] **Step 4: Manual secret configuration (human action)**

The following is a **one-time manual step** — the implementing agent should surface this to the user, not try to automate:

Go to GitHub → `niamoto/niamoto` repo → Settings → Secrets and variables → Actions. Add two repository secrets:

1. `COOLIFY_WEBHOOK` — the Deploy webhook URL for the niamoto-site Coolify application (copy from Coolify app → Webhook tab).
2. `COOLIFY_TOKEN` — a Coolify API token with the "Deploy" permission (create in Coolify → API tokens).

Document this in the commit message or a NOTE.md if needed. Proceed once the user confirms the secrets are set.

- [ ] **Step 5: Merge to main**

After user confirms secrets:

```bash
cd ~/Dev/clients/niamoto
git push
gh pr create --base main --head feat/marketing-sync \
  --title "Marketing site sync: plugin manifest + auto-redeploy" \
  --body "Adds AST-based plugin extractor and GH Actions workflow that regenerates .marketing/plugins.json and pings the niamoto-site Coolify webhook on push. See spec in niamoto-site repo."
gh pr merge --squash --auto
```

- [ ] **Step 6: Verify first workflow run**

After merge, go to GitHub Actions tab and verify the `Marketing site sync` workflow ran successfully. The Coolify webhook call should show a 2xx response.

---

## Chunk 2: niamoto-site content layer + refactors (Phases 2-3)

### Task 4: Content loader module — plugins + markdown files

**Working directory:** `~/Dev/clients/niamoto-site`

**Files:**
- Create: `src/content-loaders/niamoto.ts`
- Modify: `src/styles/alt/base.css` (add `@source "../content-loaders/**/*.ts"` if needed — actually not needed since content-loaders don't contain Tailwind classes; no change).
- Modify: `package.json` (will add `marked` in a later step — not here).

- [ ] **Step 1: Create the loader module skeleton with pluginsLoader + markdownFileLoader**

Create `src/content-loaders/niamoto.ts`:

```ts
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

interface PluginEntry {
  name: string;
  type: "transformer" | "widget" | "loader" | "exporter" | "deployer";
  body: string;
  version: string;
}

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
```

- [ ] **Step 2: Typecheck**

Run: `pnpm typecheck`
Expected: Only errors in unrelated files (or zero errors). The new file should have zero type errors.

If `Loader` import is unresolved, confirm Astro 5.6+ is installed — the `astro/loaders` entrypoint ships with the Content Layer API.

- [ ] **Step 3: Commit**

```bash
cd ~/Dev/clients/niamoto-site
git add src/content-loaders/niamoto.ts
git commit -m "feat(content): add plugins + markdown file loaders"
```

---

### Task 5: Content loader — docsSectionsLoader + parseSectionReadme

**Working directory:** `~/Dev/clients/niamoto-site`

**Files:**
- Modify: `src/content-loaders/niamoto.ts` (append loader + parser)

- [ ] **Step 1: Append parseSectionReadme helper to the loader module**

Append to `src/content-loaders/niamoto.ts`:

```ts
/**
 * Parse a docs/0X-*/README.md and extract title, audience, purpose.
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
```

- [ ] **Step 2: Typecheck**

Run: `pnpm typecheck`
Expected: Zero errors in the loader file.

- [ ] **Step 3: Commit**

```bash
cd ~/Dev/clients/niamoto-site
git add src/content-loaders/niamoto.ts
git commit -m "feat(content): add docs sections loader + README parser"
```

---

### Task 6: Register collections + smoke build

**Working directory:** `~/Dev/clients/niamoto-site`

**Files:**
- Create: `src/content.config.ts`

**Prerequisite:** Task 2 must have landed on `niamoto/main` for the smoke build to succeed. If not, the loader will fetch and fail.

- [ ] **Step 1: Create content.config.ts**

Create `src/content.config.ts`:

```ts
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
```

- [ ] **Step 2: Run the smoke build**

Run: `pnpm build`

Expected:
- Astro sync logs include `Synced collections: plugins, docsSections, roadmap, changelog`.
- Log includes `Loaded N plugins` (N ≥ 60) and `Loaded 8 docs sections`.
- Build completes without errors.

If fetch fails with 404 on `.marketing/plugins.json`, verify Task 2 landed on `niamoto/main` on GitHub.

- [ ] **Step 3: Commit**

```bash
cd ~/Dev/clients/niamoto-site
git add src/content.config.ts
git commit -m "feat(content): declare plugins, docsSections, roadmap, changelog collections"
```

---

### Task 7: Refactor `/plugins` page to use the collection

**Working directory:** `~/Dev/clients/niamoto-site`

**Files:**
- Modify: `src/pages/plugins/index.astro`

- [ ] **Step 1: Rewrite the page**

Replace the entire frontmatter of `src/pages/plugins/index.astro`. Everything above and including the closing `---` becomes:

```ts
---
import AltLayout from "@/layouts/AltLayout.astro";
import FrondHeader from "@/components/alt/frond-live/FrondHeader.astro";
import FrondFooter from "@/components/alt/shared/FrondFooter.astro";
import FadeUpOnView from "@/components/alt/motion/FadeUpOnView.tsx";
import { getCollection } from "astro:content";

type PluginType =
  | "transformer"
  | "widget"
  | "loader"
  | "exporter"
  | "deployer";

const typeChip: Record<
  PluginType,
  { label: string; variant: "leaf" | "steel" | "violet" }
> = {
  transformer: { label: "TRANSFORMER", variant: "leaf" },
  widget:      { label: "WIDGET",      variant: "steel" },
  loader:      { label: "LOADER",      variant: "violet" },
  exporter:    { label: "EXPORTER",    variant: "leaf" },
  deployer:    { label: "DEPLOYER",    variant: "violet" },
};

const pluginEntries = await getCollection("plugins");
const plugins = pluginEntries.map((e) => e.data);

// Count by type for the filter pills.
const counts: Record<PluginType, number> = {
  transformer: 0, widget: 0, loader: 0, exporter: 0, deployer: 0,
};
for (const p of plugins) counts[p.type]++;

const filters = [
  { id: "all",         label: "All",          count: plugins.length, active: true },
  { id: "transformer", label: "Transformers", count: counts.transformer },
  { id: "widget",      label: "Widgets",      count: counts.widget },
  { id: "loader",      label: "Loaders",      count: counts.loader },
  { id: "exporter",    label: "Exporters",    count: counts.exporter },
  { id: "deployer",    label: "Deployers",    count: counts.deployer },
];

const totalByChipCount = {
  Transformers: counts.transformer,
  Widgets:      counts.widget,
  Loaders:      counts.loader,
  Exporters:    counts.exporter,
  Deployers:    counts.deployer,
};
---
```

Keep the rest of the template identical **except**:

1. In the hero's count pills section (currently hard-codes "42 Transformers", "28 Widgets", etc.), use the real counts:

```astro
<FadeUpOnView client:visible delay={0.12}>
  <div class="mt-8 flex flex-wrap items-center justify-center gap-2">
    {Object.entries(totalByChipCount).map(([label, count]) => (
      <span class="rounded-[999px] bg-surface px-4 py-1.5 text-sm text-ink shadow-[var(--shadow-sm)]">
        {count} {label}
      </span>
    ))}
  </div>
</FadeUpOnView>
```

2. In the card grid rendering (the `.map` currently iterating the hard-coded `plugins` array), drop the "Used by N projects" span:

```astro
<div class="mt-4 flex items-center justify-between text-xs text-muted">
  <span class="alt-mono">v{p.version}</span>
</div>
```

(Just the version, right-aligned — remove the usedBy text.)

- [ ] **Step 2: Run the build**

Run: `pnpm build`
Expected: `/plugins/index.html` built, no errors.

- [ ] **Step 3: Visual check**

Run: `pnpm preview` in another terminal.
Open http://localhost:4321/plugins in a browser.

Verify:
- Hero pill counts match real numbers (e.g., "24 Transformers" not "42").
- Plugin cards show real plugin names (e.g., `bar_plot`, `top_ranking`, `cloudflare`).
- No "Used by N projects" text.
- Deployer chip variant renders (violet).
- Animations still work.

- [ ] **Step 4: Commit**

```bash
cd ~/Dev/clients/niamoto-site
git add src/pages/plugins/index.astro
git commit -m "refactor(plugins): source plugin list from niamoto repo via Content Layer"
```

---

### Task 8: Refactor `/documentation` page to use the collection

**Working directory:** `~/Dev/clients/niamoto-site`

**Files:**
- Modify: `src/pages/documentation/index.astro`

- [ ] **Step 1: Rewrite the page**

Replace `src/pages/documentation/index.astro` entirely with:

```astro
---
import AltLayout from "@/layouts/AltLayout.astro";
import FrondHeader from "@/components/alt/frond-live/FrondHeader.astro";
import FrondFooter from "@/components/alt/shared/FrondFooter.astro";
import FadeUpOnView from "@/components/alt/motion/FadeUpOnView.tsx";
import { getCollection } from "astro:content";

const sections = (await getCollection("docsSections")).map((e) => e.data);
// Preserve declaration order (01, 02, …) since the loader returns sorted.
sections.sort((a, b) => a.slug.localeCompare(b.slug));
---

<AltLayout
  theme="frond"
  locale="en"
  title="Documentation — Niamoto"
  description="Guides, concepts, and recipes to run Niamoto from data import to published portal."
>
  <FrondHeader locale="en" />

  <!-- Hero -->
  <section class="border-b border-hairline py-16" style="background: var(--c-surface-muted)">
    <div class="mx-auto max-w-[960px] px-6 text-center">
      <FadeUpOnView client:visible blur={0}>
        <h1 class="text-5xl font-bold tracking-[-0.02em] text-ink">
          Documentation
        </h1>
        <p class="mx-auto mt-3 max-w-[640px] text-lg text-muted">
          Pick a path. Every section below opens the full guide on
          <a href="https://docs.niamoto.org" class="text-accent hover:underline">docs.niamoto.org</a>.
        </p>
      </FadeUpOnView>
    </div>
  </section>

  <!-- Sections grid -->
  <section class="mx-auto max-w-[960px] px-6 py-16">
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
      {
        sections.map((s, index) => (
          <FadeUpOnView client:visible delay={0.05 + index * 0.06}>
            <a
              href={s.href}
              target="_blank"
              rel="noopener"
              class="block h-full rounded-[12px] bg-surface p-6 shadow-[var(--shadow-widget)] transition-shadow hover:shadow-[var(--shadow-widget-hover)]"
            >
              <div class="alt-mono text-[11px] font-semibold uppercase tracking-wider text-muted">
                {s.slug.replace(/^\d+-/, "").replace(/-/g, " ")}
              </div>
              <h3 class="mt-2 text-lg font-semibold text-ink">{s.title}</h3>
              <p class="mt-2 text-sm leading-relaxed" style="color: color-mix(in srgb, var(--c-ink) 80%, transparent)">
                {s.purpose}
              </p>
              {s.audience && (
                <p class="mt-3 alt-mono text-xs text-muted">
                  For: {s.audience}
                </p>
              )}
            </a>
          </FadeUpOnView>
        ))
      }
    </div>

    <!-- Community callout -->
    <FadeUpOnView client:visible delay={0.1}>
      <div class="mt-16 rounded-[12px] bg-surface p-8 shadow-[var(--shadow-widget)]">
        <h3 class="text-xl font-semibold text-ink">Need help?</h3>
        <p class="mt-2 text-sm" style="color: color-mix(in srgb, var(--c-ink) 80%, transparent)">
          Niamoto is maintained by Arsis and its research partners. Open a
          discussion, file an issue, or contribute.
        </p>
        <div class="mt-5 flex flex-wrap gap-3 text-sm">
          <a href="https://github.com/niamoto/niamoto/discussions" class="frond-btn frond-btn--outline">
            GitHub Discussions
          </a>
          <a href="https://github.com/niamoto/niamoto/issues/new" class="frond-btn frond-btn--outline">
            File an issue
          </a>
          <a href="https://github.com/niamoto/niamoto/blob/main/CONTRIBUTING.md" class="frond-btn frond-btn--outline">
            Contribute
          </a>
        </div>
      </div>
    </FadeUpOnView>
  </section>

  <FrondFooter locale="en" />
</AltLayout>
```

- [ ] **Step 2: Run the build**

Run: `pnpm build`
Expected: Build succeeds.

- [ ] **Step 3: Visual check**

Open http://localhost:4321/documentation.

Verify:
- Hero renders with title and description.
- 8 cards in a 2-column grid, each showing the section title and purpose.
- Cards link out to `docs.niamoto.org/*/README.html`.
- Community callout below with 3 buttons.
- Animations stagger correctly.

- [ ] **Step 4: Commit**

```bash
cd ~/Dev/clients/niamoto-site
git add src/pages/documentation/index.astro
git commit -m "refactor(documentation): source sections from niamoto repo docs/*/README.md"
```

---

## Chunk 3: New pages + nav (Phase 4)

### Task 9: Install vitest + marked as dev deps

**Working directory:** `~/Dev/clients/niamoto-site`

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`

- [ ] **Step 1: Install dependencies**

```bash
cd ~/Dev/clients/niamoto-site
pnpm add marked
pnpm add -D vitest @types/node
```

Expected: `package.json` updated, `pnpm-lock.yaml` regenerated.

- [ ] **Step 2: Create vitest config**

Create `vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["src/**/*.test.ts"],
    environment: "node",
  },
  resolve: {
    alias: {
      "@": new URL("./src", import.meta.url).pathname,
    },
  },
});
```

- [ ] **Step 3: Add test script to package.json**

Edit `package.json`, add to `scripts`:

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 4: Smoke test vitest**

Run: `pnpm test`
Expected: "No test files found" (no failures; vitest is happy). Exit 0 or exit 1 — either is fine, the point is the binary is resolvable. If the binary is not found, the install didn't take.

- [ ] **Step 5: Commit**

```bash
git add package.json pnpm-lock.yaml vitest.config.ts
git commit -m "build: add vitest + marked devDeps"
```

---

### Task 10: `rewrite-niamoto-links` helper (TDD)

**Working directory:** `~/Dev/clients/niamoto-site`

**Files:**
- Create: `src/lib/rewrite-niamoto-links.ts`
- Create: `src/lib/rewrite-niamoto-links.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/lib/rewrite-niamoto-links.test.ts`:

```ts
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

  it("does not touch image references (![alt](path))", () => {
    const md = "![logo](docs/assets/logo.png)";
    const out = rewriteNiamotoLinks(md);
    // Images use raw.githubusercontent for direct display
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test`
Expected: FAIL — `Cannot find module './rewrite-niamoto-links'`.

- [ ] **Step 3: Implement the helper**

Create `src/lib/rewrite-niamoto-links.ts`:

```ts
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test`
Expected: PASS — all 7 tests green.

- [ ] **Step 5: Commit**

```bash
git add src/lib/rewrite-niamoto-links.ts src/lib/rewrite-niamoto-links.test.ts
git commit -m "feat(lib): add rewriteNiamotoLinks helper"
```

---

### Task 11: `parse-changelog` helper (TDD)

**Working directory:** `~/Dev/clients/niamoto-site`

**Files:**
- Create: `src/lib/parse-changelog.ts`
- Create: `src/lib/parse-changelog.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/lib/parse-changelog.test.ts`:

```ts
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
    expect(versions[0].body).not.toContain("## [v0.15.3]"); // belongs to next block
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement the helper**

Create `src/lib/parse-changelog.ts`:

```ts
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test`
Expected: PASS — all 6 new tests + 7 previous tests.

- [ ] **Step 5: Commit**

```bash
git add src/lib/parse-changelog.ts src/lib/parse-changelog.test.ts
git commit -m "feat(lib): add parseChangelog helper"
```

---

### Task 12: `/roadmap` page

**Working directory:** `~/Dev/clients/niamoto-site`

**Files:**
- Create: `src/pages/roadmap.astro`
- Create: `src/pages/fr/roadmap.astro`
- Modify: `src/styles/alt/base.css` (add new @source entry)

- [ ] **Step 1: Add Tailwind scan glob for new pages**

Edit `src/styles/alt/base.css`. Find the `@source` lines and add:

```css
@source "../lib/**/*.ts";
```

(Only if lib files use Tailwind classes — they don't yet, but this future-proofs.)

Actually **skip this edit** if `@source "../pages/**/*.astro"` is already present — the new pages are under `pages/` and will be scanned.

- [ ] **Step 2: Create the roadmap page**

Create `src/pages/roadmap.astro`:

```astro
---
import AltLayout from "@/layouts/AltLayout.astro";
import FrondHeader from "@/components/alt/frond-live/FrondHeader.astro";
import FrondFooter from "@/components/alt/shared/FrondFooter.astro";
import FadeUpOnView from "@/components/alt/motion/FadeUpOnView.tsx";
import { getEntry } from "astro:content";
import { marked } from "marked";
import { rewriteNiamotoLinks } from "@/lib/rewrite-niamoto-links";

interface Props {
  locale?: "en" | "fr";
}
const { locale = "en" } = Astro.props;

const entry = await getEntry("roadmap", "content");
if (!entry) throw new Error("Roadmap content not loaded");

const rewritten = rewriteNiamotoLinks(entry.data.body);
const html = await marked.parse(rewritten, { gfm: true, breaks: false });

const t = locale === "fr"
  ? {
      title: "Feuille de route",
      lead: "Ce qui se prépare, ce qui vient, ce qui est à l'horizon.",
    }
  : {
      title: "Roadmap",
      lead: "What's shipping, what's next, what's on the horizon.",
    };
---

<AltLayout
  theme="frond"
  locale={locale}
  title={locale === "fr" ? "Feuille de route — Niamoto" : "Roadmap — Niamoto"}
  description="Niamoto roadmap — current focus, upcoming milestones, and longer-term plans."
>
  <FrondHeader locale={locale} />

  <section class="border-b border-hairline py-16" style="background: var(--c-surface-muted)">
    <div class="mx-auto max-w-[760px] px-6 text-center">
      <FadeUpOnView client:visible blur={0}>
        <h1 class="text-5xl font-bold tracking-[-0.02em] text-ink">{t.title}</h1>
        <p class="mx-auto mt-3 max-w-[600px] text-lg text-muted">{t.lead}</p>
      </FadeUpOnView>
    </div>
  </section>

  <section class="mx-auto max-w-[760px] px-6 py-16">
    <FadeUpOnView client:visible>
      <article class="niamoto-prose" set:html={html} />
    </FadeUpOnView>
  </section>

  <FrondFooter locale={locale} />
</AltLayout>

<style is:global>
  .niamoto-prose {
    color: color-mix(in srgb, var(--c-ink) 90%, transparent);
    line-height: 1.7;
  }
  .niamoto-prose h2 {
    margin-top: 2.5rem;
    margin-bottom: 0.75rem;
    font-size: 1.75rem;
    font-weight: 700;
    color: var(--c-ink);
    letter-spacing: -0.02em;
  }
  .niamoto-prose h3 {
    margin-top: 2rem;
    margin-bottom: 0.5rem;
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--c-ink);
  }
  .niamoto-prose p {
    margin: 1rem 0;
  }
  .niamoto-prose ul, .niamoto-prose ol {
    margin: 1rem 0;
    padding-left: 1.5rem;
  }
  .niamoto-prose li {
    margin: 0.35rem 0;
  }
  .niamoto-prose a {
    color: var(--c-accent);
    text-decoration: none;
    border-bottom: 1px solid color-mix(in srgb, var(--c-accent) 40%, transparent);
  }
  .niamoto-prose a:hover {
    border-bottom-color: var(--c-accent);
  }
  .niamoto-prose code {
    font-family: var(--font-mono);
    font-size: 0.9em;
    background: var(--c-surface-muted);
    padding: 0.1rem 0.35rem;
    border-radius: 4px;
  }
  .niamoto-prose strong {
    color: var(--c-ink);
    font-weight: 600;
  }
  .niamoto-prose hr {
    margin: 2.5rem 0;
    border: 0;
    border-top: 1px solid var(--c-hairline);
  }
  .niamoto-prose blockquote {
    margin: 1.5rem 0;
    padding-left: 1.25rem;
    border-left: 3px solid var(--c-hairline);
    color: var(--c-muted);
  }
</style>
```

- [ ] **Step 3: Create the FR shell**

Create `src/pages/fr/roadmap.astro`:

```astro
---
import RoadmapPage from "../roadmap.astro";
---
<RoadmapPage locale="fr" />
```

**Note:** Astro does not support `<Component />` with `.astro` re-export like this directly. If it fails, use this alternative — copy the whole page frontmatter, pass `locale="fr"` explicitly. Verify during Step 4. If re-export fails, the FR file becomes a near-duplicate of the EN with `const locale = "fr";`.

Actually **do this instead** (safer):

Create `src/pages/fr/roadmap.astro` as a full duplicate of `src/pages/roadmap.astro` with `const { locale = "fr" } = Astro.props;` instead of `"en"`, and the title/description localized:

```astro
---
// Same imports…
const locale = "fr";
// Same logic (getEntry, rewrite, marked)…
---
<AltLayout
  theme="frond"
  locale="fr"
  title="Feuille de route — Niamoto"
  description="Feuille de route de Niamoto — focus actuel, prochaines étapes et plans à plus long terme."
>
  <!-- Same markup, localized strings inline -->
</AltLayout>
```

To keep this DRY, extract the shared rendering into a partial component at `src/components/pages/RoadmapBody.astro` and have both pages wrap it. Decide during Step 4 based on which feels cleaner.

- [ ] **Step 4: Build**

Run: `pnpm build`
Expected: `/roadmap/index.html` and `/fr/roadmap/index.html` both generated, no errors.

- [ ] **Step 5: Visual check**

Open http://localhost:4321/roadmap.

Verify:
- Hero "Roadmap" + lead.
- ROADMAP.md body renders with H2s, H3s, bullets.
- Internal `docs/plans/...` links point to github.com/niamoto/niamoto/blob/main/docs/plans/...
- External links keep their original URL.
- Typography matches the site (Plus Jakarta Sans body, JetBrains mono for code).

Open http://localhost:4321/fr/roadmap. Verify title and lead are localized.

- [ ] **Step 6: Commit**

```bash
git add src/pages/roadmap.astro src/pages/fr/roadmap.astro
git commit -m "feat(pages): add /roadmap rendering ROADMAP.md from niamoto repo"
```

---

### Task 13: `/changelog` page

**Working directory:** `~/Dev/clients/niamoto-site`

**Files:**
- Create: `src/pages/changelog.astro`
- Create: `src/pages/fr/changelog.astro`

- [ ] **Step 1: Create the changelog page**

Create `src/pages/changelog.astro`:

```astro
---
import AltLayout from "@/layouts/AltLayout.astro";
import FrondHeader from "@/components/alt/frond-live/FrondHeader.astro";
import FrondFooter from "@/components/alt/shared/FrondFooter.astro";
import FadeUpOnView from "@/components/alt/motion/FadeUpOnView.tsx";
import { getEntry } from "astro:content";
import { marked } from "marked";
import { parseChangelog } from "@/lib/parse-changelog";
import { rewriteNiamotoLinks } from "@/lib/rewrite-niamoto-links";

interface Props {
  locale?: "en" | "fr";
}
const { locale = "en" } = Astro.props;

const entry = await getEntry("changelog", "content");
if (!entry) throw new Error("Changelog content not loaded");

const versions = parseChangelog(entry.data.body);
const renderedVersions = await Promise.all(
  versions.map(async (v) => ({
    ...v,
    html: await marked.parse(rewriteNiamotoLinks(v.body), { gfm: true, breaks: false }),
  }))
);

const t = locale === "fr"
  ? {
      title: "Changelog",
      lead: "Toutes les versions publiées et leurs nouveautés.",
      latest: "Dernière version",
    }
  : {
      title: "Changelog",
      lead: "Every released version and its highlights.",
      latest: "Latest release",
    };
---

<AltLayout
  theme="frond"
  locale={locale}
  title="Changelog — Niamoto"
  description="Niamoto changelog — every released version with features, fixes, and notes."
>
  <FrondHeader locale={locale} />

  <section class="border-b border-hairline py-16" style="background: var(--c-surface-muted)">
    <div class="mx-auto max-w-[1100px] px-6 text-center">
      <FadeUpOnView client:visible blur={0}>
        <h1 class="text-5xl font-bold tracking-[-0.02em] text-ink">{t.title}</h1>
        <p class="mx-auto mt-3 max-w-[640px] text-lg text-muted">{t.lead}</p>
        {renderedVersions[0] && (
          <p class="mt-4 alt-mono text-sm text-muted">
            {t.latest}: <span class="text-accent">{renderedVersions[0].version}</span>
            {renderedVersions[0].date && <span> · {renderedVersions[0].date}</span>}
          </p>
        )}
      </FadeUpOnView>
    </div>
  </section>

  <section class="mx-auto max-w-[1100px] px-6 py-16">
    <div class="grid grid-cols-1 gap-12 md:grid-cols-[200px_1fr]">
      <!-- Sticky version nav -->
      <aside class="md:sticky md:top-[100px] md:self-start">
        <h4 class="alt-mono text-[11px] font-semibold uppercase tracking-wider text-muted">
          Versions
        </h4>
        <ul class="mt-3 space-y-1">
          {renderedVersions.map((v) => (
            <li>
              <a
                href={`#${v.slug}`}
                class="block alt-mono text-sm text-muted hover:text-ink transition-colors"
              >
                {v.version}
              </a>
            </li>
          ))}
        </ul>
      </aside>

      <!-- Content pane -->
      <div class="min-w-0">
        {renderedVersions.map((v, index) => (
          <FadeUpOnView client:visible delay={0.05 + index * 0.03}>
            <article id={v.slug} class="mb-12 scroll-mt-[100px]">
              <header class="mb-4 flex items-baseline gap-4 border-b border-hairline pb-3">
                <h2 class="alt-mono text-2xl font-bold text-ink">{v.version}</h2>
                {v.date && (
                  <span class="alt-mono text-sm text-muted">{v.date}</span>
                )}
              </header>
              <div class="niamoto-prose" set:html={v.html} />
            </article>
          </FadeUpOnView>
        ))}
      </div>
    </div>
  </section>

  <FrondFooter locale={locale} />
</AltLayout>

<style is:global>
  /* Reuse the .niamoto-prose class defined in roadmap.astro.
     Extract both to a shared partial if it starts feeling duplicated. */
  .niamoto-prose h3 {
    margin-top: 1.5rem;
    margin-bottom: 0.5rem;
    font-size: 1rem;
    font-weight: 600;
    color: var(--c-ink);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-family: var(--font-mono);
  }
  .niamoto-prose ul {
    margin: 0.5rem 0;
  }
  .niamoto-prose li {
    margin: 0.25rem 0;
    font-size: 0.95em;
  }
</style>
```

- [ ] **Step 2: Create the FR shell**

Create `src/pages/fr/changelog.astro` — duplicate of the EN with `const locale = "fr";` and localized title/description.

- [ ] **Step 3: Build**

Run: `pnpm build`
Expected: `/changelog/index.html` and `/fr/changelog/index.html` generated.

- [ ] **Step 4: Visual check**

Open http://localhost:4321/changelog.

Verify:
- Hero with title, lead, "Latest release: v0.15.4 · 2026-04-19".
- Left sticky sidebar with all versions listed (scrollable list).
- Right pane: each version has a heading "v0.15.4 · 2026-04-19", then "Features / Bug Fixes / Other" rendered as mono-uppercase H3s, then bullet lists.
- Clicking a version in the sidebar scrolls to that anchor with offset (no header occlusion).
- Internal links work.

- [ ] **Step 5: Commit**

```bash
git add src/pages/changelog.astro src/pages/fr/changelog.astro
git commit -m "feat(pages): add /changelog rendering CHANGELOG.md from niamoto repo"
```

---

### Task 14: Header + footer + i18n updates

**Working directory:** `~/Dev/clients/niamoto-site`

**Files:**
- Modify: `src/i18n/alt/shared.en.ts`
- Modify: `src/i18n/alt/shared.fr.ts`
- Modify: `src/components/alt/frond-live/FrondHeader.astro`
- Modify: `src/components/alt/shared/FrondFooter.astro`

- [ ] **Step 1: Add new i18n keys**

Edit `src/i18n/alt/shared.en.ts`:

```ts
export default {
  nav: {
    documentation: "Documentation",
    plugins: "Plugins",
    showcase: "Showcase",
    changelog: "Changelog",
    github: "GitHub",
    languageSwitchLabel: "Switch language",
  },
  footer: {
    roadmap: "Roadmap",
    changelog: "Changelog",
  },
} as const;
```

Edit `src/i18n/alt/shared.fr.ts`:

```ts
export default {
  nav: {
    documentation: "Documentation",
    plugins: "Plugins",
    showcase: "Showcase",
    changelog: "Changelog",
    github: "GitHub",
    languageSwitchLabel: "Changer de langue",
  },
  footer: {
    roadmap: "Feuille de route",
    changelog: "Changelog",
  },
} as const;
```

- [ ] **Step 2: Update FrondHeader — add Changelog between Showcase and GitHub**

Edit `src/components/alt/frond-live/FrondHeader.astro`. In the `<nav>` block, add after the showcase link, before the GitHub link:

```astro
<a href={`${prefix}/changelog`}>{t.nav.changelog}</a>
```

Full nav becomes:

```astro
<nav class="frond-header__nav" aria-label="Primary">
  <a href={`${prefix}/documentation`}>{t.nav.documentation}</a>
  <a href={`${prefix}/plugins`}>{t.nav.plugins}</a>
  <a href={`${prefix}/showcase/nouvelle-caledonie`}>{t.nav.showcase}</a>
  <a href={`${prefix}/changelog`}>{t.nav.changelog}</a>
  <a href="https://github.com/niamoto/niamoto" target="_blank" rel="noopener">
    {t.nav.github}
  </a>
</nav>
```

- [ ] **Step 3: Update FrondFooter — add Roadmap + Changelog**

Edit `src/components/alt/shared/FrondFooter.astro`. In the `cols` array, update the Project column:

- EN (`isFr === false` branch): insert `Roadmap` after `Plugins`, keep `Changelog` where it already was.
- FR branch: same with `Feuille de route`.

Full updated `cols` construction:

```ts
const cols = [
  {
    title: t.projectTitle,
    links: [
      { label: t.documentation, href: `${prefix}/documentation` },
      { label: t.plugins, href: `${prefix}/plugins` },
      { label: isFr ? "Feuille de route" : "Roadmap", href: `${prefix}/roadmap` },
      { label: t.changelog, href: `${prefix}/changelog` },
      { label: t.showcase, href: `${prefix}/showcase/nouvelle-caledonie` },
    ],
  },
  // … unchanged Community and "Made by" columns
];
```

Ensure `t` has `changelog` in both locales (already added in Step 1). If the inline FR/EN ternary inside `FrondFooter.astro` doesn't have a `changelog` key, add:

```ts
// EN branch
changelog: "Changelog",
// FR branch
changelog: "Changelog",
```

- [ ] **Step 4: Typecheck**

Run: `pnpm typecheck`
Expected: Zero errors.

- [ ] **Step 5: Build + visual check**

Run: `pnpm build && pnpm preview`

Open http://localhost:4321 and http://localhost:4321/fr.

Verify:
- Header shows 5 items in order: Documentation, Plugins, Showcase, Changelog, GitHub.
- Clicking Changelog navigates to `/changelog`.
- Footer's Project column lists Documentation, Plugins, Roadmap, Changelog, Showcase.
- FR footer uses "Feuille de route" not "Roadmap".
- Links are all live (no 404).

- [ ] **Step 6: Commit**

```bash
git add src/i18n/alt/shared.en.ts src/i18n/alt/shared.fr.ts \
        src/components/alt/frond-live/FrondHeader.astro \
        src/components/alt/shared/FrondFooter.astro
git commit -m "feat(nav): add Changelog to header and Roadmap+Changelog to footer"
```

---

### Task 15: Final integration build + verification

**Working directory:** `~/Dev/clients/niamoto-site`

- [ ] **Step 1: Clean build from scratch**

```bash
cd ~/Dev/clients/niamoto-site
rm -rf dist .astro
pnpm build
```

Expected: Build succeeds. Log confirms:
- All 4 collections loaded (`plugins`, `docsSections`, `roadmap`, `changelog`).
- ~67 plugins, 8 docs sections, 1 roadmap entry, 1 changelog entry.
- `/plugins`, `/documentation`, `/roadmap`, `/changelog` all generated for EN + FR.

- [ ] **Step 2: Run the test suite**

Run: `pnpm test`
Expected: All tests pass (13 tests across 2 files).

- [ ] **Step 3: Typecheck**

Run: `pnpm typecheck`
Expected: Zero errors.

- [ ] **Step 4: Visual QA pass**

Run: `pnpm preview`

Walk through every page in both locales:
- `/` and `/fr/` — landing, animations.
- `/documentation` and `/fr/documentation` — 8 dynamic cards.
- `/plugins` and `/fr/plugins` — ~67 plugin cards, real counts in hero pills.
- `/roadmap` and `/fr/roadmap` — markdown renders, internal links go to GitHub.
- `/changelog` and `/fr/changelog` — sticky version nav, per-version blocks.
- `/showcase/nouvelle-caledonie` — unchanged, still works.
- Header: 5 items, all correct labels + routes.
- Footer: Project column has Roadmap + Changelog.

- [ ] **Step 5: End-to-end trigger test (manual)**

After merging to main and deploying:

1. In the niamoto repo, push a trivial change to `ROADMAP.md` (e.g., fix a typo).
2. Go to GitHub Actions tab — verify `Marketing site sync` workflow runs.
3. Verify the workflow's Coolify webhook step returns 2xx.
4. Wait ~2 minutes, refresh niamoto.org/roadmap, verify the typo fix is live.

Document the outcome in a commit message or followup note.

- [ ] **Step 6: Final commit (merge + deploy)**

```bash
cd ~/Dev/clients/niamoto-site
git push
# Open PR if not already, merge to main, let Coolify deploy.
```

---

## Done criteria

- ✅ Pushing a new `@register`'d plugin class to `niamoto/main` results in the card appearing on niamoto.org/plugins within ~2 minutes with no manual intervention.
- ✅ Editing `ROADMAP.md` or `CHANGELOG.md` triggers an auto-rebuild and the content updates live.
- ✅ Editing a `docs/0X-*/README.md` updates the matching card on niamoto.org/documentation.
- ✅ The marketing site has no hard-coded plugin data, no fake `usedBy` counters, no placeholder recipes.
- ✅ `/roadmap` and `/changelog` exist in EN + FR, linked from header/footer.
- ✅ All tests pass, build is clean, typecheck is clean.

## Risks & rollbacks

- **Workflow loop**: `[skip ci]` on the auto-commit prevents recursion. If the loop ever triggers, disable the workflow and investigate the path filter.
- **Raw fetch failing in build**: Coolify keeps the previous successful deploy live. Investigate the 404/500, fix, re-trigger.
- **Sphinx section renamed**: Build fails loudly. Update `DOCS_SECTIONS` in `src/content-loaders/niamoto.ts` to match new slug, rebuild.
- **AST parser crashes on new plugin syntax**: Workflow exits non-zero, marketing site unchanged. Update `generate-plugin-manifest.py` to handle the new pattern.
