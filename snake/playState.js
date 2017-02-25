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
        this.totalCells = Math.floor(p5.width / this.game.config.cellSize) * Math.floor(p5.height / this.game.config.cellSize);
        this.paused = false;
    }

    onEnter() {
        this.previousMousePressed = p5.mousePressed;
        this.previousKeyPressed = p5.keyPressed;
        p5.mousePressed = () => {
            this.snake.addTail();
        };

        p5.keyPressed = () => {
            if (p5.keyCode === p5.SPACEBAR) {
                this.paused = !this.paused;
            }

            if (!this.paused) {
                if (p5.keyCode === p5.UP_ARROW) {
                    this.snake.addDirectionChange(0, -this.game.config.cellSize);
                } else if (p5.keyCode === p5.DOWN_ARROW) {
                    this.snake.addDirectionChange(0, this.game.config.cellSize);
                } else if (p5.keyCode === p5.RIGHT_ARROW) {
                    this.snake.addDirectionChange(this.game.config.cellSize, 0);
                } else if (p5.keyCode === p5.LEFT_ARROW) {
                    this.snake.addDirectionChange(-this.game.config.cellSize, 0);
                }
            }
        };
    }

    onExit() {
        p5.mousePressed = this.previousMousePressed;
        p5.keyPressed = this.previousKeyPressed;
    }

    update() {
        if (!this.paused) {
            // The tick speed ranges (ms between updates) from this.minTickSpeed to this.maxTickSpeed proportionally to snake size
            this.tickSpeed = this.maxTickSpeed - Math.floor((((this.maxTickSpeed - this.minTickSpeed) * this.snake.total) / this.totalCells));

            // Tick determines the moviment speed of the game and snake.
            p5.tick(() => {
                // Check if the snake has eaten the food
                if (this.snake.eat(this.food)) {
                    do {
                        this.food.setRandomLocation();
                    } while (this.snake.collides(this.food.x, this.food.y));
                }

                // Then update the snake position and size
                this.snake.update();

                // Check if snake is dead
                const score = this.snake.total;
                if (this.snake.dieOnCollision()) {
                    this.game.stateManager.pop();
                    this.game.stateManager.push(new ScoreState(this.game, score));
                }
            }, this.tickSpeed);
        }
    }

    render() {
        p5.push();

        // Background
        p5.background(p5.colorFromSelector('.color-background'));

        // Top bar
        p5.noStroke();
        p5.fill(p5.colorFromSelector('.color-top-bar-background'));
        p5.rect(0, 0, p5.width, this.game.config.cellSize);

        // Top bar text    
        p5.noStroke();
        p5.textSize(14);
        p5.fill(p5.colorFromSelector('.color-top-bar-foreground'));
        p5.textAlign(p5.RIGHT, p5.CENTER);
        p5.text('Score: ' + (this.snake.total - 1), 4, 2, p5.width - 4, this.game.config.cellSize - 2);
        p5.textAlign(p5.LEFT, p5.CENTER);
        p5.text('Mini snake game', 4, 2, p5.width - 4, this.game.config.cellSize - 2);

        // Render food and snake                
        this.food.render();
        this.snake.render();

        if (this.paused) {
            p5.fill(255, 255, 255, 150); // Transparent white
            p5.rect(0, 0, p5.width, p5.height);
            p5.textSize(60);
            p5.fill(p5.colorFromSelector('.color-text'));
            p5.textAlign(p5.CENTER, p5.CENTER);
            p5.text('Paused', 0, 0, p5.width, p5.height);

            p5.textSize(14);
            p5.fill(p5.colorFromSelector('.color-text'));
            p5.textAlign(p5.CENTER, p5.CENTER);
            p5.textStyle(p5.BOLD);
            p5.text('Use <arrows> to move and <space> to pause.', 0, (p5.height / 4), p5.width, p5.height);
        }

        p5.pop();
    }
}

module.exports = PlayState;