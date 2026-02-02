const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'assets/images/badges');
const destDir = path.join(__dirname, 'assets/images');

function findImageInDir(dir) {
    if (!fs.existsSync(dir)) return null;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        if (file.match(/\.(png|jpg|jpeg|webp)$/i)) {
            return path.join(dir, file);
        }
    }
    return null;
}

const mappings = {
    'Recovery': 'badge_recovery.png',
    'Silent Streak': 'badge_silent_streak.png',
    'FOUNDER': 'badge_founder.png',
    'BETA TESTER': 'badge_beta_tester.png',
    'Architect': 'badge_architect.png',
    'STREAKS': 'badge_streak_fire.png',
    'MAESTRIAS': ['mastery_1.png', 'mastery_2.png'] // Special case, might have multiple
};

// Process simple folders
['Recovery', 'Silent Streak', 'FOUNDER', 'BETA TESTER', 'Architect', 'STREAKS'].forEach(folder => {
    const folderPath = path.join(srcDir, folder);
    const imagePath = findImageInDir(folderPath);
    if (imagePath) {
        const destPath = path.join(destDir, mappings[folder]);
        fs.copyFileSync(imagePath, destPath);
        console.log(`Copied ${folder} -> ${mappings[folder]}`);
    } else {
        console.log(`No image found in ${folder}`);
    }
});

// Process MAESTRIAS (might have multiple)
const maestriasDir = path.join(srcDir, 'MAESTRIAS');
if (fs.existsSync(maestriasDir)) {
    const files = fs.readdirSync(maestriasDir).filter(f => f.match(/\.(png|jpg|jpeg|webp)$/i));
    files.forEach((file, index) => {
        const destName = `badge_mastery_${index + 1}${path.extname(file)}`;
        fs.copyFileSync(path.join(maestriasDir, file), path.join(destDir, destName));
        console.log(`Copied Mastery ${file} -> ${destName}`);
    });
}
