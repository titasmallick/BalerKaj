import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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

// Function to split text cleanly at sentence/paragraph/word boundaries
function splitText(text, maxChars = 450) {
  if (!text || text.trim().length <= maxChars) return [text || ""];
  
  const chunks = [];
  let remaining = text.trim();
  
  while (remaining.length > 0) {
    if (remaining.length <= maxChars) {
      chunks.push(remaining);
      break;
    }
    
    let splitIndex = -1;
    const searchString = remaining.substring(0, maxChars);
    
    // Look for paragraph or sentence end markers
    const markers = ['\n\n', '\n', '. ', '? ', '! '];
    for (const marker of markers) {
      const idx = searchString.lastIndexOf(marker);
      if (idx > splitIndex && idx > maxChars * 0.35) {
        splitIndex = idx + marker.length;
      }
    }
    
    // Fallback to space
    if (splitIndex === -1) {
      splitIndex = searchString.lastIndexOf(' ');
    }
    
    // Fallback to absolute split if no space
    if (splitIndex === -1 || splitIndex === 0) {
      splitIndex = maxChars;
    }
    
    chunks.push(remaining.substring(0, splitIndex).trim());
    remaining = remaining.substring(splitIndex).trim();
  }
  
  return chunks;
}

async function scan() {
  console.log('Scanning assets directory...');
  const legacyAssetsDir = path.join(projectRoot, 'assets');
  const assetsDir = path.join(projectRoot, 'public', 'assets');
  
  if (fs.existsSync(legacyAssetsDir) && !fs.existsSync(assetsDir)) {
    console.log('Migrating legacy assets folder to public/assets for rendering efficiency...');
    fs.mkdirSync(path.join(projectRoot, 'public'), { recursive: true });
    fs.renameSync(legacyAssetsDir, assetsDir);
  }

  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
  }

  // Load existing config if it exists
  const configPath = path.join(projectRoot, 'config.json');
  let existingConfig = {};
  if (fs.existsSync(configPath)) {
    try {
      existingConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
      console.log('Pre-loaded existing config.json to preserve manual overrides.');
    } catch (e) {
      console.warn('Error reading config.json, will use defaults.', e.message);
    }
  }

  // Determine character threshold from config or default to 450
  const maxChars = existingConfig?.video?.maxCharactersPerSlide || 450;
  console.log(`Text split character threshold: ${maxChars}`);

  // Find music files in assets/music or assets
  let musicPath = '';
  const musicDir = path.join(assetsDir, 'music');
  if (fs.existsSync(musicDir)) {
    const musicFiles = fs.readdirSync(musicDir).filter(f => f.toLowerCase().endsWith('.mp3') || f.toLowerCase().endsWith('.wav'));
    if (musicFiles.length > 0) {
      musicPath = `assets/music/${musicFiles[0]}`;
    }
  } else {
    // Look in assets root for any mp3
    const files = fs.readdirSync(assetsDir).filter(f => f.toLowerCase().endsWith('.mp3'));
    if (files.length > 0) {
      musicPath = `assets/${files[0]}`;
    }
  }

  // Scan for slide folders
  const folders = fs.readdirSync(assetsDir)
    .filter(f => {
      const fullPath = path.join(assetsDir, f);
      return fs.statSync(fullPath).isDirectory() && f !== 'music' && f !== 'branding' && f !== 'logo';
    })
    .sort(naturalSort);

  console.log(`Found ${folders.length} slide folders:`, folders);

  const scannedSlides = [];

  for (const folder of folders) {
    const folderPath = path.join(assetsDir, folder);
    const files = fs.readdirSync(folderPath);

    let media = null;
    let mediaType = null;
    let heading = '';
    let subheading = '';
    let content = '';

    // Look for media and text files
    for (const file of files) {
      const filePath = path.join(folderPath, file);
      if (fs.statSync(filePath).isDirectory()) continue;

      const type = getMediaType(file);
      if (type) {
        media = `assets/${folder}/${file}`;
        mediaType = type;
      }

      // Check text files
      const lowerFile = file.toLowerCase();
      if (lowerFile.endsWith('.txt')) {
        const textContent = fs.readFileSync(filePath, 'utf-8').trim();
        
        if (lowerFile === 'nametext.txt' || lowerFile === 'heading.txt' || lowerFile === 'title.txt') {
          const lines = textContent.split('\n').map(l => l.trim()).filter(Boolean);
          if (lines.length > 0) {
            heading = lines[0];
            if (lines.length > 1) {
              content = lines.slice(1).join('\n');
            }
          }
        } else if (lowerFile === 'subheading.txt' || lowerFile === 'subtitle.txt') {
          subheading = textContent;
        } else if (lowerFile === 'descriptive_text.txt' || lowerFile === 'content.txt') {
          content = textContent;
        } else {
          // General fallback for any text file
          if (!content) {
            content = textContent;
          }
        }
      }
    }

    // Set heading fallback to folder name if nothing is set
    if (!heading && !content) {
      heading = folder.toUpperCase();
    }

    // Split text into chunks if it exceeds the limit
    const textChunks = splitText(content, maxChars);
    let accumulatedOffset = 0;

    for (let i = 0; i < textChunks.length; i++) {
      const chunk = textChunks[i];
      const isFirst = i === 0;
      
      const slideId = isFirst 
        ? folder.replace(/\s+/g, '_').toLowerCase()
        : `${folder.replace(/\s+/g, '_').toLowerCase()}_part${i + 1}`;

      const slideHeading = isFirst 
        ? heading 
        : (heading ? `${heading} (Contd.)` : '');

      // Default duration is 5s for static/text, 8s for video
      const durationInSeconds = mediaType === 'video' ? 8 : 5;

      // Layout configuration
      let layout = 'split-media-right';
      if (!media) {
        layout = 'text-only';
      }

      scannedSlides.push({
        id: slideId,
        folder,
        media,
        mediaType,
        heading: slideHeading,
        subheading,
        content: chunk,
        durationInSeconds,
        mediaStartFromInSeconds: mediaType === 'video' ? accumulatedOffset : 0,
        layout,
        transition: 'fade'
      });

      accumulatedOffset += durationInSeconds;
    }
  }

  // Define defaultConfig template
  const defaultConfig = {
    video: {
      width: 1920,
      height: 1080,
      fps: 30,
      maxCharactersPerSlide: 450,
      themeName: 'royal-indigo',
      theme: {},
      fontFamily: 'outfit',
      fontWeight: '600',
      disableAnimations: false,
      iconName: 'Music',
      progressBar: {
        show: true,
        position: 'bottom',
        color: '',
        height: 8
      }
    },
    audio: {
      musicPath: musicPath || 'assets/music/background.mp3',
      volume: 0.1,
      loop: true,
      fadeInInSeconds: 2,
      fadeOutInSeconds: 2
    },
    branding: {
      showLogo: true,
      logoPath: '',
      logoText: 'TITAS SIR BIOLOGY',
      position: 'top-left',
      size: 50,
      opacity: 0.9,
      persistent: true,
      authorName: 'Titas Sir Biology',
      badgeText: 'BIONOTES'
    },
    titlePage: {
      show: true,
      title: 'Dynamic Scientific Presentation',
      subtitle: 'Visualizing Knowledge with Precision',
      durationInSeconds: 3,
      theme: {
        background: 'linear-gradient(135deg, #0a0d14 0%, #1a103c 100%)',
        textColor: '#f8fafc',
        subtitleColor: '#d5d4ff'
      }
    },
    slides: [],
    endPage: {
      show: true,
      title: 'Biology Tuition Classes',
      subtitle: 'Stop Memorizing. Start Scoring.',
      contact: 'Call: +91 9123774239 | email@example.com',
      website: 'titassir.eugenicserudite.xyz',
      durationInSeconds: 4,
      theme: {
        background: 'linear-gradient(135deg, #1a103c 0%, #0a0d14 100%)',
        textColor: '#f8fafc',
        subtitleColor: '#ffbbfe'
      }
    }
  };

  const config = { ...defaultConfig, ...existingConfig };
  
  // Clean merge of config fields
  config.video = { ...defaultConfig.video, ...config.video };
  config.audio = { ...defaultConfig.audio, ...config.audio };
  if (musicPath && !config.audio.musicPath) {
    config.audio.musicPath = musicPath;
  }
  config.branding = { ...defaultConfig.branding, ...config.branding };
  config.titlePage = { ...defaultConfig.titlePage, ...config.titlePage };
  config.endPage = { ...defaultConfig.endPage, ...config.endPage };

  // Merge slides based on unique slide ID
  const existingSlides = config.slides || [];
  const existingMap = new Map(existingSlides.map(s => [s.id, s]));

  config.slides = scannedSlides.map(scanned => {
    const existing = existingMap.get(scanned.id);
    if (existing) {
      return {
        ...scanned,
        subheading: existing.subheading ?? scanned.subheading,
        durationInSeconds: existing.durationInSeconds ?? scanned.durationInSeconds,
        layout: existing.layout || scanned.layout,
        transition: existing.transition || scanned.transition,
        mediaStartFromInSeconds: existing.mediaStartFromInSeconds ?? scanned.mediaStartFromInSeconds
      };
    }
    return scanned;
  });

  fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8');
  console.log(`Saved configuration to: ${configPath}`);
}

scan().catch(console.error);
