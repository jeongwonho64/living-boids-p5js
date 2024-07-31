class objec {
    constructor(x, y) {
        this.position = createVector(x, y);
        this.r = 50;
    }

    show() {
        push();
        rectMode(CENTER);
        square(this.position.x, this.position.y, this.r * 2);
        textAlign(CENTER);
        textSize(this.r);
        stroke("white");
        strokeWeight(0.5);
        text("Al", this.position.x, this.position.y + this.r / 4);
        pop();
    }
}
