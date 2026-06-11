# Dynamic Video Generator

A self-contained, customizable, and automated video generation project built using **Remotion** and **React**. It scans your assets dynamically, populates a configuration file, and renders high-quality videos with animated backgrounds, clean typography, glassmorphism cards, and smooth transitions.

---

## 🚀 Features

- **Automated Asset Scan**: Scans directories under `assets/` and auto-generates slide layouts based on media and text files.
- **Dynamic Text Splitting**: If a slide's text is too long, the scanner automatically splits it across consecutive slides.
  - **Shared Assets**: Split slides share the same media.
  - **Continuous Playback**: If the asset is a video, subsequent slides calculate video start offsets (`mediaStartFromInSeconds`) so the video plays continuously across slides instead of restarting!
- **Interactive Setup CLI**: A CLI guide (`npm run setup`) that helps you set up assets, metadata, layouts, and copy media files in seconds.
- **Dynamic Configuration**: Edit `config.json` to customize video resolution, theme colors, background music, branding overlays, title pages, slide orders, and end-credits.
- **Premium Aesthetics**: High-contrast minimal layouts with responsive glassmorphism containers, smooth spring entrance animations, and slow color-blob shifts.
- **Smart Aspect-Ratio Fill**: Portrait assets are rendered over a blurred full-bleed background to fit landscape videos seamlessly.
- **Audio Fades**: Configurable music fade-in (at start) and fade-out (at end) durations.
- **Cross-Platform**: Works out of the box on Windows, macOS, and Linux.

---

## 📁 Project Structure

```text
balerkaj/
├── assets/
│   ├── music/
│   │   └── paulyudin-background-music-478744.mp3
│   ├── slide 1/
│   │   └── 1.jpeg
│   ├── slide 2/
│   │   └── descriptive_text.txt
│   ├── slide 3/
│   │   ├── DSC08665.JPG
│   │   └── nametext.txt
│   └── slide 4/
│       ├── Hands_scrolling_browser_to_notes_202604291105.mp4
│       └── nametext.txt
├── out/
│   └── output.mp4            # Generated video file
├── scripts/
│   ├── setup-agent.mjs       # Interactive CLI assistant
│   ├── scan-assets.mjs       # Scans assets/ and updates config.json
│   └── render.mjs            # Renders config.json into out/output.mp4
├── src/
│   ├── index.ts              # Remotion bundler entrypoint
│   ├── Root.tsx              # Dynamic timeline calculator & composition setup
│   └── Video.tsx             # Video layout, theme & animation assembler
├── config.json               # Master settings file (generated on scan)
├── remotion.config.ts        # Remotion engine configurations
├── tsconfig.json             # TypeScript rules
└── package.json              # NPM scripts and dependencies
```

---

## 🛠️ Getting Started

### 1. Installation
Clone or copy this folder anywhere, open your terminal inside it, and run:
```bash
npm install
```

### 2. Run Interactive Setup CLI
To configure a video step-by-step using an interactive guide (which sets up folders, copies media files, scans assets, and offers to render):
```bash
npm run setup
```

### 3. Scan Assets Manually
If you manually create directories under `assets/` and want to compile the configuration:
```bash
npm run scan
```
- Directories under `assets/` (excluding `music` and `branding`) are sorted and created as slide steps.
- **Text Mapping**:
  - `nametext.txt` or `heading.txt` (line 1 is the slide heading, line 2+ is content).
  - `descriptive_text.txt` or `content.txt` (read as slide content body).
---

## ⚙️ Configuration Properties (`config.json`)

Open `config.json` in a text editor to customize styling, branding, and layouts.

### Video Settings
```json
"video": {
  "width": 1920,
  "height": 1080,
  "fps": 30,
  "maxCharactersPerSlide": 450,      // Text splits into next slide if it exceeds this threshold
  "themeName": "royal-indigo",       // Select from the 10 available themes below
  "theme": {}                        // Individual color overrides (background, cardBg, text, border, etc.)
}
```

#### 🎨 Available Theme Presets
- `royal-indigo` (Deep indigo backdrop, purple-blue neon card glow)
- `radiant-gold` (Warm charcoal and amber backdrop, glowing gold-yellow accents)
- `neon-emerald` (Very dark green forest setting, emerald neon card outlines)
- `electric-amethyst` (Vivid mystical purple background, light amethyst cards)
- `cyber-cyan` (Deep dark tech-cyan, bright neon cyan and pink highlights)
- `midnight-magenta` (Dark burgundy-violet base, glowing magenta borders)
- `arctic-blue` (Deep ocean night theme, crisp cyan-blue lines)
- `volcanic-orange` (Rich volcanic ash theme, hot orange card accents)
- `slate-silver` (Minimalist slate-grey theme, clean gold-yellow highlight dots)
- `crimson-pulse` (High-contrast red alert aesthetic, light coral neon cards)

### Title Page Configurations
```json
"titlePage": {
  "show": true,
  "title": "Main Title Text",
  "subtitle": "Subtitle Content",
  "durationInSeconds": 3,
  "style": "standard",               // Select from the 8 styles below
  "theme": {
    "background": "linear-gradient(135deg, #0a0d14 0%, #1a103c 100%)",
    "textColor": "#f8fafc",
    "subtitleColor": "#d5d4ff"
  }
}
```

