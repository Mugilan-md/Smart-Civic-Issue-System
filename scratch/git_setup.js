const { execSync } = require('child_process');

try {
  console.log('Attempting git init...');
  execSync('git init', { stdio: 'inherit' });
  console.log('Attempting git add .');
  execSync('git add .', { stdio: 'inherit' });
  console.log('Attempting git commit...');
  execSync('git commit -m "Initial commit from Antigravity"', { stdio: 'inherit' });
  console.log('Attempting git remote add...');
  execSync('git remote add origin https://github.com/Mugilan-md/Smart-Civic-Issue-System.git', { stdio: 'inherit' });
  console.log('Git setup complete. Note: Push might require authentication which I cannot handle.');
} catch (error) {
  console.error('Error during git operations:', error.message);
  if (error.message.includes('not recognized')) {
    console.log('GIT NOT FOUND: Please install Git from https://git-scm.com/');
  }
}
