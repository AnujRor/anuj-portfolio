const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, 'public', 'assets');
const files = fs.readdirSync(assetsDir);

async function convertSvgToWebp() {
  for (const file of files) {
    if (file.endsWith('.svg')) {
      const inputPath = path.join(assetsDir, file);
      const outputPath = path.join(assetsDir, file.replace('.svg', '.webp'));
      
      try {
        await sharp(inputPath, { density: 300 })
          .webp({ quality: 80, effort: 6 })
          .toFile(outputPath);
        
        console.log(`Converted: ${file} -> ${file.replace('.svg', '.webp')}`);
        
        // Delete original SVG after successful conversion
        fs.unlinkSync(inputPath);
        console.log(`Deleted: ${file}`);
      } catch (err) {
        console.error(`Failed to convert ${file}:`, err.message);
      }
    }
  }
  console.log('All SVG to WebP conversions complete!');
}

convertSvgToWebp().catch(console.error);