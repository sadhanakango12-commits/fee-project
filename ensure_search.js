const fs = require('fs');
const files = fs.readdirSync('.');
let updated = 0;
const scriptTag = '\n    <script src="search.js"></script>\n';

for (const file of files) {
  if (file.endsWith('.html')) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Check if it already has the search.js script to avoid duplicates
    if (!content.includes('search.js')) {
      if (content.includes('</body>')) {
        content = content.replace('</body>', scriptTag + '</body>');
      } else {
        content += scriptTag;
      }
      fs.writeFileSync(file, content, 'utf8');
      updated++;
      console.log(`Injected into ${file}`);
    }
  }
}
console.log(`Done. Updated ${updated} files.`);
