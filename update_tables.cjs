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
    let updated = content
      .replace(/className="([^"]*)hover:bg-gray-50\/50([^"]*)"/g, 'className="$1group hover:bg-[#F8FAFC] transition-colors duration-200$2"')
      .replace(/className="([^"]*)hover:bg-gray-50([^"]*)"/g, 'className="$1group hover:bg-[#F8FAFC] transition-colors duration-200$2"');
    
    updated = updated.replace(
      /<td className="px-6 py-4 text-right([^"]*)">/g, 
      '<td className="px-6 py-4 text-right$1 opacity-80 group-hover:opacity-100 transition-opacity duration-200">'
    );
    
    if (content !== updated) {
      fs.writeFileSync(file, updated);
      console.log('Updated', file);
    }
  }
});
