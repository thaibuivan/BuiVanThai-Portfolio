import https from 'https';
import fs from 'fs';

https.get('https://homeseeker.vn/', (res) => {
  let data = '';
  res.on('data', chunk => { data += chunk; });
  res.on('end', () => {
    fs.writeFileSync('docs/research/page.html', data);
    console.log('Saved page.html');
  });
}).on('error', err => {
  console.error(err);
});
