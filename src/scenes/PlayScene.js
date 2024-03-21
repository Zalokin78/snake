import Phaser from "phaser";
//##before staging
//##after staging

class Snake extends Phaser.GameObjects.GameObject {
  constructor(scene) {
    super(scene);
    this.segments = null;
    this.snakeSize = 5;
    this.xPos = 100;
    this.yPos = 400;
    this.segments = this.scene.physics.add.group();
    this.movements = [];
    this.inputFlag = true;
  }
  preload() {
    this.load.image("segment", "assets/snake16.png");
  }
  create() {
    for (let i = 0; i < this.snakeSize; i++) {
      this.segments.create(this.xPos, this.yPos, "segment").setOrigin(0.5);
      this.xPos -= 16;
      this.movements.push([]);
    }
    this.indSegments = this.segments.children.entries;
    this.head = this.indSegments[0];
    //this.head.distance = [{ PosX: 0, posY: 0, yDist: 0 }];
    this.head.distance = {
      posXStart: this.head.x,
      posXEnd: this.head.x,
      posYStart: this.head.y,
      posYEnd: this.head.y,
    };
    console.log(this.head);

    this.cursors = this.scene.input.keyboard.createCursorKeys();

    console.log(this.segments);
  }

  update() {
    // console.log(this.head.distance.length);
    if (this.cursors.up.isDown == true) {
      this.head.setVelocityY(-100);
      this.head.setVelocityX(0);

      this.recordMovements();

      /* this.movements.forEach((element) => {
        element.push({ direction: "u" });
        console.log(element);
      }); */
    }
    if (this.cursors.down.isDown == true) {
      this.head.setVelocityY(100);
      this.head.setVelocityX(0);

      this.recordMovements();

      /* this.movements.forEach((element) => {
        element.push({ direction: "d" });
        console.log(element);
      }); */
    }
    if (this.cursors.left.isDown == true) {
      this.head.setVelocityX(-100);
      this.head.setVelocityY(0);

      this.recordMovements();
      /* this.movements.forEach((element) => {
        element.push({ direction: "l" });
        console.log(element);
      }); */
    }
    if (this.cursors.right.isDown == true) {
      this.head.setVelocityX(100);
      this.head.setVelocityY(0);

      this.recordMovements();
      /* this.movements.forEach((element) => {
        element.push({ direction: "r" });
        console.log(element);
      }); */
    }
  }

  recordMovements() {
    //test whether it's the inital position, if so, do not execute
    let values = Object.values(this.head.distance);
    let flag;

    if ((values[0] == values[1]) & (values[2] == values[3])) {
      flag = true;
    }
    console.log(this.head.distance);
    console.log(flag);

    /* const allEqual = (arr) => values.arr((v) => v === arr[0]);
    console.log(allEqual(values)); */

    //update distance range
    this.head.distance.posXEnd = this.head.x;
    this.head.distance.posYEnd = this.head.y;

    //console.log(this.head.distance);
    //record head.distances into array
    this.movements.forEach((element) => {
      element.push({
        xDist: this.head.distance.posXEnd - this.head.distance.posXStart,
        yDist: this.head.distance.posYEnd - this.head.distance.posYStart,
      });
      //console.log(element);
    });

    //push(this.head.distance);
    //reset distance markers
    //console.log(this.head.distance);
    this.head.distance.posXStart = this.head.distance.posXEnd;
    this.head.distance.posYStart = this.head.distance.posYEnd;
    //console.log(this.head.distance);

    //console.log(this.movements);
  }

  checkCollision(x, y) {
    //console.log(this.scene.topLayer);
    if (this.snakeSize > 2) {
      this.segments.children.entries.forEach((element) => {
        if (element.x == x && element.y == y) {
          this.collision = true;
          //this.scene.gameOver();
        }
      });
    }
  }
}

class PlayScene extends Phaser.Scene {
  constructor(config) {
    super("PlayScene");

    this.config = config;
    this.segments = null;

    this.WKey = null;
    this.SKey = null;
    this.AKey = null;
    this.DKey = null;

    //this.snakeSize = 2;

    //this.inputReady = true;
  }
  preload() {
    this.load.image("terrain", "assets/Tiled/terrain_atlas.png");
    this.load.image("segment", "assets/snake16.png");
    this.load.image("apple", "assets/fujiApple.png");

    this.load.tilemapTiledJSON("mappy", "assets/Tiled/terrain3Layers.json");
  }

  create() {
    this.WKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.SKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.AKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.DKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

    //this.initialise();

    this.snakeA = new Snake(this);
    console.log(this.snakeA);
    this.add.existing(this.snakeA);

    this.snakeA.create();
  }

  update(time, delta) {
    this.snakeA.update();
  }
}
export default PlayScene;
