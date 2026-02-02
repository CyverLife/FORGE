const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'assets/images/badges');

function getFiles(dir, files = []) {
    const fileList = fs.readdirSync(dir);
    for (const file of fileList) {
        const name = `${dir}/${file}`;
        if (fs.statSync(name).isDirectory()) {
            getFiles(name, files);
        } else {
            files.push(name);
        }
    }
    return files;
}

try {
    const files = getFiles(dir);
    console.log(JSON.stringify(files.map(f => path.relative(__dirname, f)), null, 2));
} catch (e) {
    console.error(e);
}
