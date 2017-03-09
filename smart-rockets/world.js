const Population = require('./population.js');

class World {
    constructor(canvasElementID) {
        this.config = {
            width: 600,
            height: 600,
            FPS: 60,
            canvasElementID: canvasElementID
        };
        this.population = null;
        this.lifeP = null;
        this.count = 0;
        this.lifespan = this.config.height;
        this.target = {
            x: this.config.width / 2,
            y: 50,
            width: 16,
            height: 16
        };
        this.obstacle = {
            x: 100,
            y: 150,
            width: 200,
            height: 10
        };
    }

    setup() {
        p5i.createCanvas(this.config.width, this.config.height);
        p5i.frameRate(this.config.FPS);
        this.lifeP = p5i.createP();
        this.population = new Population(this.target, this.obstacle);
        p5i.draw = this.draw.bind(this);
    }

    draw() {
        this.update();
        this.render();
    }

    update() {

    }

    render() {
        p5i.background(0);
        this.population.run(this.count);
        this.lifeP.html(this.count);

        this.count++;
        if (this.count == this.lifespan) {
            this.population.evaluate();
            this.population.selection();
            this.count = 0;
        }

        p5i.fill(255);
        p5i.rect(this.obstacle.x, this.obstacle.y, this.obstacle.width, this.obstacle.height);

        p5i.ellipse(this.target.x, this.target.y, this.target.width, this.target.height);
        console.log(p5i.frameRate());
    }

    setupp5i() {
        let self = this;
        p5.disableFriendlyErrors = true;

        new p5((p5iinstance) => {
            p5iinstance.setup = self.setup.bind(self);
            window.p5i = p5iinstance;
        }, this.config.canvasElementID);
    }

    init() {
        this.setupp5i();
    }
}

module.exports = World;