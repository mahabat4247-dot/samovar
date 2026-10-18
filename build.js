const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist');

// Clear / recreate dist directory
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

// Copy static files into dist
const filesToCopy = ['index.html', 'styles.css', 'script.js'];

filesToCopy.forEach((file) => {
  const src = path.join(__dirname, file);
  const dest = path.join(distDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`Copied ${file} -> dist/${file}`);
  } else {
    console.warn(`Warning: ${file} not found`);
  }
});

console.log('Build completed successfully!');
