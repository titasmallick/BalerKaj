import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const themeGradients = {
  "neon-emerald": { bg: "linear-gradient(135deg, #062016 0%, #020a07 100%)", text: "#ecfdf5", sub: "#a7f3d0" },
  "electric-amethyst": { bg: "linear-gradient(135deg, #1e0e30 0%, #0b0512 100%)", text: "#f5f3ff", sub: "#ddd6fe" },
  "crimson-pulse": { bg: "linear-gradient(135deg, #2d0a0a 0%, #110303 100%)", text: "#fef2f2", sub: "#fca5a5" },
  "cyber-cyan": { bg: "linear-gradient(135deg, #081e26 0%, #030a0d 100%)", text: "#ecfeff", sub: "#7dd3fc" },
  "midnight-magenta": { bg: "linear-gradient(135deg, #2e0821 0%, #11030c 100%)", text: "#fdf4ff", sub: "#f5d0fe" },
  "arctic-blue": { bg: "linear-gradient(135deg, #0e1b2d 0%, #050a11 100%)", text: "#eff6ff", sub: "#93c5fd" },
  "volcanic-orange": { bg: "linear-gradient(135deg, #2d1509 0%, #110803 100%)", text: "#fff7ed", sub: "#fdba74" },
  "slate-silver": { bg: "linear-gradient(135deg, #1e293b 0%, #0f141d 100%)", text: "#f8fafc", sub: "#94a3b8" },
  "royal-indigo": { bg: "linear-gradient(135deg, #1e1b4b 0%, #0a091a 100%)", text: "#eef2ff", sub: "#a5b4fc" },
  "radiant-gold": { bg: "linear-gradient(135deg, #1a150e 0%, #090705 100%)", text: "#fffaf0", sub: "#fb923c" }
};

async function run() {
  const args = process.argv.slice(2);
  const theme = args[0] || 'neon-emerald';
  
  if (!themeGradients[theme]) {
    console.error(`Unknown theme: ${theme}. Available themes: ${Object.keys(themeGradients).join(', ')}`);
    process.exit(1);
  }

  const configPath = path.join(projectRoot, 'config.json');
  if (!fs.existsSync(configPath)) {
    console.error(`config.json not found at ${configPath}`);
    process.exit(1);
  }
  
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

  // Update theme name
  config.video.themeName = theme;

  // Update title page and end page themes to match the new theme gradients
  const grads = themeGradients[theme];
  config.titlePage.theme.background = grads.bg;
  config.titlePage.theme.textColor = grads.text;
  config.titlePage.theme.subtitleColor = grads.sub;

  config.endPage.theme.background = grads.bg;
  config.endPage.theme.textColor = grads.text;
  config.endPage.theme.subtitleColor = grads.sub;

  // Write temporary config
  const tempConfigPath = path.join(projectRoot, `config_${theme}.json`);
  fs.writeFileSync(tempConfigPath, JSON.stringify(config, null, 2));

  const npxCmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';
  const entryPoint = path.join(projectRoot, 'src', 'index.ts');
  const outDir = path.join(projectRoot, 'out');
  const outputPath = path.join(outDir, `output_${theme}.mp4`);

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  console.log(`\n--- STARTING VIDEO RENDER FOR THEME: ${theme} ---`);
  
  const backupConfigPath = path.join(projectRoot, 'config_backup.json');
  
  // Safely swap configuration files
  fs.renameSync(configPath, backupConfigPath);
  fs.renameSync(tempConfigPath, configPath);

  const cmdArgs = [
    'remotion', 'render', 
    'MainVideo', 
    `"${outputPath}"`, 
    `--entry-point="${entryPoint}"`, 
    '--overwrite'
  ];

  console.log(`Running: ${npxCmd} ${cmdArgs.join(' ')}`);
  const renderProcess = spawn(npxCmd, cmdArgs, { shell: true, cwd: projectRoot });

  renderProcess.stdout.on('data', data => process.stdout.write(data.toString()));
  renderProcess.stderr.on('data', data => process.stderr.write(data.toString()));

  return new Promise((resolve, reject) => {
    renderProcess.on('close', (code) => {
      // Restore original config.json
      if (fs.existsSync(configPath)) {
        fs.unlinkSync(configPath);
      }
      fs.renameSync(backupConfigPath, configPath);

      if (code === 0) {
        console.log(`\n🎉 Success! Rendered theme video saved to: ${outputPath}`);
        resolve(outputPath);
      } else {
        console.error(`\n❌ Render failed with exit code: ${code}`);
        reject(new Error(`Exit code ${code}`));
      }
    });
  });
}

run().catch(console.error);
