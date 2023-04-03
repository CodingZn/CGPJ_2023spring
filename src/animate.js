
// Current rotation angle
var currentAngle = 0.0;

var currentScale = 1.0;
// Model matrix
var modelMatrix = new Matrix4();

var u_ModelMatrix;

// Last time that this function was called
var g_start = Date.now();

function animate(angle, scale) {
    // Calculate the elapsed time
    var now = Date.now();
    var t = now - g_start;
    // Update the current rotation angle (adjusted by the elapsed time)
    var newAngle = ((45 * t) / 1000.0) % 360;
    var newScale = 0.2 + 0.2 * Math.abs((t/1000.0) % 8 - 4);
    return [newAngle, newScale];
}