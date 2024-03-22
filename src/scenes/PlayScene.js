import Phaser from "phaser";

class Snake extends Phaser.GameObjects.GameObject {
  constructor(scene) {
    super(scene);
    this.segments = null;
    this.snakeSize = 5;
    this.xPos = 100;
    this.yPos = 400;
    this.segments = this.scene.physics.add.group();
  }
  preload() {
    this.load.image("segment", "assets/snake16.png");
  }
  create() {
    /* for (let i = 0; i < this.snakeSize; i++) {
      this.segments.create(this.xPos, this.yPos, "segment").setOrigin(0.5);
      this.xPos -= 16;
      this.movements.push([]);
    } */

    this.cursors = this.scene.input.keyboard.createCursorKeys();
  }

  update() {
    // console.log(this.head.distance.length);
    if (this.cursors.up.isDown == true) {
    }
    if (this.cursors.down.isDown == true) {
    }
    if (this.cursors.left.isDown == true) {
    }
    if (this.cursors.right.isDown == true) {
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
  preload() {}

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
