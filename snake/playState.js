const State = require('./state.js');
const Snake = require('./snake.js');
const Food = require('./food.js');
const ScoreState = require('./scoreState.js');

class PlayState extends State {
    constructor(game) {
        super();
        this.name = 'playstate';
        this.game = game;
        this.xOffset = 0;
        this.yOffset = this.game.config.cellSize;
        this.snake = new Snake(this.xOffset, this.yOffset, this.game.config.cellSize);
        this.food = new Food(this.xOffset, this.yOffset, this.game.config.cellSize);
        this.tickSpeed = this.minTickSpeed = 50;
        this.maxTickSpeed = 300;
        this.totalCells = Math.floor(p5i.width / this.game.config.cellSize) * Math.floor(p5i.height / this.game.config.cellSize);
        this.paused = false;
    }

    onEnter() {
        this.previousMousePressed = p5i.mousePressed;
        this.previousKeyPressed = p5i.keyPressed;

        if (window.getParameterByName('cheat') != null) {
            p5i.mousePressed = () => {
                this.snake.addTail();
            };
        } else {
            p5i.mousePressed = null;
        }

        p5i.keyPressed = () => {
            if (p5i.keyCode === p5i.SPACEBAR) {
                this.paused = !this.paused;
            }

            if (!this.paused) {
                if (p5i.keyCode === p5i.UP_ARROW) {
                    this.snake.addDirectionChange(0, -this.game.config.cellSize);
                } else if (p5i.keyCode === p5i.DOWN_ARROW) {
                    this.snake.addDirectionChange(0, this.game.config.cellSize);
                } else if (p5i.keyCode === p5i.RIGHT_ARROW) {
                    this.snake.addDirectionChange(this.game.config.cellSize, 0);
                } else if (p5i.keyCode === p5i.LEFT_ARROW) {
                    this.snake.addDirectionChange(-this.game.config.cellSize, 0);
                }
            }
        };
    }

    onExit() {
        p5i.mousePressed = this.previousMousePressed;
        p5i.keyPressed = this.previousKeyPressed;
    }

    update() {
        if (!this.paused) {
            // The tick speed ranges (ms between updates) from this.minTickSpeed to this.maxTickSpeed proportionally to snake size
            this.tickSpeed = this.maxTickSpeed - Math.floor((((this.maxTickSpeed - this.minTickSpeed) * this.snake.total) / this.totalCells));

            // Tick determines the moviment speed of the game and snake.
            p5i.tick(() => {
                // Check if the snake has eaten the food
                if (this.snake.eat(this.food)) {
                    do {
                        this.food.setRandomLocation();
                    } while (this.snake.collides(this.food.x, this.food.y));
                }

                // Then update the snake position and size
                this.snake.update();

                // Check if snake is dead
                const score = this.snake.total - 1;
                if (this.snake.dieOnCollision()) {
                    this.game.stateManager.pop();
                    this.game.stateManager.push(new ScoreState(this.game, score));
                }
            }, this.tickSpeed);
        }
    }

    render() {
        p5i.push();

        // Background
        p5i.background(p5i.colorFromSelector('.color-background'));

        // Top bar
        p5i.noStroke();
        p5i.fill(p5i.colorFromSelector('.color-top-bar-background'));
        p5i.rect(0, 0, p5i.width, this.game.config.cellSize);

        // Top bar text    
        p5i.noStroke();
        p5i.textSize(14);
        p5i.fill(p5i.colorFromSelector('.color-top-bar-foreground'));
        p5i.textAlign(p5i.RIGHT, p5i.CENTER);
        p5i.text('Score: ' + (this.snake.total - 1), 4, 2, p5i.width - 4, this.game.config.cellSize - 2);
        p5i.textAlign(p5i.LEFT, p5i.CENTER);
        p5i.text('Mini snake game', 4, 2, p5i.width - 4, this.game.config.cellSize - 2);

        // Render food and snake                
        this.food.render();
        this.snake.render();

        if (this.paused) {
            p5i.fill(255, 255, 255, 150); // Transparent white
            p5i.rect(0, 0, p5i.width, p5i.height);
            p5i.textSize(60);
            p5i.fill(p5i.colorFromSelector('.color-text'));
            p5i.textAlign(p5i.CENTER, p5i.CENTER);
            p5i.text('Paused', 0, 0, p5i.width, p5i.height);

            p5i.textSize(14);
            p5i.fill(p5i.colorFromSelector('.color-text'));
            p5i.textAlign(p5i.CENTER, p5i.CENTER);
            p5i.textStyle(p5i.BOLD);
            p5i.text('Use <arrows> to move and <space> to pause.', 0, (p5i.height / 4), p5i.width, p5i.height);
        }

        p5i.pop();
    }
}

module.exports = PlayState;