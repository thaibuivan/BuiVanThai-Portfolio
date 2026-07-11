import fs from 'fs';
import path from 'path';
import https from 'https';

const ASSETS = [
  { url: 'https://homeseeker.vn/favicon.ico', dest: 'public/seo/favicon.ico' },
  { url: 'https://homeseeker.vn/assets/images/logo.png', dest: 'public/images/logo.png' }
];

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const dir = path.dirname(dest);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function main() {
  for (const asset of ASSETS) {
    try {
      console.log(`Downloading ${asset.url}...`);
      await download(asset.url, asset.dest);
      console.log(`Saved to ${asset.dest}`);
    } catch (err) {
      console.error(`Failed to download ${asset.url}:`, err);
    }
  }
}

main();
