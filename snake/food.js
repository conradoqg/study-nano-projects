class Food {
    constructor(size) {
        this.x = p.offsetX;
        this.y = p.offsetY;
        this.size = size;
        this.setRandomLocation();
    }

    setRandomLocation() {
        let cols = Math.floor((p.width - p.offsetX) / this.size);
        let rows = Math.floor((p.height - p.offsetY) / this.size);
        this.x = (Math.floor(p.random(cols)) * this.size) + p.offsetX;
        this.y = (Math.floor(p.random(rows)) * this.size) + p.offsetY;
    }

    render() {
        p.push();
        p.stroke('#F4002B')
        p.fill('#D21A3B');
        p.ellipse(this.x + (this.size / 2), this.y + (this.size / 2), this.size / 1.5, this.size / 1.5);
        p.pop();
    }
}

module.exports = Food;