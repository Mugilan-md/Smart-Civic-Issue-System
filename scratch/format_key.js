const fs = require('fs');
try {
    const key = JSON.parse(fs.readFileSync('c:/Users/acer/OneDrive - ELCOT/ANTIGRAvITY/project 1/backend/serviceAccountKey.json', 'utf8'));
    process.stdout.write(JSON.stringify(key));
} catch (e) {
    console.error(e);
}
