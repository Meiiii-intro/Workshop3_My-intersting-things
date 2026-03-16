let travelData = [];
let foodImages = {}; 
let selectedData = null; 


let typeColors = {
  'Steak': '#c14953',
  'Western': '#84a59d',
  'Asian': '#e07a5f',
  'Noodles': '#f2cc8f',
  'Sushi': '#3d5a80',
  'Curry': '#f4a261',
  'Salad': '#81b29a',
  'Dessert': '#e5989b',
  'Pasta': '#f6bd60',
  'StreetFood': '#9c6644',
  'Seafood': '#0077b6',
  'FastFood': '#ffb703', 
  'DEFAULT': '#cccccc'  
};

let dataDots = [];

function preload() {
  travelData = loadJSON('data.json', function(data) {
    let dataArray = Object.values(data);
    for (let i = 0; i < dataArray.length; i++) {
      let item = dataArray[i];

      foodImages[item.name] = loadImage('Images/' + item.name);
      
      let interest = item.interestScore || 5; 

      let size = map(interest, 1, 10, 10, 45); 
      
      dataDots.push({
        x: 0, 
        y: 0,
        size: size,
        originalData: item,
        noiseX: random(1000), 
        noiseY: random(1000)
      });
    }
  });
}

function setup() {

  createCanvas(windowWidth, windowHeight);
  

  for(let dot of dataDots) {
    dot.x = random(80, width - 80);
    dot.y = random(80, height - 80);
  }
}

function draw() {

  background(244, 241, 235); 

  if (selectedData !== null) {
    drawFoodPhoto();
  } else {
    updateDots();
    drawConnections(); 
    drawDots();
    drawLegend();
  }
}

function updateDots() {
  for (let dot of dataDots) {
    let moveSpeed = 0.0005;
    dot.x += (noise(dot.noiseX) - 0.5) * 0.8; 
    dot.y += (noise(dot.noiseY) - 0.5) * 0.8; 
    dot.noiseX += moveSpeed;
    dot.noiseY += moveSpeed;
    
    
    if(dot.x < 50) dot.x = 50;
    if(dot.x > width - 50) dot.x = width - 50;
    if(dot.y < 50) dot.y = 50;
    if(dot.y > height - 50) dot.y = height - 50;
  }
}

function drawConnections() {
  noFill();
  stroke(30, 30, 30, 40);
  strokeWeight(0.8);
  
  beginShape();
  for (let i = 0; i < dataDots.length; i++) {
    curveVertex(dataDots[i].x, dataDots[i].y);
    if (i === 0 || i === dataDots.length - 1) {
      curveVertex(dataDots[i].x, dataDots[i].y);
    }
  }
  endShape();
}

function drawDots() {
  for (let dot of dataDots) {
    let type = dot.originalData.type;
    let baseColor = color(typeColors[type] || typeColors['DEFAULT']);
    
    noStroke();
    
    
    baseColor.setAlpha(30);
    fill(baseColor);
    ellipse(dot.x, dot.y, dot.size * 1.6);
    
    
    baseColor.setAlpha(150);
    fill(baseColor);
    ellipse(dot.x, dot.y, dot.size);
    

    fill(40, 40, 40, 220);
    ellipse(dot.x, dot.y, dot.size * 0.2);
  }
}

function drawLegend() {
  fill(80, 80, 80, 180); 
  textAlign(RIGHT, BOTTOM); 
  noStroke();
  textStyle(NORMAL);
  

  textSize(16); 
  
  text("Different Color = Food Type", width - 30, height - 55);
  
  text("Larger Circle = Higher Interest", width - 30, height - 30);
}

function mousePressed() {
  if (selectedData !== null) {
    selectedData = null; 
    return;
  }
  
  for (let dot of dataDots) {
    let d = dist(mouseX, mouseY, dot.x, dot.y);

    if (d < dot.size) { 
      selectedData = dot.originalData;
      break;
    }
  }
}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function drawFoodPhoto() {

  background(244, 241, 235, 230); 
  
  let currentImage = foodImages[selectedData.name];
  
  if (currentImage) {
    imageMode(CENTER);
    let maxImgWidth = width - 200;
    let maxImgHeight = height - 250;
    
    let scaleFactor = min(maxImgWidth / currentImage.width, maxImgHeight / currentImage.height);
    let drawW = currentImage.width * scaleFactor;
    let drawH = currentImage.height * scaleFactor;
    
    rectMode(CENTER);
    noStroke();
    

    fill(0, 0, 0, 20);
    rect(width/2 + 5, height/2 - 35, drawW + 30, drawH + 30, 5);
    

    fill(255);
    rect(width/2, height/2 - 40, drawW + 30, drawH + 30, 2); 
    

    image(currentImage, width/2, height/2 - 40, drawW, drawH);
    imageMode(CORNER); 
    rectMode(CORNER);
  } else {
    fill(50); textAlign(CENTER, CENTER); textSize(24);
    text("Loading image...", width/2, height/2 - 20);
  }
  

  textSize(22); fill(50); textAlign(CENTER, CENTER);
  text(selectedData.type + " Cuisine", width/2, height - 100);
  
  textSize(16); fill(100);
  text("Interest Score: " + selectedData.interestScore + " / 10", width/2, height - 70);
  
  textSize(14); fill(150);

  text("File: " + selectedData.name.replace('IMG_', '').replace('.jpeg', ''), width/2, height - 45);
  
  textSize(12); fill(180);
  text("(Click anywhere to return to the map)", width/2, height - 20);
}