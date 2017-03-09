const Population = require('./population.js');

class World {
    constructor(canvasElementID) {
        this.config = {
            width: 600,
            height: 600,
            FPS: 30,
            canvasElementID: canvasElementID
        };
        this.population = null;
        this.lifeP = null;
        this.count = 0;
        this.lifespan = this.config.height;
        this.generation = 1;
        this.target = {
            x: this.config.width / 2,
            y: 50,
            diameter: 16            
        };
        this.obstacle = {
            x: 100,
            y: 350,
            width: 400,
            height: 10
        };
    }

    setup() {
        // Canvas
        p5i.createCanvas(this.config.width, this.config.height);
        p5i.frameRate(this.config.FPS);

        // Debug element
        this.lifeP = p5i.createP();
        this.population = new Population(this.target, this.obstacle);

        // p5        
        p5i.draw = this.render.bind(this);
        let loop = () => {
            this.update();
            setTimeout(loop);
        };
        loop();
    }

    update() {
        this.population.update(this.count);

        this.count++;
        if (this.count == this.lifespan) {
            this.generation++;
            this.population.evaluate();
            this.population.selection();
            this.count = 0;
        }
    }

    render() {
        p5i.background(0);

        this.lifeP.html(
            'Generation: ' + this.generation +
            '<br/>Life span: ' + this.count +
            '<br/> Deaths: ' + this.population.rockets.reduce((crashes, rocket) => { return crashes + (rocket.crashed ? 1 : 0); }, 0) +
            '<br/> Hits: ' + this.population.rockets.reduce((hits, rocket) => { return hits + (rocket.completed ? 1 : 0); }, 0)
        );
        
        this.population.render();

        p5i.fill(255);
        p5i.rect(this.obstacle.x, this.obstacle.y, this.obstacle.width, this.obstacle.height);
        p5i.ellipse(this.target.x, this.target.y, this.target.diameter);
    }
}

module.exports = World;