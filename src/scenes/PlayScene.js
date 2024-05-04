import Phaser from "phaser";

class Snake extends Phaser.GameObjects.GameObject {
  constructor(scene) {
    super(scene);
    this.segments = null;
    this.snakeSize = 10;
    this.xPos = 100;
    this.yPos = 100;
    this.segments = this.scene.physics.add.group();
    this.segmentsRecord = [];
    this.index = 0;
    this.stutteredIndex = null;
    this.modulus = 0;
    this.indexOffset = 0;
    this.segmentGap = 1000;
    this.maxOffset = 0;
    this.velocity = 100; //130
    this.initOffset = Math.round((1 / this.velocity) * this.segmentGap);
    this.offset = this.initOffset;
    this.segmentsRecordSize = 500;
    this.testCounter = 0;
    this.collision = false;
    this.lastOffset = null;
    this.angularVelocity = 300;
    this.velMultiplyer = 2;
    //segments pos test variables
    this.segmentsTest = this.scene.physics.add.group();
    this.posArr = [];
    this.xPosTest = 100;
    this.yPosTest = 100;
    this.offsetTest = 10;
    this.initPos = [];
  }

  /*  preload() {
    this.image = this.load.image("segment", "assets/snake16Arrow.png");
    debugger;
    blah
  } */
  create() {
    console.log(this.scene.topLayer);
    this.head = this.scene.physics.add.sprite(this.xPos, this.yPos, "segment");

    this.head.angle = 220;
    this.head.setTint(1);

    for (let i = 0; i < this.segmentsRecordSize; i++) {
      this.xPos -=
        Math.cos(Math.PI * (this.head.angle / 180)) * this.velMultiplyer; //* 2.635;
      this.yPos -=
        Math.sin(Math.PI * (this.head.angle / 180)) * this.velMultiplyer; //* 2.635;

      this.segmentsRecord.push({
        x: this.xPos,
        y: this.yPos,
        angle: this.head.angle,
      });
    }

    for (let i = 0; i < this.snakeSize; i++) {
      this.segments
        .create(
          this.segmentsRecord[this.offset].x,
          this.segmentsRecord[this.offset].y,
          "segment"
        )
        .setOrigin(0.5);

      this.offset += this.initOffset;
      //for testing purposes
      this.initPos.push({
        x: this.segments.children.entries[i].x,
        y: this.segments.children.entries[i].y,
      });
    }

    this.segments.children.entries.forEach((element) => {
      element.body.angle = this.head.angle;
    });

    console.log(this.segments.children.entries.slice(-1));

    this.offset = this.initOffset;
    this.createColliders();

    this.keyboardMovement();

    /* this.scene.input.keyboard.on("keydown-UP", () => {});

    this.spacebar = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    ); */
    console.log(this.scene.config.width);

    debugger;
  }

  update() {
    debugger;

    this.worldBoundaryBehaviour();
    this.snakeMovement();

    this.collision = this.checkCollision(this.head.x, this.head.y);
  }

  keyboardMovement() {
    this.scene.input.keyboard.on("keydown-LEFT", () => {
      this.head.setAngularVelocity(-this.angularVelocity);
    });
    this.scene.input.keyboard.on("keyup-LEFT", () => {
      this.head.setAngularVelocity(0);
      //this.head.angle -= 5;git branch
    });
    this.scene.input.keyboard.on("keydown-RIGHT", () => {
      this.head.setAngularVelocity(this.angularVelocity);
    });

    this.scene.input.keyboard.on("keyup-RIGHT", () => {
      this.head.setAngularVelocity(0);
    });
  }
  snakeMovement() {
    this.scene.physics.velocityFromAngle(
      this.head.angle,
      this.velocity,
      this.head.body.velocity
    );

    /* this.head.x +=
      Math.cos(Math.PI * (this.head.angle / 180)) * this.velMultiplyer; //* 2.635;
    this.head.y +=
      Math.sin(Math.PI * (this.head.angle / 180)) * this.velMultiplyer; //* 2.635; */

    this.segmentsRecord.unshift({
      x: this.head.x,
      y: this.head.y,
      angle: this.head.angle,
    });
    this.segmentsRecord.pop();

    this.segments.children.entries.forEach((element) => {
      //console.log(element.x);
      element.x = this.segmentsRecord[this.offset].x;
      element.y = this.segmentsRecord[this.offset].y;
      element.angle = this.segmentsRecord[this.offset].angle;
      this.offset += this.initOffset;
    });
    this.lastOffset = this.offset;
    this.offset = this.initOffset;
    debugger;
  }

