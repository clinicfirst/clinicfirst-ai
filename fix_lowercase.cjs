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
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('src');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let updated = content;

  // Let's just fix the specific ones we found.
  
  // In src/pages/platform/PlatformClinics.tsx
  if (file.includes('PlatformClinics.tsx')) {
    updated = updated.replace(/c\.name\.toLowerCase\(\)/g, "(c.name || '').toLowerCase()");
    updated = updated.replace(/c\.city\.toLowerCase\(\)/g, "(c.city || '').toLowerCase()");
    updated = updated.replace(/c\.email\.toLowerCase\(\)/g, "(c.email || '').toLowerCase()");
  }

  // In src/pages/platform/PlatformUsers.tsx
  if (file.includes('PlatformUsers.tsx')) {
    updated = updated.replace(/u\.name\.toLowerCase\(\)/g, "(u.name || '').toLowerCase()");
    updated = updated.replace(/u\.email\.toLowerCase\(\)/g, "(u.email || '').toLowerCase()");
    updated = updated.replace(/u\.clinic_name\.toLowerCase\(\)/g, "(u.clinic_name || '').toLowerCase()");
  }

  // In src/pages/platform/PlatformAuditLogs.tsx
  if (file.includes('PlatformAuditLogs.tsx')) {
    updated = updated.replace(/l\.action\.toLowerCase\(\)/g, "(l.action || '').toLowerCase()");
    updated = updated.replace(/l\.actor_name\.toLowerCase\(\)/g, "(l.actor_name || '').toLowerCase()");
  }

  // In src/pages/clinic/ClinicAuditLogsPage.tsx
  if (file.includes('ClinicAuditLogsPage.tsx')) {
    updated = updated.replace(/l\.action\.toLowerCase\(\)/g, "(l.action || '').toLowerCase()");
    updated = updated.replace(/l\.actor_name\.toLowerCase\(\)/g, "(l.actor_name || '').toLowerCase()");
  }

  // In src/pages/clinic/CallsPage.tsx
  if (file.includes('CallsPage.tsx')) {
    updated = updated.replace(/c\.caller_phone\.toLowerCase\(\)/g, "(c.caller_phone || '').toLowerCase()");
  }

  // In src/components/platform/PlatformKnowledgeBase.tsx
  if (file.includes('PlatformKnowledgeBase.tsx')) {
    updated = updated.replace(/it\.title\.toLowerCase\(\)/g, "(it.title || '').toLowerCase()");
    updated = updated.replace(/it\.content\.toLowerCase\(\)/g, "(it.content || '').toLowerCase()");
  }
  
  if (content !== updated) {
    fs.writeFileSync(file, updated);
    console.log('Fixed', file);
  }
});
