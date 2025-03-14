class TransitionScreen {
    constructor() {
        // Set up the canvas
        this.canvas = document.createElement('canvas');
        document.body.appendChild(this.canvas); // Append canvas to the body
        this.ctx = this.canvas.getContext('2d'); // Get the 2D context for drawing

        // Set canvas size to cover the whole screen
        this.resizeCanvas();

        // Track key state
        this.isSpacePressed = false;

        // Bind event listeners
        window.addEventListener('resize', () => this.resizeCanvas());
        document.addEventListener('keydown', (event) => this.handleKeyDown(event));
        document.addEventListener('keyup', (event) => this.handleKeyUp(event));

        // Start drawing loop
        this.draw();
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.draw();
    }

    handleKeyDown(event) {
        if (event.code === 'Space') {
            this.isSpacePressed = true;
            this.draw();
        }
    }

    handleKeyUp(event) {
        if (event.code === 'Space') {
            this.isSpacePressed = false;
            this.draw();
        }
    }

    draw() {
        // Clear the canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Set color based on spacebar state
        this.ctx.fillStyle = this.isSpacePressed ? 'red' : 'blue';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height); // Fill entire screen
    }
}

// Export the TransitionScreen class for use in other files
export default TransitionScreen;
