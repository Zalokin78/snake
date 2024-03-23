import Phaser from "phaser";
import PlayScene from "./scenes/PlayScene";
//import { debug } from "webpack";
//import { debug } from "webpack";

const SCREEN_SIZE = 40;
const SEGMENT_SIZE = 16;
const WIDTH = SCREEN_SIZE * SEGMENT_SIZE;
const HEIGHT = SCREEN_SIZE * SEGMENT_SIZE;
const SNAKE_POSITION = {
  x: Math.floor(Phaser.Math.Between(0, WIDTH)),
  y: Math.floor(Phaser.Math.Between(0, HEIGHT)),
};
const INIT_SNAKESIZE = 2;

const SHARED_CONFIG = {
  width: WIDTH,
  height: HEIGHT,
  startPosition: SNAKE_POSITION,
  initSnakeSize: INIT_SNAKESIZE,
  segmentSize: SEGMENT_SIZE,
};

const config = {
  type: Phaser.AUTO,
  ...SHARED_CONFIG,
  /*  fps: {
    target: 10,
    forceSetTimeOut: true,
  }, */
  physics: {
    default: "arcade",
    arcade: {
      //fps: 10,
      debug: true,
    },
  },
  scene: [new PlayScene(SHARED_CONFIG)],
};

new Phaser.Game(config);

/* let ZKey;
let WKey;
let SKey;
let AKey;
let DKey;
let snakeSize = 2;
const INITSNAKESIZE = 2;
// let xPosInit = 240; //config.width / 3;
// let yPosInit = 240; //config.width / 3;
let xPos = SNAKE_POSITION.x;
let yPos = SNAKE_POSITION.y;

let dirX = 0;
let dirY = 0;
const SPEED = 3;
let apple = {}; */
//let segments = null;
//debugger;
/* function update(time, delta) {
  snakeMovement();

  if (checkCollision(xPos, yPos)) {
    init();
  }

  segments.create(xPos, yPos, "segment").setOrigin(0.5);

  if (segments.children.entries.length > snakeSize) {
    console.log(snakeSize);

    segments.children.entries[0].destroy();
  }
}

function snakeMovement() {
  if (dirX == 0) {
    if (Phaser.Input.Keyboard.JustDown(DKey)) {
      dirX = SEGMENT_SIZE; // * SEGMENT_SIZE;
      dirY = 0;
    } else if (Phaser.Input.Keyboard.JustDown(AKey)) {
      dirX = -SEGMENT_SIZE; // * SEGMENT_SIZE;
      dirY = 0;
    }
  }
  if (dirY == 0) {
    if (Phaser.Input.Keyboard.JustDown(WKey)) {
      dirY = -SEGMENT_SIZE; // * SEGMENT_SIZE;
      dirX = 0;
    } else if (Phaser.Input.Keyboard.JustDown(SKey)) {
      dirY = +SEGMENT_SIZE; //e * SEGMENT_SIZE;
      dirX = 0;
    }
  }
  xPos = (xPos + dirX + config.width) % config.width;
  yPos = (yPos + dirY + config.height) % config.height;
}

function generateApple() {
  let rndWidth = Math.floor(
    Phaser.Math.Between(0 + SEGMENT_SIZE, config.width - SEGMENT_SIZE)
  );
  let rndHeight = Math.floor(
    Phaser.Math.Between(0 + SEGMENT_SIZE, config.height - SEGMENT_SIZE)
  );

  apple.x = rndWidth - (rndWidth % SEGMENT_SIZE);

  apple.y = rndHeight - (rndHeight % SEGMENT_SIZE);
}

function checkCollision(x, y) {
  let result = false;

  segments.children.entries.forEach((element) => {
    // console.log("x = " + element.x);
    // console.log("y = " + element.y);
    if (element.x == x && element.y == y) result = true;
  });

  return result;
}

function eat() {
  generateApple();
  snakeSize++;
}
function init() {
  xPos = SNAKE_POSITION.x;
  yPos = SNAKE_POSITION.y;
  dirX = 0;
  dirY = 0;

  if (segments.children.entries.length > 1) {
    segments.clear(true, true);
  }

  snakeSize = INITSNAKESIZE;

  return;
}
 */
//debugger;
