import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

function toHanoi(filePath) {
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Replacements
  content = content.replace(/TP\.HCM/g, 'Hà Nội');
  content = content.replace(/Hồ Chí Minh/g, 'Hà Nội');
  content = content.replace(/Quận 1,/g, 'Hai Bà Trưng,');
  content = content.replace(/Quận 2,/g, 'Nam Từ Liêm,');
  content = content.replace(/Quận 7/g, 'Đống Đa');
  content = content.replace(/quận 7/g, 'Đống Đa');
  content = content.replace(/Bình Thạnh/g, 'Cầu Giấy');
  content = content.replace(/123 Đường D2 \(Nguyễn Gia Trí\), Phường 25/g, '123 Đường Xuân Thủy, Phường Dịch Vọng Hậu');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

walkDir('./src', toHanoi);
