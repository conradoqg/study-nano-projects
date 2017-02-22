class Food {
    constructor(xOffset, yOffset, size) {
        this.x = xOffset;
        this.y = yOffset;
        this.xOffset = xOffset;
        this.yOffset = yOffset;
        this.size = size;
        this.setRandomLocation();
    }

    setRandomLocation() {
        let cols = Math.floor((p.width - this.xOffset) / this.size);
        let rows = Math.floor((p.height - this.yOffset) / this.size);
        this.x = (Math.floor(p.random(cols)) * this.size) + this.xOffset;
        this.y = (Math.floor(p.random(rows)) * this.size) + this.yOffset;
    }

    render() {
        p.push();                     
        p.stroke(p.cssColor('.color-primary-1'))
        p.fill(p.cssColor('.color-primary-2'));
        p.ellipse(this.x + (this.size / 2), this.y + (this.size / 2), this.size / 1.5, this.size / 1.5);
        p.pop();
    }
}

module.exports = Food;