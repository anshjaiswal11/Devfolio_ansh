const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'src/pages/client');

const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));

files.forEach(f => {
  const p = path.join(dir, f);
  let content = fs.readFileSync(p, 'utf8');
  
  if (content.includes('ðŸ')) {
    // Convert back from ISO-8859-1 (Latin1) bytes incorrectly read as UTF8 string
    const buf = Buffer.from(content, 'latin1');
    content = buf.toString('utf8');
    fs.writeFileSync(p, content, 'utf8');
    console.log('Fixed', f);
  }
});
