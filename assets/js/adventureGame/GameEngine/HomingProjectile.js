class HomingProjectile {
    constructor(x, y, target, gameEnv, speed = 5, turnRate = 0.08) {
        this.gameEnv = gameEnv;
        this.target = target;
        this.speed = speed;
        this.turnRate = turnRate;
        this.radius = 10;
        this.baseRadius = 10;
        this.color = "red";
        this.active = true;
        this.exploding = false;
        this.impactFrames = 0;

        this.position = { x: x, y: y };

        if (!target || !target.position) {
            console.warn('HomingProjectile: Invalid target provided');
            this.active = false;
            return;
        }

        const dx = target.position.x - x;
        const dy = target.position.y - y;
        const angle = Math.atan2(dy, dx);
        this.velocity = {
            x: Math.cos(angle) * speed,
            y: Math.sin(angle) * speed
        };

        console.log(`Projectile created at (${Math.round(x)}, ${Math.round(y)}) targeting ${target.spriteData?.id || 'Unknown'}`);
    }

    update() {
        if (!this.active && !this.exploding) {
            this.markForRemoval();
            return;
        }

        if (this.exploding) {
            this.impactFrames++;
            if (this.impactFrames > 30) {
                this.markForRemoval();
            }
            this.draw();
            return;
        }

        if (!this.target || !this.target.position) {
            this.active = false;
            this.markForRemoval();
            return;
        }

        if (isNaN(this.position.x) || isNaN(this.position.y)) {
            console.error(`Invalid projectile position: x=${this.position.x}, y=${this.position.y}`);
            this.markForRemoval();
            return;
        }

        const dx = this.target.position.x - this.position.x;
        const dy = this.target.position.y - this.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.radius + 20) {
            this.active = false;
            this.exploding = true;
            this.impactFrames = 0;
            console.log('Projectile hit target!');
            return;
        }

        const targetAngle = Math.atan2(dy, dx);
        const currentAngle = Math.atan2(this.velocity.y, this.velocity.x);
        let angleDiff = targetAngle - currentAngle;
        while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
        while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;

        const newAngle = currentAngle + this.turnRate * angleDiff;
        this.velocity.x = Math.cos(newAngle) * this.speed;
        this.velocity.y = Math.sin(newAngle) * this.speed;

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if (this.gameEnv && (this.position.x < -50 || this.position.x > this.gameEnv.innerWidth + 50 ||
            this.position.y < -50 || this.position.y > this.gameEnv.innerHeight + 50)) {
            this.active = false;
            this.markForRemoval();
            return;
        }

        this.draw();
    }

    draw() {
        const ctx = this.gameEnv?.ctx;
        if (!ctx) return;

        ctx.save();

        if (this.exploding) {
            const alpha = 1 - (this.impactFrames / 30);
            const explosionRadius = this.radius + this.impactFrames * 1.5;

            ctx.beginPath();
            ctx.arc(this.position.x, this.position.y, explosionRadius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 100, 100, ${alpha})`;
            ctx.fill();
            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.lineWidth = 2;
            ctx.stroke();
        } else {
            // Pulsing effect while moving
            const pulse = Math.sin(Date.now() / 100) * 2;
            const drawRadius = this.baseRadius + pulse;

            ctx.beginPath();
            ctx.arc(this.position.x, this.position.y, drawRadius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();

            ctx.strokeStyle = 'black';
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(this.position.x, this.position.y, drawRadius - 4, 0, Math.PI * 2);
            ctx.fillStyle = 'white';
            ctx.fill();
        }

        ctx.restore();
    }

    markForRemoval() {
        if (this.gameEnv?.gameObjects) {
            const index = this.gameEnv.gameObjects.indexOf(this);
            if (index > -1) {
                this.gameEnv.gameObjects.splice(index, 1);
            }
        }
    }

    shouldRemove() {
        return !this.active && !this.exploding;
    }

    destroy() {
        this.active = false;
    }
}

export default HomingProjectile;