### End Page Configurations
```json
"endPage": {
  "show": true,
  "title": "Outro Title",
  "subtitle": "Outro Subtitle",
  "contact": "Call: +91 XXXXXXXXXX",
  "website": "example.com",
  "durationInSeconds": 4,
  "style": "standard",               // Select from the 8 styles below
  "theme": {
    "background": "linear-gradient(135deg, #1a103c 0%, #0a0d14 100%)",
    "textColor": "#f8fafc",
    "subtitleColor": "#ffbbfe"
  }
}
```

#### 🎭 Available Title and End Page Style Presets
1. `standard`: Classic premium layout with centered glass card container, glowing border, and animated bottom accent line.
2. `minimalist`: Sophisticated off-center left-aligned typography with a thick vertical primary accent block.
3. `thumbnail`: Bold, boxed poster-style badge borders with heavy offset 3D shadows.
4. `glassmorphic`: Dynamic translucent card container using high blur factors, glowing background back-blob, and multi-color gradient typography.
5. `bold-brutalism`: Heavy borders, skewed high-contrast label badges, bold sans-serif impact type, and 3D offset drop-shadow blocks.
6. `cyberpunk-neon`: Electric grid scanlines, glowing neon text shadows, futuristic brackets/hud elements, and computer status labels.
7. `editorial-serif`: Elegant serif layouts using large italicized text, thin horizontal lines, off-center margins, and editorial magazine typography.
8. `split-reveal`: Division layout where the screen is split into a solid color block on one side and title details on the other.

---

## 📐 Aspect-Ratio Customizability
The video generator is fully capable of rendering **any aspect ratio**:
- **Landscape (16:9)**: Perfect for YouTube or presentations.
- **Portrait (9:16)**: Stacks elements vertically for Shorts, TikToks, and Reels.
- **Square (1:1)**: Calibrates margins for Instagram posts and feeds.
- **Custom (Any)**: Input custom resolutions (e.g. `21:9`) directly via the agent helper.

---

## 🤖 Interactive Agent Setup CLI ("Balerkaj Bot")

To automate your setup, call the conversational setup bot. It guides you step-by-step through configuring your presentation.

### How to Invoke the Agent Helper:
If you are pair programming with an AI coding assistant (like Gemini, Claude, Antigravity, etc.), you can prompt it with this **Initial command prompt** to kick off the work automatically:

> **Initial Command to the Agent:**
> `"Hello bot, I want to configure and render a video in this folder. Please run the interactive setup agent by executing npm.cmd run setup (or node scripts/setup-agent.mjs), and walk me through the prompts, ask questions, copy slide media assets, scan them, and then render the video and still thumbnails for me."`

Or, you can run the CLI helper manually in your terminal inside the `balerkaj/` folder:
```bash
npm run setup
```

### Pathway for Complete Agentic Work:
1. **Residue Cleanup**: The bot checks for existing slide asset directories and asks if you'd like a clean wipe or a non-destructive merge.
2. **Aspect Ratio and Styles**: Choose your aspect ratio (Landscape, Portrait, Square, Custom), title text, subtitle text, theme colors, and Title/End Page styles.
3. **Audio Setup**: Customize background audio path, fade-in durations, fade-out durations, and music volume.
4. **Slide Configuration**: Define slide headings, content bodies, layouts (`split-media-right`, `split-media-left`, `full-background-media`, `text-only`, `media-only`), and choose media files to copy into your slides.
5. **Asset Provisioning**: The bot dynamically creates the directories under `assets/`, copies media files, and writes `nametext.txt` files automatically.
6. **Compile Layouts**: The scanner (`npm run scan`) is run to split long texts, apply video offset durations, and assemble `config.json`.
7. **Render final MP4**: Option to build the entire presentation video instantly.
8. **Render Stills/Thumbnails**: Option to render still graphic assets based on the compositions.
9. **Review Loop**: Allows you to repeatedly make adjustments (e.g., change themes, edit specific slide text, append new slides, delete slides, or resize screens) and re-render without leaving the interactive agent environment.

---

## 📽️ Preview and Render

### Live Developer Preview Studio
Open the interactive Remotion studio to preview your video layout in real-time as you make changes to assets or config:
```bash
npm run studio
```

### Render Video
To render the final MP4 video file:
```bash
npm run render
```
The rendered video will be saved as `out/output.mp4`.

### 🖼️ Render Still Thumbnails / Social Posts
To render high-quality still images/covers from specific compositions:
- **YouTube Landscape Thumbnail**:
  ```bash
  npx remotion still Thumbnail out/thumbnail.png --entry-point=src/index.ts --overwrite
  ```
- **Instagram 1:1 Post**:
  ```bash
  npx remotion still InstagramPost out/instagrampost.png --entry-point=src/index.ts --overwrite
  ```
- **Shorts Cover / Teaser frame**:
  ```bash
  npx remotion still Shorts out/shorts_still.png --entry-point=src/index.ts --overwrite
  ```
*(These can also be run automatically at the end of the `npm run setup` helper).*

---

## 📄 License
MIT

