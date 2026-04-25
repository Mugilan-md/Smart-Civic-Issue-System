const { execSync } = require('child_process');

try {
  console.log('Renaming branch to main...');
  execSync('git branch -M main', { stdio: 'inherit' });
  
  console.log('Adding remote origin...');
  try {
    execSync('git remote add origin https://github.com/Mugilan-md/Smart-Civic-Issue-System.git', { stdio: 'inherit' });
  } catch (e) {
    console.log('Remote might already exist or error adding it:', e.message);
  }

  console.log('Attempting push to main...');
  console.log('IMPORTANT: If this hangs, it might be waiting for authentication. Please check your terminal or GitHub Desktop.');
  execSync('git push -u origin main', { stdio: 'inherit' });
  
  console.log('Push complete!');
} catch (error) {
  console.error('Error during git operations:', error.message);
}
