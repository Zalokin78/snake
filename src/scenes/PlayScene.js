import Phaser from "phaser";

class Snake extends Phaser.GameObjects.GameObject {
  constructor(scene) {
    super(scene);
    this.segments = null;
    this.snakeSize = 2;
    this.scene = scene;
    this.dirX = 0;
    this.dirY = 0;
    this.testCondition = false;
    this.inputReady = true;
    this.lostLife = false;
    // this.xPos = this.scene.xPos;
    // this.yPos = this.scene.yPos;
  }
  create() {
    //this.scene.testFunc.call(this);
    console.log("rarw");
    console.log(this.inputReady);
    console.log(Phaser.Input.Keyboard.JustDown(this.scene.DKey));
    this.segments = this.scene.physics.add.group();
    this.scene.physics.add.collider(
      this.segments,
      this.scene.apple,
      this.eat,
      null,
      this
    );

    this.initialise();
    console.log(this.xPos);
    //debugger;
  }
  update() {}

  snakeMovement() {
    if (this.inputReady) {
      if (this.dirX == 0) {
        if (
          Phaser.Input.Keyboard.JustDown(this.scene.DKey) &&
          this.inputReady
        ) {
          this.dirX = +this.scene.config.segmentSize;
          this.dirY = 0;
          console.log("right");
          this.inputReady = false;
        } else if (
          Phaser.Input.Keyboard.JustDown(this.scene.AKey) &&
          this.inputReady
        ) {
          this.dirX = -this.scene.config.segmentSize;
          this.dirY = 0;
          console.log("left");
          this.inputReady = false;
        }
      }
      if (this.dirY == 0) {
        if (
          Phaser.Input.Keyboard.JustDown(this.scene.WKey) &&
          this.inputReady
        ) {
          this.dirY = -this.scene.config.segmentSize;
          this.dirX = 0;
          console.log("up");
          this.inputReady = false;
        } else if (
          Phaser.Input.Keyboard.JustDown(this.scene.SKey) &&
          this.inputReady
        ) {
          this.dirY = +this.scene.config.segmentSize;
          this.dirX = 0;
          console.log("down");
          this.inputReady = false;
        }
      }
    }
    //console.log(this.dirX);
    this.xPos =
      (this.xPos + this.dirX + this.scene.config.width) %
      this.scene.config.width;
    this.yPos =
      (this.yPos + this.dirY + this.scene.config.height) %
      this.scene.config.height;
    //if (!this.inputReady)
    if (this.checkCollision(this.xPos, this.yPos)) {
      //debugger;
      //this.scene.gameOver(); //.call(this);
      this.lostLife = true;
      this.collision = false;
    }
    if (this.lostLife) {
      this.gameOver();
      //this.initialise();
    }
    if (this.scene.gameActive) {
      this.head = this.segments
        .create(this.xPos, this.yPos, "segment")
        .setOrigin(0.5);
      console.log(this.scene.topLayer);
      this.scene.physics.add.collider(this.head, this.scene.topLayer);
    }

    if (this.segments.children.entries.length > this.snakeSize) {
      this.segments.children.entries[0].destroy();
    }
    this.inputReady = true;
  }

  initialise() {
    //debugger;

    this.scene.gameActive = true;
    this.lostLife = false;

    this.xPos = this.scene.config.startPosition.x;
    this.yPos = this.scene.config.startPosition.y;

    this.dirX = 0;
    this.dirY = 0;
    //debugger;
    if (this.segments.children.entries.length > 1) {
      this.segments.clear(true, true);
    }

    this.snakeSize = this.scene.config.initSnakeSize;

    return;
  }

  checkCollision(x, y) {
    console.log(this.scene.topLayer);
    if (this.snakeSize > 2) {
      this.segments.children.entries.forEach((element) => {
        if (element.x == x && element.y == y) {
          this.collision = true;
          //this.scene.gameOver();
        }
      });
    }

    return this.collision;
  }

  eat() {
    this.scene.generateApple();
    this.snakeSize++;
    //this.hasAte = true;
  }

