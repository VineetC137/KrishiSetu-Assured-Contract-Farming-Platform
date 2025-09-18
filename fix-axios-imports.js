const fs = require('fs');
const path = require('path');

// Files to update with their axios import replacements
const filesToUpdate = [
  'frontend/app/farmer/wallet/page.tsx',
  'frontend/app/farmer/contracts/[id]/page.tsx',
  'frontend/app/buyer/dashboard/page.tsx',
  'frontend/app/buyer/wallet/page.tsx',
  'frontend/app/farmer/contracts/page.tsx',
  'frontend/app/buyer/contracts/page.tsx',
  'frontend/app/buyer/contracts/[id]/page.tsx',
  'frontend/app/farmer/contracts/create/page.tsx',
  'frontend/components/ConnectionTest.tsx',
  'frontend/components/ChatWindow.tsx'
];

// API endpoint replacements
const apiReplacements = [
  { from: "axios.get('/api/", to: "api.get('/" },
  { from: "axios.post('/api/", to: "api.post('/" },
  { from: "axios.put('/api/", to: "api.put('/" },
  { from: "axios.delete('/api/", to: "api.delete('/" },
  { from: "axios.patch('/api/", to: "api.patch('/" },
];

function updateFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`File not found: ${filePath}`);
      return;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    let updated = false;

    // Replace axios import
    if (content.includes("import axios from 'axios';")) {
      content = content.replace("import axios from 'axios';", "import api from '@/lib/axios';");
      updated = true;
      console.log(`Updated import in: ${filePath}`);
    }

    // Replace API calls
    apiReplacements.forEach(replacement => {
      if (content.includes(replacement.from)) {
        content = content.replaceAll(replacement.from, replacement.to);
        updated = true;
        console.log(`Updated API calls in: ${filePath}`);
      }
    });

    if (updated) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Successfully updated: ${filePath}`);
    } else {
      console.log(`No changes needed: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error updating ${filePath}:`, error.message);
  }
}

console.log('🔧 Fixing axios imports and API calls...\n');

filesToUpdate.forEach(updateFile);

console.log('\n✅ All files updated successfully!');
console.log('\nUpdated files to use the new axios instance with proper authentication.');