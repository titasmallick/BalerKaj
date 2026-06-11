import fs from 'fs';
import path from 'path';
import readline from 'readline/promises';
import { stdin as input, stdout as output } from 'process';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Helper to perform natural sort
const naturalSort = (a, b) => {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
};

// Check if file is image or video
const getMediaType = (filename) => {
  const ext = path.extname(filename).toLowerCase();
  const imageExts = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.tiff', '.bmp'];
  const videoExts = ['.mp4', '.webm', '.mov', '.mkv', '.avi'];
  
  if (imageExts.includes(ext)) return 'image';
  if (videoExts.includes(ext)) return 'video';
  return null;
};

// Colors for terminal styling
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underscore: '\x1b[4m',
  blink: '\x1b[5m',
  reverse: '\x1b[7m',
  hidden: '\x1b[8m',
  
  fgBlack: '\x1b[30m',
  fgRed: '\x1b[31m',
  fgGreen: '\x1b[32m',
  fgYellow: '\x1b[33m',
  fgBlue: '\x1b[34m',
  fgMagenta: '\x1b[35m',
  fgCyan: '\x1b[36m',
  fgWhite: '\x1b[37m',
  
  bgBlack: '\x1b[40m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m',
  bgWhite: '\x1b[47m'
};

// Helper: confirm y/n question
async function confirm(rl, questionText, defaultYes = true) {
  const suffix = defaultYes ? ' (Y/n)' : ' (y/N)';
  const ans = await rl.question(`${colors.bright}${questionText}${suffix}:${colors.reset} `);
  if (!ans.trim()) return defaultYes;
  return ans.trim().toLowerCase().startsWith('y');
}

// Helper: clean slide folders starting with 'slide' or 'folder'
function cleanOldSlides(assetsDir) {
  if (!fs.existsSync(assetsDir)) return;
  const items = fs.readdirSync(assetsDir);
  let cleanedAny = false;
  for (const item of items) {
    const fullPath = path.join(assetsDir, item);
    if (fs.statSync(fullPath).isDirectory() && (item.toLowerCase().startsWith('slide') || item.toLowerCase().startsWith('folder'))) {
      fs.rmSync(fullPath, { recursive: true, force: true });
      console.log(`${colors.dim}Wiped directory: assets/${item}${colors.reset}`);
      cleanedAny = true;
    }
  }
  return cleanedAny;
}

