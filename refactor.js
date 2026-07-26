const fs = require('fs');
const path = require('path');

const walk = (dir, callback) => {
  fs.readdirSync(dir).forEach(file => {
    let filepath = path.join(dir, file);
    if (fs.statSync(filepath).isDirectory()) {
      walk(filepath, callback);
    } else {
      callback(filepath);
    }
  });
};

const replaceColors = (content) => {
  // Replace direct hex colors
  content = content.replace(/#0B0F1A/gi, 'var(--bg-color)');
  content = content.replace(/#111827/gi, 'var(--card-color)');
  content = content.replace(/#1f2937/gi, 'var(--surface-color)');
  content = content.replace(/#E5E7EB/gi, 'var(--text-color)');
  content = content.replace(/#94A3B8/gi, 'var(--text-secondary)');
  content = content.replace(/#CBD5E1/gi, 'var(--text-secondary)');
  content = content.replace(/#7C3AED/gi, 'var(--primary-color)');
  content = content.replace(/#3B82F6/gi, 'var(--primary-hover)');
  content = content.replace(/rgba\(255,\s*255,\s*255,\s*0.08\)/g, 'var(--border-color)');
  content = content.replace(/rgba\(255,\s*255,\s*255,\s*0.1\)/g, 'var(--border-color)');
  content = content.replace(/rgba\(255,\s*255,\s*255,\s*0.05\)/g, 'var(--surface-color)');
  
  // Replace color: white;
  content = content.replace(/color:\s*white/g, 'color: var(--text-color)');
  content = content.replace(/color:\s*#fff/gi, 'color: var(--text-color)');
  content = content.replace(/color:\s*#ffffff/gi, 'color: var(--text-color)');
  
  // Replace background: white;
  content = content.replace(/background:\s*white/g, 'background: var(--card-color)');
  content = content.replace(/background:\s*#fff;/gi, 'background: var(--card-color);');
  content = content.replace(/background:\s*#ffffff;/gi, 'background: var(--card-color);');
  content = content.replace(/background-color:\s*white/g, 'background-color: var(--card-color)');
  content = content.replace(/background-color:\s*#fff/gi, 'background-color: var(--card-color)');
  content = content.replace(/background-color:\s*#ffffff/gi, 'background-color: var(--card-color)');

  // Replace old css variables if they exist
  content = content.replace(/var\(--bg\)/g, 'var(--bg-color)');
  content = content.replace(/var\(--text\)/g, 'var(--text-color)');
  content = content.replace(/var\(--text-muted\)/g, 'var(--text-secondary)');
  content = content.replace(/var\(--border\)/g, 'var(--border-color)');
  content = content.replace(/var\(--primary1\)/g, 'var(--primary-color)');
  content = content.replace(/var\(--primary2\)/g, 'var(--primary-hover)');
  content = content.replace(/var\(--glass-bg\)/g, 'var(--card-color)');

  return content;
};

const main = () => {
  const dir = path.join(__dirname, 'src', 'app', 'pages');
  let count = 0;
  walk(dir, (filepath) => {
    if (filepath.endsWith('.css') || filepath.endsWith('.html')) {
      const original = fs.readFileSync(filepath, 'utf8');
      const updated = replaceColors(original);
      if (original !== updated) {
        fs.writeFileSync(filepath, updated, 'utf8');
        count++;
      }
    }
  });
  console.log(`Updated ${count} files.`);
};

main();
