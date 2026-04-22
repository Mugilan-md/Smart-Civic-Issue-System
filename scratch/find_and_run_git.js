const fs = require('fs');
const { execSync } = require('child_process');

const commonPaths = [
  'C:\\Program Files\\Git\\bin\\git.exe',
  'C:\\Program Files (x86)\\Git\\bin\\git.exe',
  process.env.LOCALAPPDATA + '\\Programs\\Git\\bin\\git.exe'
];

let foundPath = null;
for (const path of commonPaths) {
  if (fs.existsSync(path)) {
    foundPath = path;
    break;
  }
}

if (foundPath) {
  console.log(`FOUND GIT AT: ${foundPath}`);
  try {
    console.log('Running git init...');
    execSync(`"${foundPath}" init`, { stdio: 'inherit' });
    console.log('Running git add .');
    execSync(`"${foundPath}" add .`, { stdio: 'inherit' });
    console.log('Running git commit...');
    execSync(`"${foundPath}" commit -m "Initial commit"`, { stdio: 'inherit' });
    console.log('Pushing to GitHub...');
    execSync(`"${foundPath}" remote add origin https://github.com/Mugilan-md/Smart-Civic-Issue-System.git`, { stdio: 'inherit' });
    console.log('Note: The push might fail here if it needs login, but the repo is initialized!');
  } catch (e) {
    console.error('Error during git operation:', e.message);
  }
} else {
  console.log('GIT STILL NOT FOUND in common locations.');
}
