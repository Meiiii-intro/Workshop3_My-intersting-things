let travelData = [];
let foodImages = {}; 
let selectedData = null; 

// 参考图风格的调色板（新增了 FastFood 等你数据里的颜色）
let typeColors = {
  'Steak': '#c14953',     // 深红
  'Western': '#84a59d',   // 灰绿
  'Asian': '#e07a5f',     // 陶土红
  'Noodles': '#f2cc8f',   // 暖黄
  'Sushi': '#3d5a80',     // 黛蓝
  'Curry': '#f4a261',     // 橘黄
  'Salad': '#81b29a',     // 草绿
  'Dessert': '#e5989b',   // 浅粉
  'Pasta': '#f6bd60',     // 麦色
  'StreetFood': '#9c6644',// 棕色
  'Seafood': '#0077b6',   // 海蓝
  'FastFood': '#ffb703',  // 明黄
  'DEFAULT': '#cccccc'    // 默认灰
};

let dataDots = [];

function preload() {
  travelData = loadJSON('data.json', function(data) {
    let dataArray = Object.values(data);
    for (let i = 0; i < dataArray.length; i++) {
      let item = dataArray[i];
      // 读取 .jpeg 格式的照片
      foodImages[item.name] = loadImage('Images/' + item.name);
      
      let interest = item.interestScore || 5; 
      // 52个点需要缩小一点体积，防止画面太拥挤
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
  // 铺满整个浏览器窗口
  createCanvas(windowWidth, windowHeight);
  
  // 随机打散这52个点
  for(let dot of dataDots) {
    dot.x = random(80, width - 80);
    dot.y = random(80, height - 80);
  }
}

function draw() {
  // 米白色的画纸背景
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
    let moveSpeed = 0.0005; // 像呼吸一样极其缓慢的浮动
    dot.x += (noise(dot.noiseX) - 0.5) * 0.8; 
    dot.y += (noise(dot.noiseY) - 0.5) * 0.8; 
    dot.noiseX += moveSpeed;
    dot.noiseY += moveSpeed;
    
    // 把点温柔地限制在画布内，不要飘走
    if(dot.x < 50) dot.x = 50;
    if(dot.x > width - 50) dot.x = width - 50;
    if(dot.y < 50) dot.y = 50;
    if(dot.y > height - 50) dot.y = height - 50;
  }
}

function drawConnections() {
  noFill();
  stroke(30, 30, 30, 40); // 灰色的纤细蛛丝连线
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
    
    // 最外层：极淡的水彩晕染圈
    baseColor.setAlpha(30);
    fill(baseColor);
    ellipse(dot.x, dot.y, dot.size * 1.6);
    
    // 中间层：主色调圈
    baseColor.setAlpha(150);
    fill(baseColor);
    ellipse(dot.x, dot.y, dot.size);
    
    // 核心层：像墨滴一样的深色圆心
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
    // 稍微放大一点点击判定的区域，更容易点中
    if (d < dot.size) { 
      selectedData = dot.originalData;
      break;
    }
  }
}

// 当浏览器窗口大小改变时，自动适应
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function drawFoodPhoto() {
  // 磨砂玻璃质感的半透明背景
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
    
    // 1. 绘制淡淡的阴影
    fill(0, 0, 0, 20);
    rect(width/2 + 5, height/2 - 35, drawW + 30, drawH + 30, 5);
    
    // 2. 绘制白色相纸边框
    fill(255);
    rect(width/2, height/2 - 40, drawW + 30, drawH + 30, 2); 
    
    // 3. 绘制照片
    image(currentImage, width/2, height/2 - 40, drawW, drawH);
    imageMode(CORNER); 
    rectMode(CORNER);
  } else {
    fill(50); textAlign(CENTER, CENTER); textSize(24);
    text("Loading image...", width/2, height/2 - 20);
  }
  
  // 文字排版更具设计感
  textSize(22); fill(50); textAlign(CENTER, CENTER);
  text(selectedData.type + " Cuisine", width/2, height - 100);
  
  textSize(16); fill(100);
  text("Interest Score: " + selectedData.interestScore + " / 10", width/2, height - 70);
  
  textSize(14); fill(150);
  // 完美过滤掉 .jpeg，让界面干干净净
  text("File: " + selectedData.name.replace('IMG_', '').replace('.jpeg', ''), width/2, height - 45);
  
  textSize(12); fill(180);
  text("(Click anywhere to return to the map)", width/2, height - 20);
}