  checkCollision(x, y) {
    this.segments.children.entries.forEach((element) => {
      if (element.x == x && element.y == y) {
        this.collision = true;

        //this.scene.gameOver();
      }
    });

    return this.collision;
  }

  createColliders() {
    console.log(this.head);
    this.scene.physics.add.collider(
      this.head,
      this.segments.children.entries.slice(1),

      this.scene.testFunc2
    );

    this.scene.physics.add.collider(
      this.head,
      this.scene.topLayer,
      this.scene.testFunc2,
      null,
      this
    );
  }

  worldBoundaryBehaviour() {
    this.head.x = this.head.x % this.scene.config.width;
    this.head.y = this.head.y % this.scene.config.height;

    if (this.head.x <= 0) this.head.x = this.scene.config.width;
    if (this.head.y <= 0) this.head.y = this.scene.config.height;
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
    this.apple = {};
  }
  preload() {
    this.load.image("terrain", "assets/Tiled/terrain_atlas.png");
    this.load.image("segment", "assets/ovalSegment.png");
    this.load.image("apple", "assets/fujiApple.png");

    this.load.tilemapTiledJSON("mappy", "assets/Tiled/terrain3Layers.json");
  }

  create() {
    console.log(Snake);
    this.tileSet();

    this.WKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.SKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.AKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.DKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

    //this.initialise();

    this.snakeA = new Snake(this);
    console.log(this.snakeA);
    this.generateApple();
    this.apple = this.physics.add
      .sprite(this.apple.x, this.apple.y, "apple")
      .setOrigin(0.5, 0.5)
      .setPushable(false);

    this.add.existing(this.snakeA);

    this.snakeA.create();

    console.log(this.snakeA.head);
    this.physics.add.collider(
      this.snakeA.head,
      this.apple,
      this.eat,
      null,
      this
    );
    this.testSprite = this.physics.add.sprite(200, 200, "segment");
    console.log(this.topLayer);
    this.physics.add.collider(
      this.testSprite,
      this.topLayer,
      this.testFunc2,
      null,
      this
    );
  }

  update(/* time, delta */) {
    //testSprite movement testing area
    this.testSprite.setVelocityX(0);
    this.testSprite.setVelocityY(0);

    if (this.WKey.isDown == true) {
      this.testSprite.setVelocityY(-100);
    }
    if (this.SKey.isDown == true) {
      this.testSprite.setVelocityY(100);
    }
    if (this.AKey.isDown == true) {
      this.testSprite.setVelocityX(-100);
    }
    if (this.DKey.isDown == true) {
      this.testSprite.setVelocityX(100);
    }
    // console.log("time " + time);
    // console.log("delta " + delta);

    this.snakeA.update();
    //console.log(this.game.loop.actualFps);
    //console.log(this.game.loop.time);
  }

  generateApple() {
    let rndWidth = Math.floor(Phaser.Math.Between(0, this.config.width));
    let rndHeight = Math.floor(Phaser.Math.Between(0, this.config.height));

    this.apple.x = rndWidth;
    this.apple.y = rndHeight;
  }

  eat() {
    this.generateApple();
    this.snakeA.segments
      .create(
        this.snakeA.segmentsRecord[
          this.snakeA.lastOffset + this.snakeA.initOffset
        ].x,
        this.snakeA.segmentsRecord[
          this.snakeA.lastOffset + this.snakeA.initOffset
        ].y,
        "segment"
      )
      .setOrigin(0.5);

    console.log(this.snakeA.snakeSize);
    this.snakeA.snakeSize++;

    //this.hasAte = true;
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

  testFunc2() {
    console.log("RESTART II!!!!!");
    alert("Tile collision!!");
  }
}

export default PlayScene;
