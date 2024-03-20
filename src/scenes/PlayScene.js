import Phaser from "phaser";

class Snake extends Phaser.GameObjects.GameObject {
  constructor(scene) {
    super(scene);
    this.segments = null;
    this.snakeSize = 2;
  }
  create() {
    //this.scene.testFunc.call(this);
  }
  update() {}

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
    //console.log(this.topLayer);
    //this.testFunc.call(this);

    //this.testFunc();

    //this.physics.add.collider(this.segments, this.apple, this.eat, null, this);

    this.WKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.SKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.AKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.DKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

    this.cursors = this.input.keyboard.createCursorKeys();

    //this.initialise();

    this.snakeA = new Snake(this);
    console.log(this.snakeA);
    this.add.existing(this.snakeA);
    // this.snakeB = new Snake(this);
    // this.add.existing(this.snakeB);

    // this.snakeB.create();
    //debugger;

    this.snakeA.create();

    //testing of collisions
  }

  update(time, delta) {
    //-----
    //testSprite movement

    if (this.cursors.up.isDown == true) {
      this.testSprite.setVelocityY(-100);
    }
    if (this.cursors.down.isDown == true) {
      this.testSprite.setVelocityY(100);
    }
    if (this.cursors.left.isDown == true) {
      this.testSprite.setVelocityX(-100);
    }
    if (this.cursors.right.isDown == true) {
      this.testSprite.setVelocityX(100);
    }

    //end of testSprite movement
  }
}
export default PlayScene;
