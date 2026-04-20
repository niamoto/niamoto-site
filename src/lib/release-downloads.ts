export const RELEASES_PAGE = "https://github.com/niamoto/niamoto/releases/latest";
export const LATEST_JSON = "https://github.com/niamoto/niamoto/releases/latest/download/latest.json";
export const LATEST_RELEASE_API = "https://api.github.com/repos/niamoto/niamoto/releases/latest";

export interface Downloads {
  version: string;
  linuxX64: string;
  linuxArm64: string;
  windowsX64: string;
  macArm64: string;
  macX64: string;
  fallback: string;
}

export interface TauriLatest {
  version?: string;
  platforms?: Record<string, { url?: string }>;
}

export interface GitHubReleaseAsset {
  name: string;
  browser_download_url: string;
}

export interface GitHubLatestRelease {
  tag_name?: string;
  assets?: GitHubReleaseAsset[];
}

const X64_ARCH_RE = /(x64|x86_64|amd64)/;
const ARM64_ARCH_RE = /(arm64|aarch64)/;

function createFallbackDownloads(fallback: string): Downloads {
  return {
    version: "",
    linuxX64: fallback,
    linuxArm64: fallback,
    windowsX64: fallback,
    macArm64: fallback,
    macX64: fallback,
    fallback,
  };
}

function downloadsFromTauri(tauri: TauriLatest | null | undefined, fallback: string): Downloads {
  if (!tauri) return createFallbackDownloads(fallback);

  const platforms = tauri.platforms ?? {};

  return {
    version: tauri.version ?? "",
    linuxX64: platforms["linux-x86_64"]?.url ?? fallback,
    linuxArm64: platforms["linux-aarch64"]?.url ?? fallback,
    windowsX64: platforms["windows-x86_64"]?.url ?? fallback,
    macArm64: platforms["darwin-aarch64"]?.url ?? fallback,
    macX64: platforms["darwin-x86_64"]?.url ?? fallback,
    fallback,
  };
}

function findAssetUrl(
  assets: readonly GitHubReleaseAsset[],
  extensions: readonly string[],
  archMatcher: RegExp,
): string | null {
  for (const asset of assets) {
    const name = asset.name.toLowerCase();
    if (!archMatcher.test(name)) continue;
    if (!extensions.some((extension) => name.endsWith(extension))) continue;
    return asset.browser_download_url;
  }
  return null;
}

function findLinuxAsset(assets: readonly GitHubReleaseAsset[], archMatcher: RegExp): string | null {
  return (
    findAssetUrl(assets, [".appimage"], archMatcher) ??
    findAssetUrl(assets, [".deb"], archMatcher) ??
    findAssetUrl(assets, [".rpm"], archMatcher)
  );
}

function releaseVersion(release: GitHubLatestRelease | null | undefined): string {
  return release?.tag_name?.replace(/^v/, "") ?? "";
}

export function buildReleaseDownloads({
  release,
  tauri,
  fallback = RELEASES_PAGE,
}: {
  release?: GitHubLatestRelease | null;
  tauri?: TauriLatest | null;
  fallback?: string;
}): Downloads {
  const base = downloadsFromTauri(tauri, fallback);
  const assets = release?.assets ?? [];

  return {
    version: base.version || releaseVersion(release),
    linuxX64: findLinuxAsset(assets, X64_ARCH_RE) ?? base.linuxX64,
    linuxArm64: findLinuxAsset(assets, ARM64_ARCH_RE) ?? base.linuxArm64,
    windowsX64: findAssetUrl(assets, [".msi", ".exe"], X64_ARCH_RE) ?? base.windowsX64,
    macArm64: findAssetUrl(assets, [".dmg"], ARM64_ARCH_RE) ?? base.macArm64,
    macX64: findAssetUrl(assets, [".dmg"], X64_ARCH_RE) ?? base.macX64,
    fallback,
  };
}
