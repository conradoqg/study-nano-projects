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
        let cols = Math.floor((p5i.width - this.xOffset) / this.size);
        let rows = Math.floor((p5i.height - this.yOffset) / this.size);
        this.x = (Math.floor(p5i.random(cols)) * this.size) + this.xOffset;
        this.y = (Math.floor(p5i.random(rows)) * this.size) + this.yOffset;
    }

    render() {
        p5i.push();                     
        p5i.noStroke();
        p5i.fill(p5i.colorFromSelector('.color-food'));
        p5i.ellipse(this.x + (this.size / 2), this.y + (this.size / 2), this.size / 1.5, this.size / 1.5);
        p5i.pop();
    }
}

module.exports = Food;