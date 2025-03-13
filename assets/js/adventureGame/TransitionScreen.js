// assets/js/adventureGame/TransitionScreen.js

class TransitionScreen {
    constructor() {
        // Set up the canvas
        this.canvas = document.createElement('canvas');
        document.body.appendChild(this.canvas); // Append canvas to the body
        this.ctx = this.canvas.getContext('2d'); // Get the 2D context for drawing

        // Set canvas size
        this.canvas.width = 500;
        this.canvas.height = 500;
    }

    draw() {
        // Initial blue rectangle
        this.ctx.fillStyle = 'blue';  // Set color to blue
        this.ctx.fillRect(0, 0, 50, 50); // Draw a blue rectangle at position (0, 0)

        // Event listener for mouse down
        document.addEventListener('mousedown', (event) => {
            this.ctx.fillStyle = 'red';  // Change color to red
            this.ctx.fillRect(50, 50, 50, 50); // Draw a red rectangle at position (50, 50)
        });
    }
}

// Export the TransitionScreen class for use in other files
export default TransitionScreen;
