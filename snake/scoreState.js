const State = require('./state.js');

class ScoreState extends State {
    constructor(game, score) {
        super();
        this.game = game;
        this.score = score;
    }

    onEnter() {
        this.previousMousePressed = p5.mousePressed;
        this.previousKeyPressed = p5.keyPressed;

        p5.mousePressed = () => {
            this.return();
        }

        p5.keyPressed = () => {
            this.return();
        }
    }

    return() {
        this.game.stateManager.pop();
    }

    onExit() {
        p5.mousePressed = this.previousMousePressed;
        p5.keyPressed = this.previousKeyPressed;
    }

    render() {
        p5.push();

        // Background
        p5.background(p5.colorFromSelector('.color-primary-4'));

        // Texts
        p5.textSize(60);
        p5.fill(p5.colorFromSelector('.color-complement-2'));
        p5.textAlign(p5.CENTER, p5.BOTTOM);
        p5.text('Score: ' + (this.score - 1), 0, 0, this.game.config.width, this.game.config.height / 2);

        p5.textSize(20);
        p5.fill(p5.colorFromSelector('.color-complement-3'));
        p5.textAlign(p5.CENTER, p5.TOP);
        p5.textStyle(p5.ITALIC);
        p5.text('Press any key to return to menu...', 0, this.game.config.height / 2, this.game.config.width, this.game.config.height / 2);

        p5.pop();
    }

}

module.exports = ScoreState;