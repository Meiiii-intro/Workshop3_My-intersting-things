const fs = require('fs');
const path = require('path');
const parser = require('exif-parser');


const imageDir = path.join(__dirname, 'Images');


const allFiles = fs.readdirSync(imageDir);
const dataPoints = [];

console.log("Starting to extract photo data...");


allFiles.forEach(fileName => {
    
    if (fileName.toLowerCase().endsWith('.jpg') || fileName.toLowerCase().endsWith('.jpeg')) {
        const filePath = path.join(imageDir, fileName);
        
        try {
           
            const buffer = fs.readFileSync(filePath);
            const result = parser.create(buffer).parse();
            
           
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


dataPoints.sort((a, b) => a.time - b.time);


fs.writeFileSync('data.json', JSON.stringify(dataPoints, null, 2));

console.log("Done! Successfully extracted GPS data from " + dataPoints.length + " photos.");