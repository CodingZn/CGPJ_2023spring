
// Current rotation angle
var currentAngle = 0.0;

var currentScale = 1.0;
// Model matrix
var modelMatrix = new Matrix4();

var u_ModelMatrix;

var request_id = null;

// Last time that this function was called
var g_start = Date.now();

function animate() {
    var now = Date.now();
    var t = now - g_start;
    // Update the current rotation angle (adjusted by the elapsed time)
    currentAngle = ((45 * t) / 1000.0) % 360;
    currentScale = 0.2 + 0.2 * Math.abs((t/1000.0) % 8 - 4);

}
// Start drawing
function tick() {
    animate();  // Update the rotation angle
    draw();   // Draw the triangle
    request_id = requestAnimationFrame(tick); // Request that the browser calls tick
}