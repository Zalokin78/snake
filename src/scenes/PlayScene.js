import Phaser from "phaser";

class Snake extends Phaser.GameObjects.GameObject {
  constructor(scene) {
    super(scene);
    this.segments = null;
    this.snakeSize = 8;
    this.xPos = 200;
    this.yPos = 200;
    this.segments = this.scene.physics.add.group();
    this.segmentsRecord = [];
    this.index = 0;
    this.stutteredIndex = null;
    this.modulus = 0;
    this.indexOffset = 0;
    this.segmentGap = 500;
    this.maxOffset = 0;
    this.velocity = 130;
    this.initOffset = Math.round((1 / this.velocity) * this.segmentGap);
    this.offset = this.initOffset;
    this.segmentsRecordSize = 500;
    this.testCounter = 0;
    this.collision = false;
    this.lastOffset = null;
    //segments pos test variables
    this.segmentsTest = this.scene.physics.add.group();
    this.posArr = [];
    this.xPosTest = 100;
    this.yPosTest = 100;
    this.offsetTest = 10;
  }

  /*  preload() {
    this.image = this.load.image("segment", "assets/snake16Arrow.png");
    debugger;
    blah
  } */
  create() {
    /* this.testArray = ["a", "b", "c", "d"];
    this.set = new Set(["a", "b", "c"]);

    console.log(this.testArray);
    // this.sliced = this.testArray.slice(1);
    // console.log(this.sliced);

    this.mysteryArray = this.segments.children;
    this.mysteryArray[0].forEach((element) => {
      console.log(element);
    });

    this.list = this.segments.children.entries;
    let g = this.list.entries();
    console.log(g);
    for (x of g) {
      console.log("a", x);
    }

    this.flatArray = this.segments.children.entries.flat();
    console.log(this.flatArray); */

    /* for (let i = 0; i < this.segmentsRecordSize; i++) {
      this.segmentsRecord.push({
        x: this.xPos,
        y: this.yPos,
        angle: 290,
      });
    } */

    this.head = this.scene.physics.add.sprite(this.xPos, this.yPos, "segment");

    this.head.angle = 280;

    for (let i = 0; i < this.segmentsRecordSize; i++) {
      this.xPos -= Math.cos(Math.PI * (this.head.angle / 180));
      this.yPos -= Math.sin(Math.PI * (this.head.angle / 180));

      this.segmentsRecord.push({ x: this.xPos, y: this.yPos });
    }

    /* .setVelocity(1000, 1000); */

    /* for (let i = 0; i < this.snakeSize; i++) {
      this.segments.create(this.xPos, this.yPos, "segment").setOrigin(0.5);

      this.offset += this.initOffset;
    } */

    for (let i = 0; i < this.snakeSize; i++) {
      this.segments
        .create(
          this.segmentsRecord[this.offset].x,
          this.segmentsRecord[this.offset].y,
          "segment"
        )
        .setOrigin(0.5);

      this.offset += this.initOffset;
    }

    //////////////////////////////
    //testing area
    /* for (let i = 0; i < 300; i++) {
      this.xPosTest -= Math.cos(Math.PI * (this.head.angle / 180));
      this.yPosTest -= Math.sin(Math.PI * (this.head.angle / 180));

      this.posArr.push({ x: this.xPosTest, y: this.yPosTest });
    } */

    /*  for (let i = 0; i < this.snakeSize; i++) {
      this.segmentsTest
        .create(
          this.posArr[this.offsetTest].x,
          this.posArr[this.offsetTest].y,
          "segment"
        )
        .setOrigin(0.5);

      this.offsetTest += 10;
    } */

    this.segments.children.entries.forEach((element) => {
      element.angle = this.head.angle;
    });

    ////////////////////////////////////////
    /* this.segmentsTest.children.entries.forEach((element) => {
      element.angle = this.head.angle;
      console.log(element);
    }); */
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
    // console.log(this.head.x);
    // console.log(this.head.y);
    // console.log(this.segments);
    // console.log(this.head);
    this.worldBoundaryBehaviour();
    this.snakeMovement();
    // this.segments.forEach((element) => {
    this.collision = this.checkCollision(this.head.x, this.head.y);
    //console.log(this.collision);

    //if (this.collision) alert("COLLISION!!");
    // });
  }

  keyboardMovement() {
    this.scene.input.keyboard.on("keydown-LEFT", () => {
      this.head.setAngularVelocity(-200);
    });
    this.scene.input.keyboard.on("keyup-LEFT", () => {
      this.head.setAngularVelocity(0);
      //this.head.angle -= 5;
    });
    this.scene.input.keyboard.on("keydown-RIGHT", () => {
      this.head.setAngularVelocity(200);
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
    //if (this.snakeSize > 2) {
    this.segments.children.entries.forEach((element) => {
      //console.log(x);
      //console.log(element.x);
      if (element.x == x && element.y == y) {
        this.collision = true;

        //this.scene.gameOver();
      }
    });
    //}

    return this.collision;
  }

  createColliders() {
    this.scene.physics.add.collider(
      this.head,
      this.segments.children.entries.slice(-1),
      () => {
        //alert("COLLSIONNNNN!!");
      }
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
    this.load.image("segment", "assets/ovalSegment.png");
    this.load.image("apple", "assets/fujiApple.png");
  }

  create() {
    console.log(Snake);
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
  }

  update(/* time, delta */) {
    // this.apple.x;
    // this.apple.y;
    // console.log("time " + time);
    // console.log("delta " + delta);

    this.snakeA.update();
    //console.log(this.game.loop.actualFps);
    //console.log(this.game.loop.time);
    debugger;
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
}

export default PlayScene;
