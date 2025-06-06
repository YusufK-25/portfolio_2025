class GhastFireball {
    constructor(x, y, target, gameEnv, speed = 3, turnRate = 0.06) {
        this.gameEnv = gameEnv;
        this.target = target;
        this.speed = speed;
        this.turnRate = turnRate;
        this.radius = 15;
        this.baseRadius = 15;
        this.color = "#FF4500"; // Orange-red fireball color
        this.active = true;
        this.exploding = false;
        this.impactFrames = 0;
        this.maxImpactFrames = 45;
        
        // Fireball trail effect
        this.trail = [];
        this.maxTrailLength = 8;
        
        // Particle effects
        this.particles = [];
        this.maxParticles = 6;
        
        this.position = { x: x, y: y };

        // Add sprite data for compatibility with game engine
        this.spriteData = {
            id: 'Ghast-Fireball',
            canBeHitBack: true,
            damagePlayer: true,
            damageGhast: false,
            hitBackSpeed: 6
        };


        this.element = null; // No DOM element needed for canvas-based projectile
        this.size = { width: this.radius * 2, height: this.radius * 2 };
        this.state = { collisionEvents: [] };

        this.canvas = document.createElement('canvas');
        this.canvas.width = gameEnv.innerWidth;
        this.canvas.height = gameEnv.innerHeight;
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '10';
        this.canvas.id = `fireball-canvas-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        this.ctx = this.canvas.getContext('2d');
        
        // Add canvas to game container
        if (gameEnv.gameContainer) {
            gameEnv.gameContainer.appendChild(this.canvas);
        } else {
            document.getElementById('gameContainer')?.appendChild(this.canvas);
        }

        if (!target || !target.position) {
            console.warn('GhastFireball: Invalid target provided');
            this.active = false;
            return;
        }

        // Calculate initial velocity toward target
        const dx = target.position.x - x;
        const dy = target.position.y - y;
        const angle = Math.atan2(dy, dx);
        this.velocity = {
            x: Math.cos(angle) * speed,
            y: Math.sin(angle) * speed
        };

        console.log(`🔥 GhastFireball created at (${Math.round(x)}, ${Math.round(y)}) targeting ${target.spriteData?.id || 'Player'}`);
    }

    update() {
        if (!this.active && !this.exploding) {
            return;
        }

        if (this.exploding) {
            this.updateExplosion();
            return;
        }

        // Check for invalid position
        if (isNaN(this.position.x) || isNaN(this.position.y)) {
            console.error(`❌ Invalid GhastFireball position: x=${this.position.x}, y=${this.position.y}`);
            this.explode();
            return;
        }

        // Check if target still exists and is valid
        if (!this.target || !this.target.position || !this.target.spriteData) {
            console.log('🎯 GhastFireball: Target lost, exploding');
            this.explode();
            return;
        }

        // Calculate distance to target
        const dx = this.target.position.x - this.position.x;
        const dy = this.target.position.y - this.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Check for collision with target (player)
        const collisionDistance = this.radius + (this.target.size?.width || 30) / 2;
        if (distance < collisionDistance) {
            console.log('💥 Direct hit on player!');
            this.explode();
            this.damagePlayer();
            return;
        }

        // Homing behavior - adjust velocity toward target
        if (this.spriteData.damagePlayer) {
            // Only home in on player when targeting player
            const targetAngle = Math.atan2(dy, dx);
            const currentAngle = Math.atan2(this.velocity.y, this.velocity.x);
            
            // Calculate angle difference and normalize
            let angleDiff = targetAngle - currentAngle;
            while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
            while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;

            // Apply gradual turning
            const newAngle = currentAngle + this.turnRate * angleDiff;
            this.velocity.x = Math.cos(newAngle) * this.speed;
            this.velocity.y = Math.sin(newAngle) * this.speed;
        }

        // Update position
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        // Update visual effects
        this.updateTrail();
        this.updateParticles();

        // Check bounds - explode if too far off screen
        if (this.gameEnv && (
            this.position.x < -100 || this.position.x > this.gameEnv.innerWidth + 100 ||
            this.position.y < -100 || this.position.y > this.gameEnv.innerHeight + 100
        )) {
            console.log('🌊 Fireball went off screen, exploding');
            this.explode();
            return;
        }

        // CRITICAL: Call draw method every frame
        this.draw();
    }

    // FIXED: Reliable draw method that clears and redraws
    draw() {
        if (!this.ctx) {
            console.warn('❌ GhastFireball: No canvas context available');
            return;
        }

        // Clear the entire canvas for this fireball
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.save();
        this.ctx.globalCompositeOperation = 'source-over';

        if (this.exploding) {
            this.drawExplosion(this.ctx);
        } else {
            this.drawTrail(this.ctx);
            this.drawParticles(this.ctx);
            this.drawFireball(this.ctx);
        }

        this.ctx.restore();
    }

    // ADDED: Standard draw method for game engine compatibility
    resize() {
        if (this.canvas && this.gameEnv) {
            this.canvas.width = this.gameEnv.innerWidth;
            this.canvas.height = this.gameEnv.innerHeight;
        }
    }

    updateTrail() {
        // Add current position to trail
        this.trail.unshift({ 
            x: this.position.x, 
            y: this.position.y,
            alpha: 1.0
        });
        
        // Remove old trail points
        if (this.trail.length > this.maxTrailLength) {
            this.trail.pop();
        }
        
        // Fade trail points
        this.trail.forEach((point, index) => {
            point.alpha = 1.0 - (index / this.maxTrailLength);
        });
    }

    updateParticles() {
        // Add new particles
        if (this.particles.length < this.maxParticles) {
            this.particles.push({
                x: this.position.x + (Math.random() - 0.5) * 10,
                y: this.position.y + (Math.random() - 0.5) * 10,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                life: 1.0,
                decay: 0.05 + Math.random() * 0.05
            });
        }
        
        // Update existing particles
        this.particles = this.particles.filter(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life -= particle.decay;
            return particle.life > 0;
        });
    }

    updateExplosion() {
        this.impactFrames++;
        if (this.impactFrames > this.maxImpactFrames) {
            this.markForRemoval();
            return;
        }
        
        // Add explosion particles
        if (this.impactFrames < 15) {
            for (let i = 0; i < 5; i++) {
                this.particles.push({
                    x: this.position.x + (Math.random() - 0.5) * 40,
                    y: this.position.y + (Math.random() - 0.5) * 40,
                    vx: (Math.random() - 0.5) * 8,
                    vy: (Math.random() - 0.5) * 8,
                    life: 1.0,
                    decay: 0.03
                });
            }
        }
        
        this.updateParticles();
        this.draw(); // Make sure explosion is drawn
    }

    explode() {
        if (!this.exploding) {
            this.active = false;
            this.exploding = true;
            this.impactFrames = 0;
            console.log('💥 GhastFireball exploded!');
            
            // Create explosion effect particles
            for (let i = 0; i < 10; i++) {
                this.particles.push({
                    x: this.position.x + (Math.random() - 0.5) * 30,
                    y: this.position.y + (Math.random() - 0.5) * 30,
                    vx: (Math.random() - 0.5) * 10,
                    vy: (Math.random() - 0.5) * 10,
                    life: 1.5,
                    decay: 0.02
                });
            }
        }
    }

    damagePlayer() {
        if (!this.spriteData.damagePlayer) return;

        // Find and damage the player
        const players = this.gameEnv.gameObjects.filter(obj =>
            obj.constructor.name === 'Player' && obj.spriteData?.id === 'Steve'
        );

        if (players.length > 0) {
            const player = players[0];
            if (player.spriteData && typeof player.spriteData.reaction === 'function') {
                player.spriteData.reaction();
                console.log('⚔️ GhastFireball damaged player!');
            }
        }
    }

    damageGhast() {
        if (!this.spriteData.damageGhast) return;

        // Find and damage the ghast
        const ghasts = this.gameEnv.gameObjects.filter(obj =>
            obj.spriteData?.id === 'Ghast'
        );

        if (ghasts.length > 0) {
            const ghast = ghasts[0];
            if (ghast.spriteData && typeof ghast.spriteData.reaction === 'function') {
                ghast.spriteData.reaction();
                console.log('⚔️ GhastFireball damaged ghast!');
            }
        }
    }

    drawTrail(ctx) {
        // Draw trail behind fireball
        this.trail.forEach((point, index) => {
            if (point.alpha > 0) {
                const size = (this.baseRadius * 0.6) * point.alpha;
                ctx.beginPath();
                ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 69, 0, ${point.alpha * 0.5})`;
                ctx.fill();
            }
        });
    }

    drawParticles(ctx) {
        // Draw flame particles
        this.particles.forEach(particle => {
            if (particle.life > 0) {
                const size = 3 * particle.life;
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
                
                // Color varies from yellow to red based on life
                const red = 255;
                const green = Math.floor(255 * particle.life);
                const blue = 0;
                const alpha = particle.life;
                
                ctx.fillStyle = `rgba(${red}, ${green}, ${blue}, ${alpha})`;
                ctx.fill();
            }
        });
    }

    drawFireball(ctx) {
        // Pulsing effect while moving
        const time = Date.now();
        const pulse = Math.sin(time / 80) * 3;
        const drawRadius = this.baseRadius + pulse;

        // Outer glow
        const gradient = ctx.createRadialGradient(
            this.position.x, this.position.y, 0,
            this.position.x, this.position.y, drawRadius + 10
        );
        gradient.addColorStop(0, 'rgba(255, 255, 100, 0.8)');
        gradient.addColorStop(0.4, 'rgba(255, 69, 0, 0.6)');
        gradient.addColorStop(1, 'rgba(255, 0, 0, 0.1)');

        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, drawRadius + 10, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Main fireball body
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, drawRadius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();

        // Inner core
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, drawRadius * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFF00'; // Bright yellow core
        ctx.fill();

        // Hot white center
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, drawRadius * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fill();
    }

    drawExplosion(ctx) {
        const progress = this.impactFrames / this.maxImpactFrames;
        const alpha = 1 - progress;
        const explosionRadius = this.radius + this.impactFrames * 2;

        // Draw explosion particles first
        this.drawParticles(ctx);

        // Outer explosion ring
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, explosionRadius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 100, 0, ${alpha * 0.6})`;
        ctx.fill();

        // Middle ring
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, explosionRadius * 0.7, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 150, 0, ${alpha * 0.8})`;
        ctx.fill();

        // Inner core
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, explosionRadius * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 100, ${alpha})`;
        ctx.fill();

        // White hot center
        if (this.impactFrames < 20) {
            ctx.beginPath();
            ctx.arc(this.position.x, this.position.y, explosionRadius * 0.2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.fill();
        }

        // Explosion outline
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, explosionRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.8})`;
        ctx.lineWidth = 3;
        ctx.stroke();
    }

    markForRemoval() {
        // Remove canvas element
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
        
        // Remove from game objects array
        if (this.gameEnv?.gameObjects) {
            const index = this.gameEnv.gameObjects.indexOf(this);
            if (index > -1) {
                this.gameEnv.gameObjects.splice(index, 1);
                console.log('🗑️ GhastFireball removed from game objects');
            }
        }
        
        // Clean up references
        this.destroy();
    }

    shouldRemove() {
        return !this.active && this.impactFrames >= this.maxImpactFrames;
    }

    destroy() {
        this.active = false;
        this.exploding = false;
        this.trail = [];
        this.particles = [];
        
        // Remove canvas
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
        
        // Clear references
        this.gameEnv = null;
        this.target = null;
        this.canvas = null;
        this.ctx = null;
    }

    // Method to reverse fireball direction (for hitting back)
    reverseDirection(newTarget) {
        if (!newTarget || !newTarget.position) return;

        this.target = newTarget;
        
        // Calculate new direction
        const dx = newTarget.position.x - this.position.x;
        const dy = newTarget.position.y - this.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 0) {
            const newSpeed = this.spriteData.hitBackSpeed || 6;
            this.velocity.x = (dx / distance) * newSpeed;
            this.velocity.y = (dy / distance) * newSpeed;
            this.speed = newSpeed;
            
            // Change damage properties
            this.spriteData.damagePlayer = false;
            this.spriteData.damageGhast = true;
            
            // Visual feedback - change color slightly
            this.color = "#4169E1"; // Royal blue when hit back
            
            console.log("🔄 Fireball reversed direction!");
        }
    }
}

export default GhastFireball;