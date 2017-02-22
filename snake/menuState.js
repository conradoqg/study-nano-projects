const State = require('./state.js');
const PlayState = require('./playState.js');

class MenuState extends State {
    constructor(game) {
        super();
        this.name = 'menustate';
        this.game = game;
    }

    onEnter() {
        p.mousePressed = () => {
            this.play();
        }

        p.keyPressed = () => {
            this.play();            
        }
    }

    onExit() {
        p.mousePressed = null;
        p.keyPressed = null;
    }

    update() {}

    play() {
        this.game.stateManager.push(new PlayState(this.game));
    }

    render() {
        p.push();

        // Background
        p.background(p.cssColor('.color-primary-4'));

        p.textSize(60);
        p.fill(p.cssColor('.color-complement-2'));
        p.textAlign(p.CENTER,p.BOTTOM);
        p.text('Snake Game', 0, 0, this.game.config.width, this.game.config.height / 2);

        p.textSize(20);
        p.fill(p.cssColor('.color-complement-3'));
        p.textAlign(p.CENTER,p.TOP);
        p.textStyle(p.ITALIC);
        p.text('Press any key to start...', 0, this.game.config.height / 2, this.game.config.width, this.game.config.height / 2 );        

        p.pop();
    }
}

module.exports = MenuState;