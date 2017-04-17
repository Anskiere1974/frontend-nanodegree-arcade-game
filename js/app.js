// To start we need a Game object
var Game = function() {
    this.score = 0;
    this.lives = 5;
    /* Our game can be in different states:
    0: the game is active
    1: You win screen
    2: You lost screen
    */
    this.state = 0; // We start with a new active game
};

/* This function will take care about all the things happening, when a hero loses a life eg: decrementing the lives or updating the scoreboard */
Game.prototype.loseLife = function() {
    this.lives--;
    document.getElementById('lives').innerHTML = this.lives;
    // Monitor if player loses his last life
    // if lives < 1 change game state
    if (this.lives < 1) {
        this.state = 2;
    }
};

Game.prototype.addScore = function() {
    this.score++;
    document.getElementById('score').innerHTML = this.score;
    // Monitor if player has Score of 5 to win the game
    // if score > 4 change game state to win
    if (this.score > 4) {
        this.state = 1;
    }
};

Game.prototype.resetGame = function() {
    // Let's reset the state of the game
    this.state = 0;
    // Let's reset the scoreboard
    this.score = 0;
    this.lives = 5;
    document.getElementById('score').innerHTML = game.score;
    document.getElementById('lives').innerHTML = game.lives;

    // Let's reset the player
    player.reset(220, 470);

    // Let's reset our enemies
    allEnemies = [
        new Enemy(-100, 139, 170),
        new Enemy(-100, 222, 265),
        new Enemy(-100, 305, 225)
    ];
};

// Enemies our player must avoid
var Enemy = function(posX, posY, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = posX; // x-coords
    this.y = posY; // y-coords
    this.speed = speed; // the bugs need speed to move
    this.width = 101; // width for AABB
    this.height = 67; // height for AABB
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    // when a bug leaves the canvas he is put back on the left side
    if (this.x > 505) {
        this.x = -100;
    }
    this.x += this.speed * dt;
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(posX, posY) {
    // bring the player image online
    this.sprite = 'images/char-boy-new.png';
    // our hero needs a place (x,y) in life
    this.x = posX;
    this.y = posY;
    // we need some width and height for AABB
    this.width = 67;
    this.height = 78;
};

Player.prototype.update = function() {

};

// Draw the player on the screen, required method for game
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// After a collision or reaching the water we have to reset the player
Player.prototype.reset = function(posX, posY) {
    this.x = posX;
    this.y = posY;
};

// Read out the keyboard input and adjust player pos accordingly
Player.prototype.handleInput = function(direction) {
    if (direction === 'up' && this.y > 55) {
        this.y -= 83;
    } else if (direction === 'down' && this.y < 470) {
        this.y += 83;
    } else if (direction === 'left' && this.x > 18) {
        this.x -= 101;
    } else if (direction === 'right' && this.x < 422) {
        this.x += 101;
    }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
// First we need a new game
var game = new Game();

// Let's start with the enemies, they need x,y and speed
var allEnemies = [
    new Enemy(-100, 139, 170),
    new Enemy(-100, 222, 265),
    new Enemy(-100, 305, 225)
];

// a brave player is called to action and positioned on the field
var player = new Player(220, 470);

// now we need a lovely princess to save
var princess = new Player(422, 50);
princess.sprite = 'images/char-princess-girl.png';

/* for collision detection I used the Axis ALigned Bounding box.
You see an introduction at https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
*/
// Look for collisions with the bugs
function checkCollisions(allEnemies, player) {
    for (var i = 0; i < allEnemies.length; i++) {
        if (allEnemies[i].x < player.x + player.width &&
            allEnemies[i].x + allEnemies[i].width > player.x &&
            allEnemies[i].y < player.y + player.height &&
            allEnemies[i].height + allEnemies[i].y > player.y) {
            player.reset(220, 470);
            game.loseLife();
        }
    }
}

// Look for collision with princess
function checkPrincess(rect1, rect2) {
    if (rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.height + rect1.y > rect2.y) {
        player.reset(220, 470);
        game.addScore();
    }
}

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
