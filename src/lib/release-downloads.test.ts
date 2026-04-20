import { describe, expect, it } from "vitest";
import { buildReleaseDownloads, RELEASES_PAGE, type GitHubLatestRelease, type TauriLatest } from "./release-downloads";

describe("buildReleaseDownloads", () => {
  it("prefers the macOS dmg asset over the Tauri updater archive", () => {
    const release: GitHubLatestRelease = {
      tag_name: "v0.15.8",
      assets: [
        {
          name: "Niamoto_0.15.8_aarch64.dmg",
          browser_download_url: "https://github.com/niamoto/niamoto/releases/download/v0.15.8/Niamoto_0.15.8_aarch64.dmg",
        },
      ],
    };

    const tauri: TauriLatest = {
      version: "0.15.8",
      platforms: {
        "darwin-aarch64": {
          url: "https://github.com/niamoto/niamoto/releases/download/v0.15.8/Niamoto_aarch64.app.tar.gz",
        },
      },
    };

    const downloads = buildReleaseDownloads({ release, tauri });

    expect(downloads.macArm64).toBe(
      "https://github.com/niamoto/niamoto/releases/download/v0.15.8/Niamoto_0.15.8_aarch64.dmg"
    );
  });

  it("falls back to the Tauri URL when no installer asset exists", () => {
    const tauri: TauriLatest = {
      version: "0.15.8",
      platforms: {
        "linux-x86_64": {
          url: "https://github.com/niamoto/niamoto/releases/download/v0.15.8/Niamoto_0.15.8_amd64.deb",
        },
      },
    };

    const downloads = buildReleaseDownloads({ release: null, tauri });

    expect(downloads.linuxX64).toBe(
      "https://github.com/niamoto/niamoto/releases/download/v0.15.8/Niamoto_0.15.8_amd64.deb"
    );
    expect(downloads.macArm64).toBe(RELEASES_PAGE);
  });
});
