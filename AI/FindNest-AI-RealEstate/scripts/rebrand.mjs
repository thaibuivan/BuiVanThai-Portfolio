import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

function rebrandFile(filePath) {
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts') && !filePath.endsWith('.css')) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Text replacements
  content = content.replace(/Homeseeker/g, 'FindNest AI');
  content = content.replace(/homeseeker/g, 'findnest');

  // Tailwind Color Replacements
  content = content.replace(/orange-500/g, 'blue-600');
  content = content.replace(/orange-600/g, 'blue-700');
  content = content.replace(/orange-700/g, 'blue-800');
  content = content.replace(/orange-100/g, 'blue-100');
  content = content.replace(/orange-50/g, 'blue-50');
  content = content.replace(/bg-orange/g, 'bg-blue');
  content = content.replace(/text-orange/g, 'text-blue');
  content = content.replace(/border-orange/g, 'border-blue');
  content = content.replace(/ring-orange/g, 'ring-blue');

  // Shadow Replacement (from orange to blue)
  content = content.replace(/rgba\(249,115,22,0\.3\)/g, 'rgba(29,78,216,0.3)');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

walkDir('./src', rebrandFile);
