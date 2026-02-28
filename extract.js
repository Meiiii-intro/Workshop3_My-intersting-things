const fs = require('fs');
const path = require('path');
const parser = require('exif-parser');

// 1. Set the image folder path
const imageDir = path.join(__dirname, 'Images');

// Read all files in the folder
const allFiles = fs.readdirSync(imageDir);
const dataPoints = [];

console.log("Starting to extract photo data...");

// 2. Loop through each file
allFiles.forEach(fileName => {
    // Only process .jpg or .jpeg images
    if (fileName.toLowerCase().endsWith('.jpg') || fileName.toLowerCase().endsWith('.jpeg')) {
        const filePath = path.join(imageDir, fileName);
        
        try {
            // Read the file and parse EXIF data
            const buffer = fs.readFileSync(filePath);
            const result = parser.create(buffer).parse();
            
            // Check if GPS data exists
            if (result.tags && result.tags.GPSLatitude && result.tags.GPSLongitude) {
                dataPoints.push({
                    lat: result.tags.GPSLatitude,
                    lng: result.tags.GPSLongitude,
                    time: result.tags.DateTimeOriginal || 0,
                    name: fileName
                });
            }
        } catch (error) {
            console.log("Could not read photo:", fileName);
        }
    }
});

// 3. Sort by time (oldest to newest)
dataPoints.sort((a, b) => a.time - b.time);

// 4. Save the data to data.json
fs.writeFileSync('data.json', JSON.stringify(dataPoints, null, 2));

console.log("Done! Successfully extracted GPS data from " + dataPoints.length + " photos.");