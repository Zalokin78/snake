import Phaser from "phaser";

class Snake extends Phaser.GameObjects.GameObject {
  constructor(scene) {
    super(scene);
    this.segments = null;
    this.snakeSize = 5;
    this.xPos = 100;
    this.yPos = 100;
    this.segments = this.scene.physics.add.group();
    this.movements = [];
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
    console.log(this.movements);

    this.cursors = this.scene.input.keyboard.createCursorKeys();

    console.log(this.segments);
  }

  update() {
    if (this.cursors.up.isDown == true) {
      this.head.setVelocityY(-100);
      this.head.setVelocityX(0);

      this.movements.forEach((element) => {
        element.push({ direction: "u" });
        console.log(element);
      });
    }
    if (this.cursors.down.isDown == true) {
      this.head.setVelocityY(100);
      this.head.setVelocityX(0);

      this.movements.forEach((element) => {
        element.push({ direction: "d" });
        console.log(element);
      });
    }
    if (this.cursors.left.isDown == true) {
      this.head.setVelocityX(-100);
      this.head.setVelocityY(0);

      this.movements.forEach((element) => {
        element.push({ direction: "l" });
        console.log(element);
      });
    }
    if (this.cursors.right.isDown == true) {
      this.head.setVelocityX(100);
      this.head.setVelocityY(0);

      this.movements.forEach((element) => {
        element.push({ direction: "r" });
        console.log(element);
      });
    }
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
