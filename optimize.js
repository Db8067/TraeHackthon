import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

// CONFIGURATION
const inputFolder = './public/io2'; // Your source folder
const outputFolder = './public/io2_opt'; // Output folder
const targetWidth = 1920; // 1080p resolution

if (!fs.existsSync(outputFolder)){
    fs.mkdirSync(outputFolder);
}

fs.readdir(inputFolder, (err, files) => {
    if (err) throw err;

    files.forEach(file => {
        const inputPath = path.join(inputFolder, file);
        const outputPath = path.join(outputFolder, file.replace(path.extname(file), '.webp'));

        // Only process image files
        if (file.match(/\.(jpg|jpeg|png|webp)$/i)) {
            sharp(inputPath)
                .resize({ width: targetWidth }) // Resize width to 1920px (auto height)
                .webp({ quality: 80 }) // Convert to WebP with 80% quality
                .toFile(outputPath)
                .then(() => {
                    console.log(`Optimized: ${file}`);
                })
                .catch(err => {
                    console.error(`Error processing ${file}:`, err);
                });
        }
    });
});