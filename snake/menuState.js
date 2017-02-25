const State = require('./state.js');
const PlayState = require('./playState.js');

class MenuState extends State {
    constructor(game) {
        super();
        this.name = 'menustate';
        this.game = game;
    }

    onEnter() {
        p5.mousePressed = () => {
            this.play();
        };

        p5.keyPressed = () => {
            this.play();
        };
    }

    onExit() {
        p5.mousePressed = null;
        p5.keyPressed = null;
    }

    update() { }

    play() {
        this.game.stateManager.push(new PlayState(this.game));
    }

    render() {
        p5.push();

        // Background
        p5.background(p5.colorFromSelector('.color-background'));

        // Texts
        p5.textSize(60);
        p5.fill(p5.colorFromSelector('.color-text'));
        p5.textAlign(p5.CENTER, p5.BOTTOM);
        p5.text('Snake Game', 0, 0, p5.width, p5.height / 2);

        p5.textSize(20);
        p5.fill(p5.colorFromSelector('.color-sub-text'));
        p5.textAlign(p5.CENTER, p5.TOP);
        p5.textStyle(p5.ITALIC);
        p5.text('Press any key to start...', 0, p5.height / 2, p5.width, p5.height / 2);

        p5.textSize(14);
        p5.fill(p5.colorFromSelector('.color-text'));
        p5.textAlign(p5.CENTER, p5.CENTER);
        p5.textStyle(p5.BOLD);
        p5.text('Use <arrows> to move and <space> to pause.', 0, (p5.height / 4), p5.width, p5.height);

        p5.pop();
    }
}

module.exports = MenuState;