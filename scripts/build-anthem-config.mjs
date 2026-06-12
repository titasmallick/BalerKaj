import fs from 'fs';
import path from 'path';

const srtPath = 'C:/Users/Titas Mallick/Downloads/POG/Timed_Lyrics.txt';
const jsonPath = 'C:/Users/Titas Mallick/Downloads/POG/School_Anthem_eng.json';

// Parse SRT time format (00:00:13,000) to seconds (13.0)
function parseSrtTime(timeStr) {
  const parts = timeStr.trim().split(':');
  const secondsParts = parts[2].split(',');
  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  const seconds = parseInt(secondsParts[0], 10);
  const ms = parseInt(secondsParts[1], 10);
  return hours * 3600 + minutes * 60 + seconds + ms / 1000;
}

// Read files
const srtContent = fs.readFileSync(srtPath, 'utf8');
const srtBlocks = srtContent.split(/\r?\n\r?\n/).filter(b => b.trim());
const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Flatten all words from Elevenlabs JSON
const allWords = [];
jsonData.segments.forEach(seg => {
  if (seg.words) {
    seg.words.forEach(word => {
      const cleanText = word.text.trim();
      if (cleanText) {
        allWords.push({
          text: cleanText,
          start_time: word.start_time,
          end_time: word.end_time
        });
      }
    });
  }
});

// Map images for slides
const images = [
  "assets/pog/school picture.jpeg",
  "assets/pog/title banner.jpeg",
  "assets/pog/principal.jpeg",
  "assets/pog/vice principal.jpeg",
  "assets/pog/secretary.jpeg",
  "assets/pog/administrative chief.jpeg"
];

const srtLines = srtBlocks.map((block, index) => {
  const lines = block.split(/\r?\n/);
  if (lines.length < 3) return null;
  const id = parseInt(lines[0], 10);
  const timeRange = lines[1];
  const originalLines = lines.slice(2).map(l => l.trim()).filter(Boolean);
  
  const [startStr, endStr] = timeRange.split('-->');
  const startTime = parseSrtTime(startStr);
  const endTime = parseSrtTime(endStr);
  
  return { id, startTime, endTime, originalLines };
}).filter(Boolean);

let globalWordIdx = 0;
const slides = srtLines.map((srt, idx) => {
  // Find words for this segment
  const segmentWords = allWords.filter(w => {
    return w.start_time >= srt.startTime - 0.5 && w.start_time <= srt.endTime + 0.5;
  });

  // Map words sequentially into the lines structure of the SRT
  const slideLines = srt.originalLines.map(lineText => {
    // Split the line into word tokens
    const lineWords = lineText.split(/\s+/).filter(w => w.trim());
    return lineWords.map(wordText => {
      const matchedWord = segmentWords[globalWordIdx++];
      return {
        text: wordText,
        // Fallbacks if indices run out
        relStart: matchedWord ? Math.max(0, matchedWord.start_time - srt.startTime) : 0,
        relEnd: matchedWord ? Math.max(0, matchedWord.end_time - srt.startTime) : (srt.endTime - srt.startTime)
      };
    });
  });

  // Reset local segment word counter for the next slide's mapping
  globalWordIdx = 0;

  // Main slides are text-only with no images
  return {
    id: `slide_${srt.id}`,
    folder: `slide_${srt.id}`,
    media: null,
    mediaType: null,
    heading: `School Anthem - Verse ${srt.id}`,
    content: srt.originalLines.join(' '), // Fallback plain content
    startTime: srt.startTime,
    endTime: srt.endTime,
    durationInSeconds: srt.endTime - srt.startTime,
    mediaStartFromInSeconds: 0,
    layout: "text-only",
    transition: "fade",
    lines: slideLines
  };
});

// Configure the JSON structure
const newConfig = {
  "video": {
    "width": 1920,
    "height": 1080,
    "fps": 30,
    "maxCharactersPerSlide": 750,
    "themeName": "neon-emerald",
    "theme": {},
    "fontFamily": "outfit",
    "fontWeight": "600",
    "progressBar": {
      "show": true,
      "position": "bottom",
      "color": "",
      "height": 8
    }
  },
  "audio": {
    "musicPath": "assets/pog/School Anthem_01.wav",
    "volume": 1.0,
    "loop": false,
    "fadeInInSeconds": 0.5,
    "fadeOutInSeconds": 1.0
  },
  "branding": {
    "showLogo": true,
    "logoPath": "",
    "logoText": "PEARLS OF GOD",
    "position": "top-left",
    "size": 50,
    "opacity": 0.9,
    "persistent": true,
    "authorName": "Pearls Of God School",
    "badgeText": "ANTHEM"
  },
  "titlePage": {
    "show": true,
    "style": "glassmorphic-media",
    "title": "Official School Anthem",
    "subtitle": "Lyrics by ~~Mr. Arnab Chatterjee~~  \nVice Principal, Pearls Of God",
    "media": "assets/pog/vice principal.jpeg",
    "mediaType": "image",
    "durationInSeconds": 13,
    "theme": {
      "background": "linear-gradient(135deg, #062016 0%, #020a07 100%)",
      "textColor": "#ecfdf5",
      "subtitleColor": "#a7f3d0"
    }
  },
  "slides": slides,
  "endPage": {
    "show": true,
    "style": "glassmorphic",
    "title": "Pearls of God",
    "subtitle": "An English Medium Co-ed School  \nDebaipukur Hindmotor, ICSE/ISC  \n~~Admission Open~~",
    "contact": "Contact: pearlsofgod@yahoo.com",
    "website": "pearlsofgod.in",
    "startTime": 186.0,
    "durationInSeconds": 8.832,
    "theme": {
      "background": "linear-gradient(135deg, #062016 0%, #020a07 100%)",
      "textColor": "#ecfdf5",
      "subtitleColor": "#a7f3d0"
    }
  }
};

fs.writeFileSync('D:/GITHUB/BalerKaj/config.json', JSON.stringify(newConfig, null, 2), 'utf8');
console.log('Successfully generated D:/GITHUB/BalerKaj/config.json!');

// Configure the Reels JSON structure (1080x1920, ends at 2:12, radiant-gold theme)
const reelsConfig = {
  ...newConfig,
  "video": {
    ...newConfig.video,
    "width": 1080,
    "height": 1920,
    "themeName": "radiant-gold"
  },
  "audio": {
    ...newConfig.audio,
    "fadeOutInSeconds": 3.0 // Smooth fade out over 3 seconds as the short ends
  },
  "slides": slides.filter(slide => slide.startTime < 132.0),
  "endPage": {
    ...newConfig.endPage,
    "startTime": 116.356,
    "durationInSeconds": 15.644, // ends at exactly 132.0s (2:12)
    "theme": {
      "background": "linear-gradient(135deg, #1A150E 0%, #0c0905 100%)",
      "textColor": "#FFFAF0",
      "subtitleColor": "#FB923C"
    }
  },
  "titlePage": {
    ...newConfig.titlePage,
    "theme": {
      "background": "linear-gradient(135deg, #1A150E 0%, #0c0905 100%)",
      "textColor": "#FFFAF0",
      "subtitleColor": "#FB923C"
    }
  }
};

fs.writeFileSync('D:/GITHUB/BalerKaj/config-reels.json', JSON.stringify(reelsConfig, null, 2), 'utf8');
console.log('Successfully generated D:/GITHUB/BalerKaj/config-reels.json!');
