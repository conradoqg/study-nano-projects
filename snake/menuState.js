const State = require('./state.js');
const PlayState = require('./playState.js');

class MenuState extends State {
    constructor(game) {
        super();
        this.name = 'menustate';
        this.game = game;
    }

    onEnter() {
        p5i.mousePressed = () => {
            this.play();
        };

        p5i.keyPressed = () => {
            this.play();
        };
    }

    onExit() {
        p5i.mousePressed = null;
        p5i.keyPressed = null;
    }

    update() { }

    play() {
        this.game.stateManager.push(new PlayState(this.game));
    }

    render() {
        p5i.push();

        // Background
        p5i.background(p5i.colorFromSelector('.color-background'));

        // Texts
        p5i.textSize(60);
        p5i.fill(p5i.colorFromSelector('.color-text'));
        p5i.textAlign(p5i.CENTER, p5i.BOTTOM);
        p5i.text('Snake Game', 0, 0, p5i.width, p5i.height / 2);

        p5i.textSize(20);
        p5i.fill(p5i.colorFromSelector('.color-sub-text'));
        p5i.textAlign(p5i.CENTER, p5i.TOP);
        p5i.textStyle(p5i.ITALIC);
        p5i.text('Press any key to start...', 0, p5i.height / 2, p5i.width, p5i.height / 2);

        p5i.textSize(14);
        p5i.fill(p5i.colorFromSelector('.color-text'));
        p5i.textAlign(p5i.CENTER, p5i.CENTER);
        p5i.textStyle(p5i.BOLD);
        p5i.text('Use <arrows> to move and <space> to pause.', 0, (p5i.height / 4), p5i.width, p5i.height);

        p5i.pop();
    }
}

module.exports = MenuState;