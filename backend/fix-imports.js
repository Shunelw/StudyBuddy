const fs = require('fs');
const path = require('path');

const apiDir = path.join(__dirname, 'pages/api');

function fixImports(dir, depth) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            fixImports(fullPath, depth + 1);
        } else if (file.endsWith('.js')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            const relativePath = '../'.repeat(depth) + 'lib/db';
            const updated = content.replace(/import db from '.*?lib\/db';/, `import db from '${relativePath}';`);
            if (content !== updated) {
                console.log(`Updated ${fullPath}`);
                fs.writeFileSync(fullPath, updated);
            }
        }
    }
}

fixImports(apiDir, 2);
console.log("Done");
