var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'content', { preload: preload, create: create, update: update,render : render });

function preload() {

    game.load.image('smiley','asset/smiley.png');
    game.load.image('body','asset/body.png');

}

var snakeHead; //head of snake sprite
var snakeSection = new Array(); //array of sprites that make the snake body sections
var snakePath = new Array(); //array of positions(points) that have to be stored for the path the sections follow
var numSnakeSections = 4; //number of snake body sections
var snakeSpacer = 6; //parameter that sets the spacing between sections
var lives = 1;
var score = 0;
var scoreText;
var livesText;
var introText;
var s;
var speed = 0;

function create() {
    game.stage.backgroundColor = '#1d89b9';
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.world.setBounds(0, 0, 800, 600);
    cursors = game.input.keyboard.createCursorKeys();

    //  Init snakeSection array
    for ( var i = 1; i <= numSnakeSections-1; i++)
    {
        snakeSection[i] = game.add.sprite(400, 300, 'body');
        snakeSection[i].anchor.setTo(0.5, 0.5);
    }

    // Init snake head
    snakeHead = game.add.sprite(400, 300, 'smiley');
    snakeHead.anchor.setTo(0.5, 0.5);
    game.physics.enable(snakeHead, Phaser.Physics.ARCADE);

    //  Init snakePath array
    for ( i = 0; i <= numSnakeSections * snakeSpacer; i++)
    {
        snakePath[i] = new Phaser.Point(400, 300);
    }

    // Game texts
    scoreText = game.add.text(32, 550, 'Score : 0', { font: "20px Arial", fill: "#ffffff", align: "left" });
    livesText = game.add.text(680, 550, 'Vie : 1', { font: "20px Arial", fill: "#ffffff", align: "left" });
    introText = game.add.text(game.world.centerX, 300, '- Use left or right to move -\n\n\n- click to start -', { font: "40px Arial", fill: "#ffffff", align: "center" });
    introText.anchor.setTo(0.5, 0.5);
    introText.visible = true;

    // Create a new point in group
    monGroupe=game.add.group();
    s=monGroupe.create(750*Math.random(), 550*Math.random(),'smiley');
    s.visible = false;
    game.physics.enable(s,Phaser.Physics.ARCADE);
    game.input.onDown.add(startGame, this);

    // Create a group for new snake body part
    mySnake=game.add.group();
}

function update() {
    snakeHead.body.velocity.setTo(0, 0);
    snakeHead.body.angularVelocity = 0;
    snakeHead.body.velocity.copyFrom(game.physics.arcade.velocityFromAngle(snakeHead.angle, speed));

    // Every time the snake head moves, insert the new location at the start of the array,
    // and knock the last position off the end
    var part = snakePath.pop();
    part.setTo(snakeHead.x, snakeHead.y);
    snakePath.unshift(part);
    for (var i = 1; i <= numSnakeSections - 1; i++)
    {
        snakeSection[i].x = (snakePath[i * snakeSpacer]).x;
        snakeSection[i].y = (snakePath[i * snakeSpacer]).y;
    }
    if (cursors.left.isDown)
    {
        snakeHead.body.angularVelocity = -300;
    }
    else if (cursors.right.isDown)
    {
        snakeHead.body.angularVelocity = 300;
    }

    // Game rules
    game.physics.arcade.collide(snakeHead, monGroupe, catchThePoint);
    game.physics.arcade.collide(snakeHead, mySnake, gameOver);
    if (snakeHead.body.x < 0 ||  snakeHead.body.x > 770) {
        snakeHead.body.x=0;
        gameOver();
    }
    if (snakeHead.body.y < 0 ||  snakeHead.body.y > 573) {
        snakeHead.body.y=0;
        gameOver();
    }
}

function startGame() {
    speed = 250;
    introText.visible = false;
    s.visible = true;
}

function catchThePoint() {
    // Kill the sprite point
    s.kill();

    // Add a section to the snake body
    numSnakeSections = numSnakeSections + 1;
    snakeSection[numSnakeSections - 1] = mySnake.create(snakeSection[numSnakeSections-2].x, snakeSection[numSnakeSections-2].y, 'body');
    snakeSection[numSnakeSections - 1].anchor.setTo(0.5, 0.5);
    game.physics.enable(mySnake,Phaser.Physics.ARCADE);

    // Add Phaser Point for new snake part
    for ( i = 0; i <= numSnakeSections * snakeSpacer; i++) {
        snakePath.push(new Phaser.Point(snakeHead.x, snakeHead.y));
    }

    // Create a new point
    s=monGroupe.create(750*Math.random(), 550*Math.random(),'smiley');
    game.physics.enable(s,Phaser.Physics.ARCADE);

    // Add 100 to the score
    score += 100;
    scoreText.text = 'Score : ' + score;
}

function gameOver() {
    lives -= 1;
    livesText.text = 'Vie : ' + lives;
    introText.text = 'Game Over!';
    introText.visible = true;
    snakeHead.kill();
    mySnake.removeAll(true);
    s.kill();
    game.input.onDown.add(endGame, this);
}

function endGame() {
    introText.visible = true;
    s.visible = false;
}

function render() {

}