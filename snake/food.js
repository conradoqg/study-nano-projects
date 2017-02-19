class Food {
    constructor(size) {
        this.x = 0
        this.y = 0;
        this.size = size;
        this.setRandomLocation();
    }

    setRandomLocation() {
        let cols = p.floor(p.width / this.size);
        let rows = p.floor(p.height / this.size);
        this.x = p.floor(p.random(cols)) * this.size;
        this.y = p.floor(p.random(rows)) * this.size;
    }

    draw() {
        p.fill(255, 0, 100);
        p.rect(this.x, this.y, this.size, this.size);
    }
}

module.exports = Food;