const State = require('./state.js');

class ScoreState extends State {
    constructor(game, score) {
        super();
        this.game = game;
        this.score = score;
    }

    onEnter() {
        this.previousMousePressed = p.mousePressed;
        this.previousKeyPressed = p.keyPressed;

        p.mousePressed = () => {
            this.return();
        }

        p.keyPressed = () => {
            this.return();            
        }
    }

    return() {
        this.game.stateManager.pop();
    }

    onExit() {
        p.mousePressed = this.previousMousePressed;
        p.keyPressed = this.previousKeyPressed;
    }

    render() {
        p.push();

        // Background
        p.background('#474749');

        p.textSize(60);
        p.fill('#45E700');
        p.textAlign(p.CENTER,p.BOTTOM);
        p.text('Score: ' + (this.score - 1), 0, 0, this.game.config.width, this.game.config.height / 2);

        p.textSize(20);
        p.fill('#4AC117');
        p.textAlign(p.CENTER,p.TOP);
        p.textStyle(p.ITALIC);
        p.text('Press any key to return to menu...', 0, this.game.config.height / 2, this.game.config.width, this.game.config.height / 2 );         

        p.pop();
    }

}

module.exports = ScoreState;