// Main setup function
async function runSetup() {
  const rl = readline.createInterface({ input, output });
  
  console.clear();
  console.log(`${colors.fgCyan}${colors.bright}================================================================`);
  console.log(`🤖   BALERKAJ BOT: INTERACTIVE VIDEO ENGINE ASSISTANT   🤖`);
  console.log(`================================================================${colors.reset}\n`);
  
  console.log(`Hello sir, I am Balerkaj Bot! Let me guide you through setting up`);
  console.log(`and rendering your customized video presentation today.\n`);

  const legacyAssetsDir = path.join(projectRoot, 'assets');
  const assetsDir = path.join(projectRoot, 'public', 'assets');
  
  if (fs.existsSync(legacyAssetsDir) && !fs.existsSync(assetsDir)) {
    console.log('Migrating legacy assets folder to public/assets for rendering efficiency...');
    fs.mkdirSync(path.join(projectRoot, 'public'), { recursive: true });
    fs.renameSync(legacyAssetsDir, assetsDir);
  }

  const configPath = path.join(projectRoot, 'config.json');

  // STEP 1: DETECT OLD RESIDUES
  if (fs.existsSync(assetsDir)) {
    const oldFolders = fs.readdirSync(assetsDir).filter(item => {
      const fullPath = path.join(assetsDir, item);
      return fs.statSync(fullPath).isDirectory() && (item.toLowerCase().startsWith('slide') || item.toLowerCase().startsWith('folder'));
    }).sort(naturalSort);

    if (oldFolders.length > 0) {
      console.log(`${colors.fgYellow}${colors.bright}🔍 Old Residues Detected!${colors.reset}`);
      console.log(`The following existing slide directories were found in the assets folder:`);
      console.log(` 👉 [ ${oldFolders.join(', ')} ]\n`);
      
      const shouldWipe = await confirm(rl, "Would you like to start a brand new project and wipe out these old slides?", true);
      if (shouldWipe) {
        cleanOldSlides(assetsDir);
        if (fs.existsSync(configPath)) {
          fs.rmSync(configPath, { force: true });
          console.log(`${colors.dim}Removed old config.json${colors.reset}`);
        }
        console.log(`${colors.fgGreen}🧹 Clean slate ready! Old directories deleted successfully.${colors.reset}\n`);
      } else {
        console.log(`${colors.fgBlue}ℹ️ Keeping old slides. New entries will be merged non-destructively.${colors.reset}\n`);
      }
    }
  }

  // Load configuration template or existing settings
  let currentConfig = {
    video: { 
      width: 1920, 
      height: 1080, 
      fps: 30, 
      maxCharactersPerSlide: 450, 
      themeName: 'royal-indigo', 
      theme: {},
      fontFamily: 'outfit',
      fontWeight: '600',
      progressBar: {
        show: true,
        position: 'bottom',
        color: '',
        height: 8
      }
    },
    audio: { musicPath: '', volume: 0.1, loop: true, fadeInInSeconds: 2, fadeOutInSeconds: 2 },
    branding: { showLogo: true, logoPath: '', logoText: 'TITAS SIR BIOLOGY', position: 'top-left', size: 50, opacity: 0.9, persistent: true },
    titlePage: { show: true, style: 'standard', title: 'Dynamic Scientific Presentation', subtitle: 'Visualizing Knowledge with Precision', durationInSeconds: 3, theme: { background: 'linear-gradient(135deg, #0a0d14 0%, #1a103c 100%)', textColor: '#f8fafc', subtitleColor: '#d5d4ff' } },
    slides: [],
    endPage: { show: true, style: 'standard', title: 'Biology Tuition Classes', subtitle: 'Stop Memorizing. Start Scoring.', contact: 'Call: +91 9123774239', website: 'titassir.eugenicserudite.xyz', durationInSeconds: 4, theme: { background: 'linear-gradient(135deg, #1a103c 0%, #0a0d14 100%)', textColor: '#f8fafc', subtitleColor: '#ffbbfe' } }
  };

  if (fs.existsSync(configPath)) {
    try {
      const parsed = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
      currentConfig = { 
        ...currentConfig, 
        ...parsed,
        video: { ...currentConfig.video, ...parsed.video },
        audio: { ...currentConfig.audio, ...parsed.audio },
        branding: { ...currentConfig.branding, ...parsed.branding },
        titlePage: { ...currentConfig.titlePage, ...parsed.titlePage },
        endPage: { ...currentConfig.endPage, ...parsed.endPage }
      };
      console.log(`${colors.dim}Loaded existing video parameters from config.json.${colors.reset}\n`);
    } catch (e) {
      console.warn('Error reading config.json, using defaults.', e.message);
    }
  }

  // STEP 2: GENERAL PROJECT SETTINGS
  console.log(`${colors.fgMagenta}${colors.bright}--- [Step 1: General Video Details & Customization] ---${colors.reset}`);
  
  // Aspect ratio select
  console.log(`Select Video Aspect Ratio / Format:`);
  console.log(`  [1] Landscape (16:9 - 1920x1080)`);
  console.log(`  [2] Portrait (9:16 - 1080x1920) - Shorts/Reels`);
  console.log(`  [3] Square (1:1 - 1080x1080)`);
  console.log(`  [4] Custom`);
  const aspectChoice = await rl.question(`Choose an option (1-4) [Current: ${currentConfig.video.width}x${currentConfig.video.height}]: `) || "";
  
  if (aspectChoice === '1') {
    currentConfig.video.width = 1920;
    currentConfig.video.height = 1080;
  } else if (aspectChoice === '2') {
    currentConfig.video.width = 1080;
    currentConfig.video.height = 1920;
  } else if (aspectChoice === '3') {
    currentConfig.video.width = 1080;
    currentConfig.video.height = 1080;
  } else if (aspectChoice === '4') {
    currentConfig.video.width = parseInt(await rl.question(`Enter Width in px [Current: ${currentConfig.video.width}]: `) || `${currentConfig.video.width}`, 10);
    currentConfig.video.height = parseInt(await rl.question(`Enter Height in px [Current: ${currentConfig.video.height}]: `) || `${currentConfig.video.height}`, 10);
  }

  // Text Split Limit
  currentConfig.video.maxCharactersPerSlide = parseInt(await rl.question(`✂️ Max Characters per slide before splitting [Current: ${currentConfig.video.maxCharactersPerSlide}]: `) || `${currentConfig.video.maxCharactersPerSlide}`, 10);

  // Font Choices
  console.log(`\nSelect Typography Font Family:`);
  console.log(`  [1] Outfit (Modern, sleek rounded sans-serif - Recommended)`);
  console.log(`  [2] Montserrat (Classic clean geometric sans-serif)`);
  console.log(`  [3] Playfair Display (Elegant high-contrast serif)`);
  console.log(`  [4] Inter (Clear highly readable UI neutral sans-serif)`);
  console.log(`  [5] Courier Prime (Retro monospace typewriter)`);
  const fontChoice = await rl.question(`Choose an option (1-5) [Current: "${currentConfig.video.fontFamily}"]: `) || "";
  if (fontChoice === '1') currentConfig.video.fontFamily = 'outfit';
  else if (fontChoice === '2') currentConfig.video.fontFamily = 'montserrat';
  else if (fontChoice === '3') currentConfig.video.fontFamily = 'playfair';
  else if (fontChoice === '4') currentConfig.video.fontFamily = 'inter';
  else if (fontChoice === '5') currentConfig.video.fontFamily = 'courier';

  // Font Weights
  console.log(`\nSelect Font Weight:`);
  console.log(`  [1] Light (300)`);
  console.log(`  [2] Regular (400)`);
  console.log(`  [3] Medium (500)`);
  console.log(`  [4] Semi-Bold (600) - Standard`);
  console.log(`  [5] Bold (700)`);
  console.log(`  [6] Extra-Bold (800)`);
  console.log(`  [7] Black (900)`);
  const weightChoice = await rl.question(`Choose an option (1-7) or enter custom weight value [Current: "${currentConfig.video.fontWeight}"]: `) || "";
  if (weightChoice === '1') currentConfig.video.fontWeight = '300';
  else if (weightChoice === '2') currentConfig.video.fontWeight = '400';
  else if (weightChoice === '3') currentConfig.video.fontWeight = '500';
  else if (weightChoice === '4') currentConfig.video.fontWeight = '600';
  else if (weightChoice === '5') currentConfig.video.fontWeight = '700';
  else if (weightChoice === '6') currentConfig.video.fontWeight = '800';
  else if (weightChoice === '7') currentConfig.video.fontWeight = '900';
  else if (weightChoice.trim() !== "") {
    currentConfig.video.fontWeight = weightChoice.trim();
  }

  // Progress Bar Settings
  console.log(`\nProgress Bar Settings:`);
  if (!currentConfig.video.progressBar) {
    currentConfig.video.progressBar = { show: true, position: 'bottom', color: '', height: 8 };
  }
  currentConfig.video.progressBar.show = await confirm(rl, `📺 Show animated progress bar at edge?`, currentConfig.video.progressBar.show);
  if (currentConfig.video.progressBar.show) {
    const posChoice = await rl.question(`📍 Position (top/bottom) [Current: "${currentConfig.video.progressBar.position}"]: `) || "";
    if (posChoice.trim().toLowerCase() === 'top') {
      currentConfig.video.progressBar.position = 'top';
    } else if (posChoice.trim().toLowerCase() === 'bottom') {
      currentConfig.video.progressBar.position = 'bottom';
    }
    
    currentConfig.video.progressBar.color = await rl.question(`🎨 Hex color (e.g. #ffbbfe, leave blank for theme primary color): `) || currentConfig.video.progressBar.color || '';
    currentConfig.video.progressBar.height = parseInt(await rl.question(`📏 Height in px [Current: ${currentConfig.video.progressBar.height}]: `) || `${currentConfig.video.progressBar.height}`, 10);
  }

  // Preset Theme selection
  console.log(`\nAvailable Preset Themes: radiant-gold, neon-emerald, electric-amethyst, crimson-pulse, cyber-cyan, midnight-magenta, arctic-blue, volcanic-orange, slate-silver, royal-indigo`);
  currentConfig.video.themeName = await rl.question(`🎨 Select Theme Preset [Current: "${currentConfig.video.themeName}"]: `) || currentConfig.video.themeName;

  // STEP 3: TITLE SLIDE SETTINGS
  console.log(`\n${colors.fgMagenta}${colors.bright}--- [Step 2: Title Slide Configuration] ---${colors.reset}`);
  currentConfig.titlePage.show = await confirm(rl, `📄 Display Intro/Title page at start?`, currentConfig.titlePage.show);
  if (currentConfig.titlePage.show) {
    currentConfig.titlePage.title = await rl.question(`🎥 Title text [Current: "${currentConfig.titlePage.title}"]: `) || currentConfig.titlePage.title;
    currentConfig.titlePage.subtitle = await rl.question(`📝 Subtitle text [Current: "${currentConfig.titlePage.subtitle}"]: `) || currentConfig.titlePage.subtitle;
    currentConfig.titlePage.durationInSeconds = parseFloat(await rl.question(`⏳ Duration in seconds [Current: ${currentConfig.titlePage.durationInSeconds}]: `) || `${currentConfig.titlePage.durationInSeconds}`);
    
    console.log(`\nTitle Styles: standard, minimalist, thumbnail, glassmorphic, bold-brutalism, cyberpunk-neon, editorial-serif, split-reveal`);
    currentConfig.titlePage.style = await rl.question(`🎭 Select Title Style [Current: "${currentConfig.titlePage.style || 'standard'}"]: `) || currentConfig.titlePage.style || 'standard';
  }

  // STEP 4: WATERMARK / BRANDING
  console.log(`\n${colors.fgMagenta}${colors.bright}--- [Step 3: Branding / Watermark Overlay] ---${colors.reset}`);
  currentConfig.branding.showLogo = await confirm(rl, `🏷️ Display branding overlay/logo?`, currentConfig.branding.showLogo);
  if (currentConfig.branding.showLogo) {
    currentConfig.branding.logoText = await rl.question(`✍️ Branding Text [Current: "${currentConfig.branding.logoText}"]: `) || currentConfig.branding.logoText;
    
    let validLogo = false;
    let inputLogo = '';
    while (!validLogo) {
      inputLogo = await rl.question(`🖼️ Local path to logo image file (optional, press Enter to keep current: "${currentConfig.branding.logoPath || 'None'}"): `);
      if (!inputLogo.trim()) {
        validLogo = true;
      } else if (fs.existsSync(inputLogo.trim())) {
        currentConfig.branding.logoPath = inputLogo.trim();
        validLogo = true;
      } else {
        console.log(`${colors.fgRed}  ❌ File does not exist! Please check path and try again.${colors.reset}`);
      }
    }
    
    console.log(`Positions: top-left, top-right, bottom-left, bottom-right`);
    currentConfig.branding.position = await rl.question(`📍 Logo alignment [Current: "${currentConfig.branding.position}"]: `) || currentConfig.branding.position;
    currentConfig.branding.size = parseInt(await rl.question(`📏 Logo size in px [Current: ${currentConfig.branding.size}]: `) || `${currentConfig.branding.size}`, 10);
    currentConfig.branding.opacity = parseFloat(await rl.question(`🔮 Logo opacity (0.0 to 1.0) [Current: ${currentConfig.branding.opacity}]: `) || `${currentConfig.branding.opacity}`);
    currentConfig.branding.persistent = await confirm(rl, `🔁 Display on Intro and Outro slides too?`, currentConfig.branding.persistent);
  }

  // STEP 5: AUDIO SETTINGS
  console.log(`\n${colors.fgMagenta}${colors.bright}--- [Step 4: Background Music & Audio] ---${colors.reset}`);
  let validMusic = false;
  while (!validMusic) {
    const inputMusic = await rl.question(`🎵 Local path to background music (.mp3/.wav) [Current: "${currentConfig.audio.musicPath || 'None'}"]: `);
    if (!inputMusic.trim()) {
      validMusic = true;
    } else if (fs.existsSync(inputMusic.trim())) {
      currentConfig.audio.musicPath = inputMusic.trim();
      validMusic = true;
    } else {
      console.log(`${colors.fgRed}  ❌ File does not exist! Please check path and try again.${colors.reset}`);
    }
  }
  
  currentConfig.audio.volume = parseFloat(await rl.question(`🔊 Volume level (0.0 to 1.0) [Current: ${currentConfig.audio.volume}]: `) || `${currentConfig.audio.volume}`);
  currentConfig.audio.loop = await confirm(rl, `🔁 Loop music tracks continuously?`, currentConfig.audio.loop);
  currentConfig.audio.fadeInInSeconds = parseFloat(await rl.question(`⏳ Audio Fade-In duration (seconds) [Current: ${currentConfig.audio.fadeInInSeconds}]: `) || `${currentConfig.audio.fadeInInSeconds}`);
  currentConfig.audio.fadeOutInSeconds = parseFloat(await rl.question(`⏳ Audio Fade-Out duration (seconds) [Current: ${currentConfig.audio.fadeOutInSeconds}]: `) || `${currentConfig.audio.fadeOutInSeconds}`);

  // STEP 6: SLIDES SETUP
  console.log(`\n${colors.fgMagenta}${colors.bright}--- [Step 5: Slide-by-Slide Setup & Media Formats] ---${colors.reset}`);
  
  let slideCount = currentConfig.slides.length || 3;
  if (currentConfig.slides.length > 0) {
    console.log(`I found ${currentConfig.slides.length} slides already defined in settings.`);
    const redef = await confirm(rl, "Would you like to reconfigure all slides from scratch?", false);
    if (redef) {
      slideCount = parseInt(await rl.question(`📊 How many slides would you like to create?: `) || "3", 10);
      currentConfig.slides = [];
    }
  } else {
    slideCount = parseInt(await rl.question(`📊 How many slides/scenes would you like to define?: `) || "3", 10);
  }

  // Capture slide setup details
  if (currentConfig.slides.length === 0) {
    for (let i = 1; i <= slideCount; i++) {
      let retrySlide = true;
      while (retrySlide) {
        console.log(`\n${colors.fgCyan}${colors.bright}• Configure Slide ${i} of ${slideCount}:${colors.reset}`);
        const heading = await rl.question(`  Heading [e.g. Topic ${i}]: `) || `Topic ${i}`;
        const content = await rl.question(`  Text content body: `);
        
        let mediaPath = '';
        const attachMedia = await confirm(rl, `  Attach an image or video file to Slide ${i}?`, false);
        if (attachMedia) {
          let validFile = false;
          while (!validFile) {
            mediaPath = await rl.question(`  Enter path to image/video file: `);
            if (fs.existsSync(mediaPath)) {
              validFile = true;
            } else {
              console.log(`${colors.fgRed}  ❌ File does not exist! Please check path and try again.${colors.reset}`);
              const abortMedia = !(await confirm(rl, `  Try entering media path again?`, true));
              if (abortMedia) break;
            }
          }
        }

        let mediaStartFromInSeconds = 0;
        if (mediaPath && fs.existsSync(mediaPath) && getMediaType(mediaPath) === 'video') {
          mediaStartFromInSeconds = parseFloat(await rl.question(`  Start video playback from which second? [Default: 0]: `) || "0");
        }

        console.log(`  Layouts: split-media-right (Default), split-media-left, full-background-media, text-only, media-only`);
        const layout = await rl.question(`  Select Layout [Default: split-media-right]: `) || "split-media-right";
        
        const defaultDur = mediaPath && getMediaType(mediaPath) === 'video' ? 8 : 5;
        const durationInSeconds = parseFloat(await rl.question(`  Slide duration in seconds [Default: ${defaultDur}]: `) || `${defaultDur}`);

        console.log(`\n${colors.bright}Slide Summary Preview:${colors.reset}`);
        console.log(` 👉 Title: ${heading}`);
        console.log(` 👉 Content: ${content}`);
        console.log(` 👉 Media: ${mediaPath || 'None'}`);
        console.log(` 👉 Layout: ${layout}`);
        console.log(` 👉 Duration: ${durationInSeconds}s`);

        const slideOk = await confirm(rl, `Confirm: Is Slide ${i} correct? (Select No to retry this slide)`, true);
        if (slideOk) {
          retrySlide = false;
          currentConfig.slides.push({
            id: `slide_${i}`,
            folder: `slide ${i}`,
            heading,
            content,
            mediaSourcePath: mediaPath,
            mediaStartFromInSeconds,
            layout,
            durationInSeconds,
            transition: 'fade'
          });
        }
      }
    }
  }

  // STEP 7: END CREDITS SLIDE
  console.log(`\n${colors.fgMagenta}${colors.bright}--- [Step 6: Outro / End Credits Slide Settings] ---${colors.reset}`);
  currentConfig.endPage.show = await confirm(rl, `🎬 Display Outro/End slide at the video end?`, currentConfig.endPage.show);
  if (currentConfig.endPage.show) {
    currentConfig.endPage.title = await rl.question(`📝 Outro slide Title [Current: "${currentConfig.endPage.title}"]: `) || currentConfig.endPage.title;
    currentConfig.endPage.subtitle = await rl.question(`📝 Outro slide Subtitle [Current: "${currentConfig.endPage.subtitle}"]: `) || currentConfig.endPage.subtitle;
    currentConfig.endPage.contact = await rl.question(`📞 Contact details [Current: "${currentConfig.endPage.contact}"]: `) || currentConfig.endPage.contact;
    currentConfig.endPage.website = await rl.question(`🌐 Website URL [Current: "${currentConfig.endPage.website}"]: `) || currentConfig.endPage.website;
    currentConfig.endPage.durationInSeconds = parseFloat(await rl.question(`⏳ Duration in seconds [Current: ${currentConfig.endPage.durationInSeconds}]: `) || `${currentConfig.endPage.durationInSeconds}`);
    
    console.log(`\nOutro Page Styles: standard, minimalist, thumbnail, glassmorphic, bold-brutalism, cyberpunk-neon, editorial-serif, split-reveal`);
    currentConfig.endPage.style = await rl.question(`🎭 Select End Page Style Preset [Current: "${currentConfig.endPage.style || 'standard'}"]: `) || currentConfig.endPage.style || 'standard';
  }

  // Write files and folders
  console.log(`\n${colors.fgYellow}${colors.bright}🔧 Provisioning directories and copying assets...${colors.reset}`);
  if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true });

  // Copy logo
  if (currentConfig.branding.logoPath && !currentConfig.branding.logoPath.startsWith('assets/') && fs.existsSync(currentConfig.branding.logoPath)) {
    const brandDir = path.join(assetsDir, 'branding');
    if (!fs.existsSync(brandDir)) fs.mkdirSync(brandDir, { recursive: true });
    const filename = path.basename(currentConfig.branding.logoPath);
    const dest = path.join(brandDir, filename);
    fs.copyFileSync(currentConfig.branding.logoPath, dest);
    currentConfig.branding.logoPath = `assets/branding/${filename}`;
  }

  // Copy background music
  if (currentConfig.audio.musicPath && !currentConfig.audio.musicPath.startsWith('assets/') && fs.existsSync(currentConfig.audio.musicPath)) {
    const musicDir = path.join(assetsDir, 'music');
    if (!fs.existsSync(musicDir)) fs.mkdirSync(musicDir, { recursive: true });
    const filename = path.basename(currentConfig.audio.musicPath);
    const dest = path.join(musicDir, filename);
    fs.copyFileSync(currentConfig.audio.musicPath, dest);
    currentConfig.audio.musicPath = `assets/music/${filename}`;
  }

  // Slide asset mapping and copying
  for (let i = 0; i < currentConfig.slides.length; i++) {
    const slide = currentConfig.slides[i];
    // Keep consistent folder name
    const slideFolder = slide.folder || `slide ${i + 1}`;
    const slideDir = path.join(assetsDir, slideFolder);
    
    if (!fs.existsSync(slideDir)) fs.mkdirSync(slideDir, { recursive: true });
    
    // Write nametext.txt
    const textData = `${slide.heading || ''}\n${slide.content || ''}`;
    fs.writeFileSync(path.join(slideDir, 'nametext.txt'), textData.trim(), 'utf-8');

    // Copy slide media if it is a local path
    if (slide.mediaSourcePath && !slide.mediaSourcePath.startsWith('assets/') && fs.existsSync(slide.mediaSourcePath)) {
      // Clear older media files inside the folder so we don't have multiple conflicting media files
      const files = fs.readdirSync(slideDir);
      for (const file of files) {
        if (file !== 'nametext.txt') {
          fs.rmSync(path.join(slideDir, file), { force: true });
        }
      }
      const filename = path.basename(slide.mediaSourcePath);
      const dest = path.join(slideDir, filename);
      fs.copyFileSync(slide.mediaSourcePath, dest);
      console.log(`Copied slide ${i + 1} media asset: assets/${slideFolder}/${filename}`);
    }
  }

  // Write base configuration parameters
  fs.writeFileSync(configPath, JSON.stringify(currentConfig, null, 2), 'utf-8');
  console.log(`Initial parameters saved to config.json.`);

  // STEP 8: DYNAMIC RUN LOOP WITH REVIEWS AND EDITS
  let setupActive = true;
  while (setupActive) {
    console.log(`\n${colors.fgYellow}${colors.bright}🤖 Compiling layout assets & auto-splitting text...${colors.reset}`);
    execSync('node scripts/scan-assets.mjs', { cwd: projectRoot, stdio: 'inherit' });

    console.log(`\n${colors.fgGreen}${colors.bright}✅ Video configuration and asset structures compiled successfully!${colors.reset}`);
    
    console.log(`\n${colors.fgCyan}${colors.bright}================================================================`);
    console.log(`🔍   REVIEW MASTER CONFIGURATION   👉   BALERKAJ BOT`);
    console.log(`================================================================${colors.reset}`);
    console.log(`Please open and inspect the generated config.json file in your editor:`);
    console.log(`📂 Path: ${configPath}`);
    console.log(`\nYou can verify the generated slides, text splits, layouts, durations, and styles.`);
    console.log(`If you make edits directly in the config.json file, save it now.`);

    const happyWithConfig = await confirm(rl, "Did you check the config file and are you happy to proceed?", true);
    
    let shouldRender = false;
    if (happyWithConfig) {
      shouldRender = await confirm(rl, "Would you like to build and render the video now?", true);
    } else {
      console.log(`\n${colors.fgYellow}No problem! Let's go straight to the adjustments menu to make edits.${colors.reset}`);
    }

    if (shouldRender) {
      console.log(`\n${colors.fgYellow}${colors.bright}Rendering video to out/output.mp4...${colors.reset}`);
      try {
        execSync('node scripts/render.mjs', { cwd: projectRoot, stdio: 'inherit' });
      } catch (err) {
        console.error(`${colors.fgRed}❌ Rendering error: ${err.message}${colors.reset}`);
      }
    }

    // Still image rendering options
    console.log(`\nSelect Still Asset(s) to render:`);
    console.log(`  [1] YouTube/Landscape Thumbnail (1920x1080)`);
    console.log(`  [2] Instagram Post Still (1080x1080)`);
    console.log(`  [3] Shorts Cover Still (1080x1920)`);
    console.log(`  [4] Render All Stills`);
    console.log(`  [5] Skip still rendering`);
    const stillChoice = await rl.question(`Choose an option (1-5) [Default: 5 (Skip)]: `) || "5";
    
    if (stillChoice !== '5') {
      const compsToRender = [];
      if (stillChoice === '1') compsToRender.push('Thumbnail');
      else if (stillChoice === '2') compsToRender.push('InstagramPost');
      else if (stillChoice === '3') compsToRender.push('Shorts');
      else if (stillChoice === '4') compsToRender.push('Thumbnail', 'InstagramPost', 'Shorts');
      
      for (const comp of compsToRender) {
        console.log(`\n${colors.fgYellow}${colors.bright}Rendering still image from composition ${comp}...${colors.reset}`);
        try {
          execSync(`node scripts/render.mjs --still=${comp}`, { cwd: projectRoot, stdio: 'inherit' });
        } catch (err) {
          console.error(`${colors.fgRed}❌ Still image render error for ${comp}: ${err.message}${colors.reset}`);
        }
      }
    }

    console.log(`\n${colors.fgCyan}${colors.bright}===================================================`);
    console.log(`🔄   REVIEW & CHANGE LOOP   👉   BALERKAJ BOT`);
    console.log(`====================================================${colors.reset}`);
    const makeChanges = await confirm(rl, "Would you like to make adjustments or edit your slide contents?", false);
    
    if (makeChanges) {
      console.log(`\nWhat adjustments would you like to perform?`);
      console.log(` [1] Modify Global Settings (Title, Theme, Styles, Watermark, Audio, Fonts, Progress Bar)`);
      console.log(` [2] Edit details of a specific Slide`);
      console.log(` [3] Append a new slide`);
      console.log(` [4] Delete a slide`);
      console.log(` [5] Exit loop`);
      
      const choice = await rl.question(`Choose an option (1-5): `);
      const parsedConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

      if (choice === '1') {
        // Edit globals
        console.log(`Select Video Aspect Ratio / Format:`);
        console.log(`  [1] Landscape (16:9 - 1920x1080)`);
        console.log(`  [2] Portrait (9:16 - 1080x1920)`);
        console.log(`  [3] Square (1:1 - 1080x1080)`);
        console.log(`  [4] Custom`);
        const aChoice = await rl.question(`Choose an option (1-4) [Current width: ${parsedConfig.video.width}, height: ${parsedConfig.video.height}]: `);
        if (aChoice === '2') { parsedConfig.video.width = 1080; parsedConfig.video.height = 1920; }
        else if (aChoice === '3') { parsedConfig.video.width = 1080; parsedConfig.video.height = 1080; }
        else if (aChoice === '4') {
          parsedConfig.video.width = parseInt(await rl.question(`Width px: `) || `${parsedConfig.video.width}`, 10);
          parsedConfig.video.height = parseInt(await rl.question(`Height px: `) || `${parsedConfig.video.height}`, 10);
        } else if (aChoice === '1') { parsedConfig.video.width = 1920; parsedConfig.video.height = 1080; }

        parsedConfig.video.maxCharactersPerSlide = parseInt(await rl.question(`✂️ Max Characters per slide before splitting [Current: ${parsedConfig.video.maxCharactersPerSlide}]: `) || `${parsedConfig.video.maxCharactersPerSlide}`, 10);

        console.log(`\nSelect Font Family:`);
        console.log(`  [1] Outfit [2] Montserrat [3] Playfair [4] Inter [5] Courier`);
        const fChoice = await rl.question(`Choose option (1-5) [Current: ${parsedConfig.video.fontFamily || 'outfit'}]: `);
        if (fChoice === '1') parsedConfig.video.fontFamily = 'outfit';
        else if (fChoice === '2') parsedConfig.video.fontFamily = 'montserrat';
        else if (fChoice === '3') parsedConfig.video.fontFamily = 'playfair';
        else if (fChoice === '4') parsedConfig.video.fontFamily = 'inter';
        else if (fChoice === '5') parsedConfig.video.fontFamily = 'courier';

        const wChoice = await rl.question(`Select Font Weight [Current: ${parsedConfig.video.fontWeight || '600'}]: `);
        if (wChoice.trim()) parsedConfig.video.fontWeight = wChoice.trim();

        // Progress bar globals edit
        parsedConfig.video.progressBar = parsedConfig.video.progressBar || { show: true, position: 'bottom', color: '', height: 8 };
        parsedConfig.video.progressBar.show = await confirm(rl, `📺 Show progress bar?`, parsedConfig.video.progressBar.show);
        if (parsedConfig.video.progressBar.show) {
          parsedConfig.video.progressBar.position = (await rl.question(`📍 Position (top/bottom) [Current: ${parsedConfig.video.progressBar.position}]: `) || parsedConfig.video.progressBar.position || 'bottom').trim().toLowerCase() === 'top' ? 'top' : 'bottom';
          parsedConfig.video.progressBar.color = await rl.question(`🎨 Color hex [Current: ${parsedConfig.video.progressBar.color}]: `) || parsedConfig.video.progressBar.color || '';
          parsedConfig.video.progressBar.height = parseInt(await rl.question(`📏 Height px [Current: ${parsedConfig.video.progressBar.height}]: `) || `${parsedConfig.video.progressBar.height}`, 10);
        }

        parsedConfig.titlePage.show = await confirm(rl, `📄 Display Title slide?`, parsedConfig.titlePage.show);
        if (parsedConfig.titlePage.show) {
          parsedConfig.titlePage.title = await rl.question(`🎥 Video Title [Current: "${parsedConfig.titlePage.title}"]: `) || parsedConfig.titlePage.title;
          parsedConfig.titlePage.subtitle = await rl.question(`📝 Title Subtitle [Current: "${parsedConfig.titlePage.subtitle}"]: `) || parsedConfig.titlePage.subtitle;
          parsedConfig.titlePage.durationInSeconds = parseFloat(await rl.question(`⏳ Title duration (seconds) [Current: ${parsedConfig.titlePage.durationInSeconds}]: `) || `${parsedConfig.titlePage.durationInSeconds}`);
          console.log(`Title Styles: standard, minimalist, thumbnail, glassmorphic, bold-brutalism, cyberpunk-neon, editorial-serif, split-reveal`);
          parsedConfig.titlePage.style = await rl.question(`🎭 Title Style [Current: "${parsedConfig.titlePage.style || 'standard'}"]: `) || parsedConfig.titlePage.style || 'standard';
        }

        parsedConfig.endPage.show = await confirm(rl, `🎬 Display Outro/End slide?`, parsedConfig.endPage.show);
        if (parsedConfig.endPage.show) {
          parsedConfig.endPage.title = await rl.question(`📝 End Title [Current: "${parsedConfig.endPage.title}"]: `) || parsedConfig.endPage.title;
          parsedConfig.endPage.subtitle = await rl.question(`📝 End Subtitle [Current: "${parsedConfig.endPage.subtitle}"]: `) || parsedConfig.endPage.subtitle;
          parsedConfig.endPage.contact = await rl.question(`📞 Contact [Current: "${parsedConfig.endPage.contact}"]: `) || parsedConfig.endPage.contact;
          parsedConfig.endPage.website = await rl.question(`🌐 Website [Current: "${parsedConfig.endPage.website}"]: `) || parsedConfig.endPage.website;
          parsedConfig.endPage.durationInSeconds = parseFloat(await rl.question(`⏳ End duration (seconds) [Current: ${parsedConfig.endPage.durationInSeconds}]: `) || `${parsedConfig.endPage.durationInSeconds}`);
          console.log(`End Page Styles: standard, minimalist, thumbnail, glassmorphic, bold-brutalism, cyberpunk-neon, editorial-serif, split-reveal`);
          parsedConfig.endPage.style = await rl.question(`🎭 End Style [Current: "${parsedConfig.endPage.style || 'standard'}"]: `) || parsedConfig.endPage.style || 'standard';
        }

        parsedConfig.video.themeName = await rl.question(`🎨 Theme Preset [Current: "${parsedConfig.video.themeName}"]: `) || parsedConfig.video.themeName;
        
        parsedConfig.branding.showLogo = await confirm(rl, `🏷️ Show Logo Overlay?`, parsedConfig.branding.showLogo);
        if (parsedConfig.branding.showLogo) {
          parsedConfig.branding.logoText = await rl.question(`✍️ Logo text [Current: "${parsedConfig.branding.logoText}"]: `) || parsedConfig.branding.logoText;
          const inputLogo = await rl.question(`🖼️ Path to logo [Current: "${parsedConfig.branding.logoPath}"]: `);
          if (inputLogo.trim()) parsedConfig.branding.logoPath = inputLogo.trim();
          parsedConfig.branding.position = await rl.question(`📍 Position [Current: "${parsedConfig.branding.position}"]: `) || parsedConfig.branding.position;
          parsedConfig.branding.size = parseInt(await rl.question(`📏 Size px [Current: ${parsedConfig.branding.size}]: `) || `${parsedConfig.branding.size}`, 10);
          parsedConfig.branding.opacity = parseFloat(await rl.question(`🔮 Opacity [Current: ${parsedConfig.branding.opacity}]: `) || `${parsedConfig.branding.opacity}`);
          parsedConfig.branding.persistent = await confirm(rl, `🔁 Persistent overlay?`, parsedConfig.branding.persistent);
        }

        parsedConfig.audio.volume = parseFloat(await rl.question(`🔊 Music Volume [Current: ${parsedConfig.audio.volume}]: `) || `${parsedConfig.audio.volume}`);
        parsedConfig.audio.fadeInInSeconds = parseFloat(await rl.question(`⏳ Fade-In Duration [Current: ${parsedConfig.audio.fadeInInSeconds}]: `) || `${parsedConfig.audio.fadeInInSeconds}`);
        parsedConfig.audio.fadeOutInSeconds = parseFloat(await rl.question(`⏳ Fade-Out Duration [Current: ${parsedConfig.audio.fadeOutInSeconds}]: `) || `${parsedConfig.audio.fadeOutInSeconds}`);
        
        fs.writeFileSync(configPath, JSON.stringify(parsedConfig, null, 2), 'utf-8');
        console.log(`${colors.fgGreen}Globals updated!${colors.reset}`);

      } else if (choice === '2') {
        // Edit specific slide
        const uniqueSlides = [];
        const seenFolders = new Set();
        
        for (const s of parsedConfig.slides) {
          if (!seenFolders.has(s.folder)) {
            seenFolders.add(s.folder);
            uniqueSlides.push(s);
          }
        }

        console.log(`\nSlides catalog:`);
        uniqueSlides.forEach((s, idx) => {
          console.log(`  [${idx + 1}] Heading: "${s.heading}" | Content: "${s.content.substring(0, 40)}..."`);
        });
        
        const slideNum = parseInt(await rl.question(`Select slide number to modify (1-${uniqueSlides.length}): `) || "1", 10);
        if (slideNum >= 1 && slideNum <= uniqueSlides.length) {
          const targetSlide = uniqueSlides[slideNum - 1];
          console.log(`\nEditing Slide ${slideNum}:`);
          const newHeading = await rl.question(`  Heading [Current: "${targetSlide.heading}"]: `) || targetSlide.heading;
          const newContent = await rl.question(`  Content body: `);
          
          const changeMedia = await confirm(rl, "Do you want to change the image/video for this slide?", false);
          let newMediaSource = targetSlide.mediaSourcePath || '';
          if (changeMedia) {
            newMediaSource = await rl.question("  Enter path to new media file: ");
          }

          let mediaStartFromInSeconds = targetSlide.mediaStartFromInSeconds || 0;
          if (newMediaSource && fs.existsSync(newMediaSource) && getMediaType(newMediaSource) === 'video') {
            mediaStartFromInSeconds = parseFloat(await rl.question(`  Start video playback from which second? [Current: ${mediaStartFromInSeconds}]: `) || `${mediaStartFromInSeconds}`);
          }

          console.log(`  Layouts: split-media-right, split-media-left, full-background-media, text-only, media-only`);
          const newLayout = await rl.question(`  Layout [Current: "${targetSlide.layout}"]: `) || targetSlide.layout;
          
          const newDuration = parseFloat(await rl.question(`  Duration in seconds [Current: ${targetSlide.durationInSeconds}]: `) || `${targetSlide.durationInSeconds}`);

          // Update folder text file
          const slideDir = path.join(assetsDir, targetSlide.folder);
          if (!fs.existsSync(slideDir)) fs.mkdirSync(slideDir, { recursive: true });
          fs.writeFileSync(path.join(slideDir, 'nametext.txt'), `${newHeading}\n${newContent}`, 'utf-8');
          
          if (changeMedia && fs.existsSync(newMediaSource)) {
            const files = fs.readdirSync(slideDir);
            for (const file of files) {
              if (file !== 'nametext.txt') fs.rmSync(path.join(slideDir, file), { force: true });
            }
            const filename = path.basename(newMediaSource);
            fs.copyFileSync(newMediaSource, path.join(slideDir, filename));
            console.log(`Copied new media asset: assets/${targetSlide.folder}/${filename}`);
          }

          // Write updates back into config.json
          parsedConfig.slides.forEach(s => {
            if (s.folder === targetSlide.folder) {
              s.heading = newHeading;
              s.content = newContent;
              s.layout = newLayout;
              s.durationInSeconds = newDuration;
              s.mediaStartFromInSeconds = mediaStartFromInSeconds;
              if (changeMedia) {
                s.mediaSourcePath = newMediaSource;
              }
            }
          });
          
          fs.writeFileSync(configPath, JSON.stringify(parsedConfig, null, 2), 'utf-8');
          console.log(`${colors.fgGreen}Slide ${slideNum} updated successfully!${colors.reset}`);
        } else {
          console.log(`${colors.fgRed}Invalid slide number selection.${colors.reset}`);
        }

      } else if (choice === '3') {
        // Append new slide
        const nextIndex = parsedConfig.slides.length + 1;
        const heading = await rl.question(`Heading for new slide: `) || `Topic ${nextIndex}`;
        const content = await rl.question(`Text content body: `);
        
        let mediaSourcePath = '';
        const attachMedia = await confirm(rl, `Attach media to new slide?`, false);
        if (attachMedia) {
          mediaSourcePath = await rl.question(`Path to image/video file: `);
        }
        
        let mediaStartFromInSeconds = 0;
        if (mediaSourcePath && fs.existsSync(mediaSourcePath) && getMediaType(mediaSourcePath) === 'video') {
          mediaStartFromInSeconds = parseFloat(await rl.question(`Start video playback from which second? [Default: 0]: `) || "0");
        }

        console.log(`Layouts: split-media-right, split-media-left, full-background-media, text-only, media-only`);
        const layout = await rl.question(`Select Layout [Default: split-media-right]: `) || "split-media-right";
        
        const defaultDur = mediaSourcePath && getMediaType(mediaSourcePath) === 'video' ? 8 : 5;
        const durationInSeconds = parseFloat(await rl.question(`Slide duration in seconds [Default: ${defaultDur}]: `) || `${defaultDur}`);

        const folderName = `slide ${nextIndex}`;
        const slideDir = path.join(assetsDir, folderName);
        if (!fs.existsSync(slideDir)) fs.mkdirSync(slideDir, { recursive: true });

        fs.writeFileSync(path.join(slideDir, 'nametext.txt'), `${heading}\n${content}`, 'utf-8');
        if (mediaSourcePath && fs.existsSync(mediaSourcePath)) {
          const filename = path.basename(mediaSourcePath);
          fs.copyFileSync(mediaSourcePath, path.join(slideDir, filename));
        }

        parsedConfig.slides.push({
          id: `slide_${nextIndex}`,
          folder: folderName,
          heading,
          content,
          mediaSourcePath,
          mediaStartFromInSeconds,
          layout,
          durationInSeconds,
          transition: 'fade'
        });
        
        fs.writeFileSync(configPath, JSON.stringify(parsedConfig, null, 2), 'utf-8');
        console.log(`${colors.fgGreen}Added slide ${nextIndex} under folder: assets/${folderName}${colors.reset}`);

      } else if (choice === '4') {
        // Delete slide
        const uniqueSlides = [];
        const seenFolders = new Set();
        for (const s of parsedConfig.slides) {
          if (!seenFolders.has(s.folder)) {
            seenFolders.add(s.folder);
            uniqueSlides.push(s);
          }
        }
        
        console.log(`\nSlides Catalog:`);
        uniqueSlides.forEach((s, idx) => {
          console.log(`  [${idx + 1}] Heading: "${s.heading}"`);
        });

        const num = parseInt(await rl.question(`Select slide number to delete (1-${uniqueSlides.length}): `), 10);
        if (num >= 1 && num <= uniqueSlides.length) {
          const target = uniqueSlides[num - 1];
          
          const slidePath = path.join(assetsDir, target.folder);
          if (fs.existsSync(slidePath)) {
            fs.rmSync(slidePath, { recursive: true, force: true });
            console.log(`Wiped assets folder: assets/${target.folder}`);
          }

          parsedConfig.slides = parsedConfig.slides.filter(s => s.folder !== target.folder);
          
          const remainingFolders = fs.readdirSync(assetsDir)
            .filter(f => fs.statSync(path.join(assetsDir, f)).isDirectory() && f.startsWith('slide'))
            .sort(naturalSort);

          const tempSlides = [];
          remainingFolders.forEach((oldFolder, idx) => {
            const newIndex = idx + 1;
            const newFolderName = `slide ${newIndex}`;
            
            const oldPath = path.join(assetsDir, oldFolder);
            const newPath = path.join(assetsDir, newFolderName);
            
            if (oldPath !== newPath) {
              fs.renameSync(oldPath, newPath);
              console.log(`Renamed assets/${oldFolder} to assets/${newFolderName}`);
            }

            const matchedSlides = parsedConfig.slides.filter(s => s.folder === oldFolder);
            matchedSlides.forEach(s => {
              s.folder = newFolderName;
              s.id = s.id.replace(oldFolder.replace(/\s+/g, '_').toLowerCase(), newFolderName.replace(/\s+/g, '_').toLowerCase());
            });
            tempSlides.push(...matchedSlides);
          });

          parsedConfig.slides = tempSlides;
          fs.writeFileSync(configPath, JSON.stringify(parsedConfig, null, 2), 'utf-8');
          console.log(`${colors.fgGreen}Slide deleted and folders re-indexed!${colors.reset}`);
        } else {
          console.log(`${colors.fgRed}Invalid selection.${colors.reset}`);
        }
      } else {
        setupActive = false;
        console.log(`\nExiting review loop.`);
      }
    } else {
      setupActive = false;
      console.log(`\nConfiguration finalized. Exiting Balerkaj Bot guide.`);
    }
  }

  rl.close();
  console.log(`\n${colors.fgGreen}${colors.bright}🎬 Thank you for using Balerkaj Bot! Happy rendering! 🎬${colors.reset}\n`);
}

runSetup().catch(console.error);
