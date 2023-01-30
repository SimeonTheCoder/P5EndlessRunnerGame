let playerY;
let playerX;

let gameState = 0;

let curr_level = 0;
let level_theme = 0;

let bg_speed;

let jumps = 2;

let pl_crouch = 1;

let groundY;

let yv;

let pieceHeight;
let pieceType = 0;
let pieceX;

let currTime;

let layers = [];
let positions = [];

let player_img, cart_img, obstacle_img, chain_img, piston_img;
let dead, next, title;

let forest, cave, jump, metal;

let sounds_loaded = false;

function preload() {
  for(i = 0; i <= 6; i++) {
    layers[i] = loadImage('b' + level_theme + '/' + 'layer_' + i + '.png');
    
    positions[i * 2] = 0;
    positions[i * 2 + 1] = 2400;
  }
  
  if(!sounds_loaded) {
    forest = loadSound('forest_ambiance.mp3');
    cave = loadSound('cave_ambiance.mp3');
    
    jump = loadSound('jump.mp3');
    jump.setVolume(0.05);
    
    metal = loadSound('metal.mp3');
    
    player_img = loadImage('player.png');
    cart_img = loadImage('cart.png');

    obstacle_img = loadImage('obstacle.png');

    chains_img = loadImage('chains.png');
    piston_img = loadImage('wood.png');

    dead = loadImage('dead.jpg');
    next = loadImage('next_level.jpg');

    title = loadImage('title.jpg');
    
    sounds_loaded = true;
  }
  
  //forest.loop();
  //cave.loop();
  
  //forest.volume(0.5);
  //cave.volume(0.5);
}
  
function setup() {  
  frameRate(60);
  
  if(curr_level == 0) {
    cave.play();
  }
  
  preload();
  
  createCanvas(1600, 800);
  
  for(i = 0; i <= 6; i++) {
    positions[i * 2] = 0;
    positions[i * 2 + 1] = 2400;
  }
  
  currTime = 0;
  
  print(level_theme);
  
  pieceX = 900;
  
  playerY = 3 / 4 * height;
  playerX = 100;
  
  groundY = 3 / 4 * height;
  
  yv = 0;
}

function gameUpdate() {
  currTime ++;
  
  if(floor(currTime / 20) == 100) {    
    gameState = 3;
  }
  
  if(pieceX < -300) {
    pieceHeight = random(0, 100) / 50 * 100 + 400;
    
    pieceX = width + 100;
    
    if(pieceHeight < 500) {
      pieceType = 30;
    }else{
      pieceType = 80;
    }
  }
  
  pieceX -= 10 + currTime / (300 - curr_level * 70);
  
  for(i = 0; i <= 6; i++) {
    positions[i * 2] -= (10 + currTime / (300 - curr_level * 70)) * max(0, i - level_theme * 2) / 12 * 4;
    positions[i * 2 + 1] -= (10 + currTime / (300 - curr_level * 70)) * max(0, i - level_theme * 2) / 12 * 4;
    
    if(positions[i * 2] < -2400) {
      positions[i * 2] = 2400;
    }
    
    if(positions[i * 2 + 1] < -2400) {
      positions[i * 2 + 1] = 2400;
    }
  }
  
  playerY += yv;
  
  if(playerY + pl_crouch * 100 - 200 < pieceHeight && playerY > pieceHeight && abs(pieceX - playerX) < 20) {
    setup();
    
    metal.play();
    
    gameState = 2;
  }
  
  if(playerY < groundY) {
    yv = yv + 1 / 10 * 9.8;
  }else{
    yv = 0;
    
    if(jumps != 2) {
      metal.play();
    }
    
    jumps = 2;
  }
}

function draw() {  
  if(gameState == 0) {
    background(0);
    
    image(title, 0, 0);
  }
  
  if(gameState == 2) {
    background(0);
    
    image(dead, 0, 0);
  }
  
  if(gameState == 3) {
    background(0);
    
    image(next, 0, 0);
  }
  
  if(gameState == 1) {
    gameUpdate();
    
    stroke('black');
    strokeWeight(1);
    
    fill('white');
    
    textAlign(RIGHT);
    textSize(30);
    
    background(0);
    
    image(layers[0], positions[0], 0);
    image(layers[0], positions[1], 0);
    image(layers[1], positions[2], 0);
    image(layers[1], positions[3], 0);
    image(layers[2], positions[4], 0);
    image(layers[2], positions[5], 0);
    image(layers[3], positions[6], 0);
    image(layers[3], positions[7], 0);
    
    if(level_theme == 1){
      image(layers[4], positions[8], 0);
      image(layers[4], positions[9], 0);

      image(layers[5], positions[10], 0);
      image(layers[5], positions[11], 0);
    }
    
    fill(255);

    //player
    if(pl_crouch == 0) {
      image(player_img, playerX, playerY - 100);
    }else{
      image(cart_img, playerX, playerY);
    }

    //obstacles
    if(pieceType < 50) {
      image(chains_img, pieceX + 32, pieceHeight - 750, 30, 800);
      image(obstacle_img, pieceX, pieceHeight - 50 + 100);
    }else if(pieceType >= 50) {
      image(piston_img, pieceX + 32, pieceHeight - 50 + 100 + 50, 30, 800);
      image(obstacle_img, pieceX, pieceHeight - 50 + 100);
    }
    
    
    strokeWeight(0);
    
    if(level_theme == 0) {
      fill(64);
    }else{
      fill(color(0, 64, 0));
    }
    
    rect(0, groundY + 100, width, height - groundY);
    
    fill('white');
    
    strokeWeight(1);
    
    if(level_theme == 0){
      image(layers[4], positions[8], 0);
      image(layers[4], positions[9], 0);

      image(layers[5], positions[10], 0);
      image(layers[5], positions[11], 0);
    }
    
    image(layers[6], positions[12], 0);
    image(layers[6], positions[13], 0);
    
    //score
    text(`Score: ${floor(currTime / 20)}`, 1 / 4 * width, 1 / 16 * height);
    text(`Level: ${curr_level + 1}`, 1 / 4 * width, 2 / 16 * height);
    
    noFill();
    
    strokeWeight(5);
    stroke('white');
    
    rect(pieceX, pieceHeight - 50 + 100, 100, 50);
    
    stroke('black');
    strokeWeight(1);
  }
}

function keyPressed() {
  if(keyCode == UP_ARROW && gameState == 0 || gameState == 2) {
    gameState = 1;
  }else if(keyCode == UP_ARROW && gameState == 3) {    
    curr_level ++;
    
    print(curr_level % 2);
    
    level_theme = curr_level % 2;
    
    cave.stop();
    forest.stop();
    
    if(level_theme == 0) {
      cave.play();
    }else{
      forest.play();
    }
    
    setup();
    
    gameState = 1;
  }else if(keyCode == UP_ARROW && jumps > 0) {
     yv = -20;
    
    playerY -= 40;
    
    jumps -= 1;
    
    jump.play();
    
    pl_crouch = 0;
  }
  
  if(keyCode == DOWN_ARROW) {
    pl_crouch = 1;
  }
}