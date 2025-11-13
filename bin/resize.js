#!/usr/bin/env node

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const { program } = require('commander');

program
  .name('resize')
  .description('Resize images and convert them to WebP format')
  .version('1.0.0')
  .argument('<image>', 'Input image file path')
  .option('-o, --output <path>', 'Output directory or file path')
  .option('-w, --width <number>', 'Target width in pixels', parseInt)
  .option('-h, --height <number>', 'Target height in pixels', parseInt)
  .option('-q, --quality <number>', 'WebP quality (1-100)', parseInt, 80)
  .action(async (imagePath, options) => {
    try {
      // Check if input file exists
      if (!fs.existsSync(imagePath)) {
        console.error(`Error: Input file "${imagePath}" not found.`);
        process.exit(1);
      }

      // Get file info
      const inputPath = path.resolve(imagePath);
      const inputDir = path.dirname(inputPath);
      const inputName = path.basename(inputPath, path.extname(inputPath));
      const inputExt = path.extname(imagePath).toLowerCase();

      // Determine output path
      let outputPath;
      if (options.output) {
        const outputStat = fs.statSync(options.output).catch(() => null);
        
        // If output is a directory
        if (fs.existsSync(options.output) && fs.statSync(options.output).isDirectory()) {
          outputPath = path.join(options.output, `${inputName}.webp`);
        } else {
          // If output is a file path
          const outputDir = path.dirname(options.output);
          if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
          }
          outputPath = options.output.endsWith('.webp') 
            ? options.output 
            : `${options.output}.webp`;
        }
      } else {
        // Default: same directory with new name
        outputPath = path.join(inputDir, `${inputName}.webp`);
      }

      // Resolve absolute path
      outputPath = path.resolve(outputPath);

      console.log(`Processing: ${inputPath}`);
      console.log(`Output: ${outputPath}`);

      // Create sharp instance
      let sharpInstance = sharp(inputPath);

      // Apply resize if dimensions specified
      if (options.width || options.height) {
        const resizeOptions = {};
        if (options.width) resizeOptions.width = options.width;
        if (options.height) resizeOptions.height = options.height;
        sharpInstance = sharpInstance.resize(resizeOptions);
        console.log(`Resizing to: ${options.width || 'auto'}x${options.height || 'auto'}`);
      } else {
        // Default: reduce size by 50% if no dimensions specified
        const metadata = await sharp(inputPath).metadata();
        const newWidth = Math.floor(metadata.width * 0.5);
        const newHeight = Math.floor(metadata.height * 0.5);
        sharpInstance = sharpInstance.resize(newWidth, newHeight);
        console.log(`Resizing to: ${newWidth}x${newHeight} (50% reduction)`);
      }

      // Convert to WebP and save
      await sharpInstance
        .webp({ quality: options.quality })
        .toFile(outputPath);

      console.log(`✓ Successfully converted to WebP: ${outputPath}`);
      
      // Show file size comparison
      const inputSize = fs.statSync(inputPath).size;
      const outputSize = fs.statSync(outputPath).size;
      const reduction = ((1 - outputSize / inputSize) * 100).toFixed(1);
      console.log(`File size: ${(inputSize / 1024).toFixed(2)} KB → ${(outputSize / 1024).toFixed(2)} KB (${reduction}% reduction)`);

    } catch (error) {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    }
  });

program.parse();
