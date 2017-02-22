const StateStack = require('./stateStack.js');
const MenuState = require('./menuState.js');

class Game {
    constructor(canvasElementID) {
        this.config = {
            width: 600,
            height: 620,
            cellSize: 20,
            FPS: 30,
            canvasElementID: canvasElementID
        }

        this.stateManager = new StateStack();
    }

    setup() {
        this.p5.createCanvas(this.config.width, this.config.height + this.config.cellSize);        
        this.p5.frameRate(this.config.FPS);
        this.p5.draw = this.draw.bind(this);
        this.stateManager.push(new MenuState(this));
    }

    draw() {
        this.update();
        this.render();
    }

    update() {
        this.stateManager.update();
    }

    render() {
        this.stateManager.render();
    }

    setupP5() {
        let self = this;
        p5.disableFriendlyErrors = true;
        new p5((p5instance) => {
            p5instance.setup = self.setup.bind(self);
            p5instance.tick = tick;
            p5instance.cssColor = findColorProperty;
            window.p = p5instance;
            self.p5 = p5instance;
        }, this.config.canvasElementID);
    }

    init() {
        this.setupP5();
    }
}

let timer = 0;
function tick(fn, interval) {
    const currMillis = p.millis();
    if (timer < currMillis - interval || timer == 0) {
        fn();
        timer = currMillis;
    }
}

let colorCache = [];
function findColorProperty(selector) {
    if (colorCache[selector] != null) return colorCache[selector];
    rules = document.styleSheets[0].cssRules;
    for (i in rules) {        
        if (rules[i].selectorText == selector) {
            let color = rules[i].style.color;
            colorCache[selector] = color;
            return color; // Get color property specifically
        }
    }
    return "#FFFFFF";
}

module.exports = Game;