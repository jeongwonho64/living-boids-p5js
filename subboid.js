class subBoid {
    constructor(x, y, dirX, dirY, size) {
        this.x = x;
        this.y = y;
        this.dirX = dirX;
        this.dirY = dirY;
        this.size = size;
        this.alp = 255;
    }

    move() {
        this.x += this.dirX;
        this.y += this.dirY;
        this.alp -= 51; // Reduce alpha to make pieces disappear
    }

    display() {
        push();
        fill(255, 0, 0, this.alp);
        noStroke();
        ellipse(this.x, this.y, this.size);
        pop();
    }
}
