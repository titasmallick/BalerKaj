# Agent Instructions - BalerKaj Video Generator

This project is a custom slideshow video generator built with Remotion and React. Future AI assistants working on this codebase must adhere to the instructions and guidelines outlined below.

---

## 🛠️ Tech Stack & Key Files
* **Framework**: Remotion (v4+) & React (v18+)
* **Main Entry Point**: [src/index.ts](file:///D:/GITHUB/BalerKaj/src/index.ts)
* **Composition Manager**: [src/Root.tsx](file:///D:/GITHUB/BalerKaj/src/Root.tsx) (Handles dynamic layout sizes, FPS, durations, and composition registrations)
* **Video Component**: [src/Video.tsx](file:///D:/GITHUB/BalerKaj/src/Video.tsx) (Manages transitions, slide mappings, typography, and themes)
* **Configuration Files**:
  * [config.json](file:///D:/GITHUB/BalerKaj/config.json) (Landscape version metadata and defaults)
  * [config-reels.json](file:///D:/GITHUB/BalerKaj/config-reels.json) (Portrait version metadata and overrides)

---

## 🚀 Common Workflow Operations

### 1. Scanning Assets
If assets under the `assets/` directory are added, deleted, or restructured, run:
```bash
npm run scan
```
This executes `scripts/scan-assets.mjs` which auto-detects content, splits long texts, maps media start times, and compiles the slide array in `config.json`.

### 2. Rendering Videos
* **Landscape Video (1920x1080)**:
  ```bash
  npx.cmd remotion render MainVideo out/output.mp4 --entry-point=src/index.ts --overwrite
  ```
* **Portrait Reels Video (1080x1920)**:
  ```bash
  npx.cmd remotion render Reels out/reels_output.mp4 --entry-point=src/index.ts --overwrite
  ```

### 3. Rendering Thumbnails (Thumbnail Maker)
* **Landscape Thumbnail Card (16:9)**:
  ```bash
  npx.cmd remotion still Thumbnail out/landscape_thumbnail.png --entry-point=src/index.ts --overwrite
  ```
* **Portrait Reels Thumbnail Card (9:16)**:
  ```bash
  npx.cmd remotion still ReelsThumbnail out/reels_thumbnail.png --entry-point=src/index.ts --overwrite
  ```

---

## ⚙️ Key Configuration Flags

### Optional Transition/Animation Toggle
To render a standard slideshow video without active spring animations, slide entrance translations, or exit fades, set the `"disableAnimations"` flag to `true` inside the `video` block of the configuration (`config.json` or `config-reels.json`):

```json
"video": {
  "width": 1920,
  "height": 1080,
  "fps": 30,
  "themeName": "royal-indigo",
  "disableAnimations": true,
  ...
}
```

* When `true`, this flag hardcodes spring entrance scales to `1`, entrance translations to `0`, and exit fades to `1` across all slide layouts.

---

## ⚠️ Hard Constraints for Agents

1. **Win32 Execution**: Always use `npx.cmd` instead of `npx` on Windows systems to bypass PowerShell script execution restrictions.
2. **Terminal Operations**: Never propose `cd` commands. Always specify the directory explicitly in the working directory parameter (`Cwd`).
3. **No Placeholders**: Never include empty placeholders or dummy images. Use asset copying or rendering tools to create concrete files.
