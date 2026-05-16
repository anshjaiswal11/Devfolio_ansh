const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'src/pages/client');

const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx') && f !== 'ClientLayout.jsx' && f !== 'ClientDashboard.jsx' && f !== 'ClientProgress.jsx');

files.forEach(f => {
  const p = path.join(dir, f);
  let content = fs.readFileSync(p, 'utf8');
  
  content = content.replace(/style=\{\{\s*padding:\s*'32px 36px',\s*minHeight:\s*'100vh',\s*background:\s*'#0d0d14',\s*fontFamily:\s*"'Inter',sans-serif"\s*\}\}/g, 'className="client-page-container"');
  content = content.replace(/style=\{P\}/g, 'className="client-page-container"');
  content = content.replace(/style=\{S\.page\}/g, 'className="client-page-container"');
  content = content.replace(/const P = \{\s*padding:'32px 36px',\s*minHeight:'100vh',\s*background:'#0d0d14',\s*fontFamily:"'Inter',sans-serif"\s*\}/g, '');
  content = content.replace(/const P = \{\s*padding:\s*'32px 36px',\s*minHeight:\s*'100vh',\s*background:\s*'#0d0d14',\s*fontFamily:\s*"'Inter',sans-serif"\s*\}/g, '');
  content = content.replace(/page:\s*\{\s*padding:\s*'32px 36px',\s*minHeight:\s*'100vh',\s*background:\s*'#0d0d14',\s*fontFamily:\s*"'Inter',sans-serif"\s*\},?/g, '');
  
  fs.writeFileSync(p, content, 'utf8');
});
console.log('Padding classes injected safely!');
