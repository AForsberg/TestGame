var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });


function preload() {

	game.load.image('sky', 'assets/sky.png');
    game.load.image('platform', 'assets/platform.png');
    game.load.image('obstacle', 'assets/platformvertical.png');
    game.load.image('star', 'assets/star.png');
    game.load.spritesheet('player', 'assets/dude.png', 32, 48);
}

var player;
var platforms;
var cursors;
var obstacles;
var score;
var multiplier = 1;
var scoreText;
var gravityDirection = -1;

function create() {

	game.physics.startSystem(Phaser.Physics.ARCADE);
	game.add.sprite(0, 0, 'sky');

	// Create player
	player = game.add.sprite(game.world.width / 2, game.world.height / 2, 'player');
	game.physics.arcade.enable(player);
	player.body.gravity.y = 1000;
	player.body.collideWorldBounds = true;
	player.anchor.setTo(.5, .5);
	player.scale.x *= -1;

	// Create ground and ceiling
	platforms = game.add.group();
	platforms.enableBody = true;

	var ground = platforms.create(0, game.world.height - 32, 'platform');
	ground.body.immovable = true;
	ground.scale.setTo(2, 1);

	var ceiling = platforms.create(0, 0, 'platform');
	ceiling.body.immovable = true;
	ceiling.scale.setTo(2,1);

	// Create obstacles
	obstacles = game.add.group();
	obstacles.enableBody = true;
	obstacles.createMultiple(20, 'obstacle');

	// Create pickups
	pickups = game.add.group();
	pickups.enableBody = true;

	// Create score text
	score = 0;
	scoreText = game.add.text(20, 40, 'Score: ' + score , {fontSize: '50px', fill: '#000'});

	// Add obstacle every .6 seconds
	var timer = game.time.events.loop(600, addObstacle, this);

	// Controls
	cursors = game.input.keyboard.createCursorKeys();


}

function update() {

    game.physics.arcade.overlap(player, platforms, facePlant, null, this);
    game.physics.arcade.overlap(player, obstacles, facePlant, null, this);
    game.physics.arcade.overlap(player, pickups, invertGravity, null, this);
    game.physics.arcade.overlap(obstacles, pickups, removePickup, null, this);

    //  LEMME SEE YOU FLAP.
    if (cursors.up.isDown && gravityDirection == -1)
    {
        player.body.velocity.y = -250;
    } else if (cursors.down.isDown && gravityDirection == 1) 
    {
    	player.body.velocity.y = 250;
    };
}
function removePickup (obstacle, pickup) {
	pickup.kill();
}

function invertGravity (player, pickup) {
	player.body.velocity.y = 0;
	gravityDirection = gravityDirection == 1 ? -1 : 1;
	player.body.gravity.y = player.body.gravity.y == 1000 ? -1000 : 1000;
	pickup.kill();
	multiplier++;
}

function facePlant (player, platform) {
	// You have collided with something
	player.kill()
	game.add.text(game.world.width /2, game.world.height /2, 'Game over man.', {fontSize: '50px', fill: '#000'});
	game.paused = true;
}

function addObstacle () {

	var obstacle = obstacles.getFirstDead();
	var placement = (((Math.random() *2) % 2) + 1);
	var upOrDown = Math.floor(Math.random()*2) == 1 ? 1 : -1;
	if(placement > 2){
		var star = pickups.create(game.world.width, game.world.height / 2, 'star');
		star.body.velocity.x = -350;
		star.checkWorldBounds = true;
		star.outOfBoundsKill = true;
	}
	
	score += (10 * multiplier);
	scoreText.text = ('Score: ' + score);


	obstacle.reset(game.world.width, (game.world.height / placement) * upOrDown);
	obstacle.body.velocity.x = -350;
	obstacle.checkWorldBounds = true;
	obstacle.outOfBoundsKill = true;
	
}