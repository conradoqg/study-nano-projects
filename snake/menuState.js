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
        }

        p5.keyPressed = () => {
            this.play();            
        }
    }

    onExit() {
        p5.mousePressed = null;
        p5.keyPressed = null;
    }

    update() {}

    play() {
        this.game.stateManager.push(new PlayState(this.game));
    }

    render() {
        p5.push();

        // Background
        p5.background(p5.colorFromSelector('.color-primary-4'));

        // Texts
        p5.textSize(60);
        p5.fill(p5.colorFromSelector('.color-complement-2'));
        p5.textAlign(p5.CENTER,p5.BOTTOM);
        p5.text('Snake Game', 0, 0, this.game.config.width, this.game.config.height / 2);

        p5.textSize(20);
        p5.fill(p5.colorFromSelector('.color-complement-3'));
        p5.textAlign(p5.CENTER,p5.TOP);
        p5.textStyle(p5.ITALIC);
        p5.text('Press any key to start...', 0, this.game.config.height / 2, this.game.config.width, this.game.config.height / 2 );        

        p5.pop();
    }
}

module.exports = MenuState;