const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.tsx')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('src');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('alert(')) {
    // Add import if not exists
    if (!content.includes("import { showToast } from")) {
      // figure out relative path to src/components/common/Toast
      const depth = file.split('/').length - 2;
      const prefix = depth === 0 ? './' : '../'.repeat(depth);
      const importStmt = `import { showToast } from '${prefix}components/common/Toast';\n`;
      content = importStmt + content;
    }

    // replace `alert(err.message || 'some error');` with `showToast(err.message || 'some error', 'error');`
    content = content.replace(/alert\((.*?err\.message.*?)\)/g, 'showToast($1, \'error\')');
    
    // replace other alerts with success toasts
    content = content.replace(/alert\((.*)\)/g, 'showToast($1, \'success\')');

    fs.writeFileSync(file, content);
    console.log('Replaced alerts in', file);
  }
});
