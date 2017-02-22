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
        this.tickSpeed = 50;
        this.totalCells = Math.floor(p.width / this.game.config.cellSize) * Math.floor(p.height / this.game.config.cellSize);
    }

    onEnter() {
        this.previousMousePressed = p.mousePressed;
        this.previousKeyPressed = p.keyPressed;
        p.mousePressed = () => {
            this.snake.addTail();
        }

        p.keyPressed = () => {
            if (p.keyCode === p.UP_ARROW) {
                this.snake.addDirectionChange(0, -this.game.config.cellSize);
            } else if (p.keyCode === p.DOWN_ARROW) {
                this.snake.addDirectionChange(0, this.game.config.cellSize);
            } else if (p.keyCode === p.RIGHT_ARROW) {
                this.snake.addDirectionChange(this.game.config.cellSize, 0);
            } else if (p.keyCode === p.LEFT_ARROW) {
                this.snake.addDirectionChange(-this.game.config.cellSize, 0);
            }
        }
    }

    onExit() {
        p.mousePressed = this.previousMousePressed;
        p.keyPressed = this.previousKeyPressed;
    }

    update() {
        this.tickSpeed = 300 - Math.floor(((250 * this.snake.total) / this.totalCells))
        p.tick(() => {
            if (this.snake.eat(this.food)) {
                do {
                    this.food.setRandomLocation();
                } while (this.snake.collides(this.food.x, this.food.y))
            }
            this.snake.update();
            const score = this.snake.total;
            if (this.snake.dieOnCollision()) {
                this.game.stateManager.pop();
                this.game.stateManager.push(new ScoreState(this.game, score));
            }
        }, this.tickSpeed)
    }

    render() {
        p.push();

        // Background
        p.background(p.cssColor('.color-primary-4'));

        // Top bar
        p.fill(p.cssColor('.color-secondary-1-2'));
        p.rect(0, 0, p.width, this.game.config.cellSize);

        // Top bar text    
        p.textSize(14)
        p.fill(p.cssColor('.color-secondary-1-4'));
        p.textAlign(p.RIGHT, p.CENTER);
        p.text('Score: ' + (this.snake.total - 1), 4, 2, p.width - 4, this.game.config.cellSize - 2);
        p.textAlign(p.LEFT, p.CENTER);
        p.text('Mini snake game', 4, 2, p.width - 4, this.game.config.cellSize - 2);

        // Render food and snake        
        this.snake.render();
        this.food.render();

        p.pop();
    }
}

module.exports = PlayState;