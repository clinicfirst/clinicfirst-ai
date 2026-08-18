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

const files = walk('src/pages');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('<tr')) {
    const updated = content
      .replace(/className="([^"]*)hover:bg-gray-50\/50([^"]*)"/g, 'className="$1group hover:bg-[#F4F7FA] transition-colors duration-200$2"')
      .replace(/className="([^"]*)hover:bg-gray-50([^"]*)"/g, 'className="$1group hover:bg-[#F4F7FA] transition-colors duration-200$2"');
    
    // Also let's make buttons in the row slightly more prominent by replacing `<td className="px-6 py-4 text-right space-x-2">`
    // with `<td className="px-6 py-4 text-right space-x-2 opacity-80 group-hover:opacity-100 transition-opacity duration-200">`
    // Actually, just the opacity class on the td if it contains buttons.
    const finalUpdated = updated.replace(
      /<td className="px-6 py-4 text-right([^"]*)">/g, 
      '<td className="px-6 py-4 text-right$1 opacity-70 group-hover:opacity-100 transition-opacity duration-200">'
    );
    
    if (content !== finalUpdated) {
      fs.writeFileSync(file, finalUpdated);
      console.log('Updated', file);
    }
  }
});
