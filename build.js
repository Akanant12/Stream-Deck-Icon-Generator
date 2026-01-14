import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dist = path.join(__dirname, 'dist');
const assetsDir = path.join(dist, 'assets');

// Clean dist folder
if (fs.existsSync(dist)) {
  fs.rmSync(dist, { recursive: true });
}

// Create dist structure
fs.mkdirSync(dist, { recursive: true });
fs.mkdirSync(path.join(assetsDir, 'styles'), { recursive: true });
fs.mkdirSync(path.join(assetsDir, 'js'), { recursive: true });
fs.mkdirSync(path.join(assetsDir, 'icons', 'fontawesome'), { recursive: true });

// Copy HTML
let html = fs.readFileSync('index.html', 'utf8');
// Update paths in HTML
html = html.replace(/\.\/src\/styles\//g, './assets/styles/');
html = html.replace(/\.\/src\/js\//g, './assets/js/');
fs.writeFileSync(path.join(dist, 'index.html'), html);

// Copy CSS
fs.copyFileSync('src/styles/base.css', path.join(assetsDir, 'styles', 'base.css'));
fs.copyFileSync('src/styles/modal.css', path.join(assetsDir, 'styles', 'modal.css'));

// Copy JS files
const jsFiles = ['app.js', 'export.js', 'gradient.js', 'icons.js', 'keyboard.js', 'presets.js', 'state.js', 'storage.js', 'ui.js'];
jsFiles.forEach(file => {
  let content = fs.readFileSync(path.join('src/js', file), 'utf8');
  // Update icon path in icons.js
  if (file === 'icons.js') {
    content = content.replace('./public/icons/fontawesome', './assets/icons/fontawesome');
  }
  fs.writeFileSync(path.join(assetsDir, 'js', file), content);
});

// Copy icons
const iconFiles = fs.readdirSync('public/icons/fontawesome');
iconFiles.forEach(file => {
  fs.copyFileSync(
    path.join('public/icons/fontawesome', file),
    path.join(assetsDir, 'icons', 'fontawesome', file)
  );
});

console.log('✓ Build complete! Output in dist/');