  gameOver() {
    //alert("GAME OVER");
    //console.log(this.segments.children.entries.length);
    //this.lostLife = false;
    this.scene.gameActive = false;
    this.segments.children.entries.forEach((element) => {
      console.log("GAME OVER element - " + element);
      console.log(this.counter);
      element.red = true;

      element.setTint(0xff0000);
      this.counter++;
    });

    this.dirX = 0;
    this.dirY = 0;

    console.log("RAWRR");
    //this.testFunc();

    this.scene.time.addEvent({
      delay: 1000,
      callback: () => {
        this.initialise();
      },
      loop: false,
    });
    //this.initialise();
  }
}

class PlayScene extends Phaser.Scene {
  constructor(config) {
    super("PlayScene");

    this.config = config;
    this.segments = null;
    this.apple = {};

    this.WKey = null;
    this.SKey = null;
    this.AKey = null;
    this.DKey = null;

    //this.snakeSize = 2;

    this.collision = false;
    this.gameActive = true;

    this.counter = 0;
    this.hasAte = false;
    this.debug = false;

    this.time = null;
    //this.inputReady = true;
  }
  preload() {
    this.load.image("terrain", "assets/Tiled/terrain_atlas.png");
    this.load.image("segment", "assets/snake16.png");
    this.load.image("apple", "assets/fujiApple.png");

    this.load.tilemapTiledJSON("mappy", "assets/Tiled/terrain3Layers.json");
  }

  create() {
    this.tileSet();
    //console.log(this.topLayer);
    //this.testFunc.call(this);

    //this.testFunc();

    //this.physics.add.collider(this.segments, this.apple, this.eat, null, this);

    this.WKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.SKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.AKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.DKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

    this.cursors = this.input.keyboard.createCursorKeys();

    console.log(this.DKey);

    console.log(Phaser.Input.Keyboard.JustDown(this.DKey));

    //this.initialise();

    this.snakeA = new Snake(this);
    console.log(this.snakeA);
    this.add.existing(this.snakeA);
    // this.snakeB = new Snake(this);
    // this.add.existing(this.snakeB);

    // this.snakeB.create();
    //debugger;

    this.apple = this.physics.add
      .sprite(this.apple.x, this.apple.y, "apple")
      .setOrigin(0.5, 0.5);

    this.generateApple();
    this.snakeA.create();

    //testing of collisions
    this.testSprite = this.physics.add.sprite(200, 200, "segment");
    this.physics.add.collider(this.testSprite, this.topLayer);
  }

  update(time, delta) {
    //-----
    //testSprite movement
    this.testSprite.setVelocityX(0);
    this.testSprite.setVelocityY(0);

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

    if (!this.dirX == 0 || !this.dirY == 0) this.debug = true;

    if (this.gameActive) {
      this.snakeA.snakeMovement();
      // this.snakeB.snakeMovement();
    }
    // console.log(this.snakeB.inputReady);
    //console.log(this.snakeB.dirY);
  }

  generateApple() {
    let rndWidth = Math.floor(
      Phaser.Math.Between(
        0 + this.config.segmentSize,
        this.config.width - this.config.segmentSize
      )
    );
    let rndHeight = Math.floor(
      Phaser.Math.Between(
        0 + this.config.segmentSize,
        this.config.height - this.config.segmentSize
      )
    );

    this.apple.x = rndWidth - (rndWidth % this.config.segmentSize);

    this.apple.y = rndHeight - (rndHeight % this.config.segmentSize);
  }

  tileSet() {
    let mappy = this.add.tilemap("mappy");

    let terrain = mappy.addTilesetImage("terrain_atlas", "terrain");
    //this.segments = this.physics.add.group();

    let botLayer = mappy.createLayer("bot", terrain, 0, 0);
    let grassLayer = mappy.createLayer("grass", terrain, 0, 0);
    this.topLayer = mappy.createLayer("top", terrain, 0, 0);

    //this.physics.add.collider(this.snakeA, this.topLayer);

    this.topLayer.setCollisionByProperty({ collides: true });
  }

  testFunc() {
    console.log("RESTART!!!!!!!!!");
    console.log("config test - " + this.scene.config.startPosition.x);
    console.log("config test - " + this.scene.apple);
    //this.testFunc2();
  }

  testFunc2() {
    console.log("RESTART II!!!!!");
  }
}

export default PlayScene;
