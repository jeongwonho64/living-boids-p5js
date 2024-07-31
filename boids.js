class Boid {
    constructor(a, b, c, mousePressed) {
        this.position = random([
            createVector(random(width), random(height / 2 - 50)),
            createVector(random(width), random(height / 2 + 50, height)),
        ]);
        this.velocity = p5.Vector.random2D();
        this.acceleration = createVector();
        this.maxForce = 0.2;
        this.maxSpeed = 4;
        this.filler = createVector(a, b, c);
        this.health = b;
        this.r = 16;
        this.dead = false;
        this.moused = mousePressed;
        if (this.moused == true) {
            this.position.set(mouseX, mouseY);
        }
        this.fossils = [];
        this.showDead = true;
        this.frazme = 0;
    }

    update() {
        this.position.add(this.velocity);
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed);
        this.acceleration.mult(0);

        // Wrap around the canvas
        if (this.position.x > width) {
            this.position.x = 0;
        } else if (this.position.x < 0) {
            this.position.x = width;
        }
        if (this.position.y > height) {
            this.position.y = 0;
        } else if (this.position.y < 0) {
            this.position.y = height;
        }
    }

    applyForce(force) {
        this.acceleration.add(force);
    }

    show(g) {
        if (g == "eagle") {
            let theta = this.velocity.heading() + PI / 2;
            stroke(255);
            strokeWeight(2);
            fill(255, 255, 255, 50);
            push();
            translate(this.position.x, this.position.y);
            fill(this.filler.x, this.filler.y, this.filler.z, 75);
            rotate(theta);
            beginShape();
            vertex(0, -this.r);
            vertex(this.r / 2, this.r);
            vertex(-this.r / 2, this.r);
            endShape(CLOSE);
            pop();
        }

        if (this.health > 40 && this.dead == false) {
            let theta = this.velocity.heading() + PI / 2;
            stroke(255);
            strokeWeight(2);
            fill(255, 255, 255, 50);
            push();
            translate(this.position.x, this.position.y);
            fill(this.filler.x, this.filler.y, this.filler.z, 75);
            rotate(theta);
            beginShape();
            vertex(0, -this.r);
            vertex(this.r / 2, this.r);
            vertex(-this.r / 2, this.r);
            endShape(CLOSE);
            pop();
        }

        if (this.fossils.length != 0 && this.showDead == true) {
            for (let frag of this.fossils) {
                frag.move();
                frag.display();
            }
            if (this.frazme == 25) {
                this.showDead = false;
            } else {
                this.frazme += 1;
            }
        }

        if (
            (this.health < 40 && g == "boid") ||
            (this.health < 10 && g == "ringleads")
        ) {
            this.dead = true;
            for (let i = 0; i < 10; i++) {
                let piece = new subBoid(
                    this.position.x,
                    this.position.y,
                    random(-0.75, 0.75),
                    random(-0.75, 0.75),
                    random(0.25, 8)
                );
                this.fossils.push(piece);
            }
        }
    }

    separation(boids, c) {
        let perceptionRadius = c;
        let steering = createVector();
        let total = 0;

        for (const other of boids) {
            let distance = dist(
                this.position.x,
                this.position.y,
                other.position.x,
                other.position.y
            );

            if (
                other !== this &&
                distance < perceptionRadius &&
                other.dead == false
            ) {
                let difference = p5.Vector.sub(this.position, other.position);
                difference.div(distance);
                steering.add(difference);
                total++;
            }
        }

        if (total > 0) {
            steering.div(total); //redundant, but still
            steering.setMag(this.maxSpeed); //desired velocity
            steering.sub(this.velocity); //calculate force
            steering.limit(this.maxForce);
        }

        return steering;
    }

    avoidance(boids) {
        let perceptionRadius = 150;
        let steering = createVector();
        let total = 0;

        for (const other of boids) {
            let distance = dist(
                this.position.x,
                this.position.y,
                other.position.x,
                other.position.y
            );

            if (
                other !== this &&
                distance < perceptionRadius &&
                other.dead == false
            ) {
                let difference = p5.Vector.sub(this.position, other.position);
                difference.div(distance);
                steering.add(difference);
                total++;
            }
        }

        if (total > 0) {
            steering.div(total); //redundant, but still
            steering.setMag(this.maxSpeed); //desired velocity
            steering.sub(this.velocity); //calculate force
            steering.limit(this.maxForce);
        }

        return steering;
    }

    cohesion(boids, c) {
        let perceptionRadius = c;
        let steering = createVector();
        let total = 0;

        for (const other of boids) {
            let distance = dist(
                this.position.x,
                this.position.y,
                other.position.x,
                other.position.y
            );

            if (
                other !== this &&
                distance < perceptionRadius &&
                other.dead == false
            ) {
                steering.add(other.position);
                total++;
            }
        }

        if (total > 0) {
            steering.div(total); //average
            steering.sub(this.position); //desired velocity
            steering.setMag(this.maxSpeed);
            steering.sub(this.velocity); //calculate force
            steering.limit(this.maxForce);
        }

        return steering;
    }

    follow(boids, c) {
        let perceptionRadius = c;
        let steering = createVector();
        let total = 0;

        for (const other of boids) {
            let distance = dist(
                this.position.x,
                this.position.y,
                other.position.x,
                other.position.y
            );

            if (
                other !== this &&
                distance < perceptionRadius &&
                other.dead == false
            ) {
                steering.add(other.position);
                total++;
            }
        }

        if (total > 0) {
            steering.div(total); //average
            steering.sub(this.position); //desired velocity
            steering.setMag(this.maxSpeed * 1.25);
            steering.sub(this.velocity); //calculate force
            steering.limit(this.maxForce);
        }

        return steering;
    }

    alignment(boids, c) {
        let perceptionRadius = c;
        let steering = createVector();
        let total = 0;

        for (const other of boids) {
            let distance = dist(
                this.position.x,
                this.position.y,
                other.position.x,
                other.position.y
            );

            if (
                other !== this &&
                distance < perceptionRadius &&
                other.dead == false
            ) {
                steering.add(other.velocity);
                total++;
            }
        }

        if (total > 0) {
            steering.div(total); //average
            steering.setMag(this.maxSpeed); //desired velocity
            steering.sub(this.velocity); //calculate force
            steering.limit(this.maxForce);
        }

        return steering;
    }

    sedia(boids, c) {
        let perceptionRadius = c;
        let steering = createVector();
        let total = 0;

        for (const other of boids) {
            let distance = dist(
                this.position.x,
                this.position.y,
                other.position.x,
                other.position.y
            );

            if (
                other !== this &&
                distance < perceptionRadius &&
                other.dead == false
            ) {
                steering.add(other.velocity);
                total++;
            }
        }

        if (total > 0) {
            steering.div(total); //average
            steering.setMag(this.maxSpeed); //desired velocity
            steering.sub(this.velocity); //calculate force
            steering.limit(this.maxForce);
        }

        return steering;
    }
}
