
// Current rotation angle
var currentAngle = 0.0;

// 当前坐标点条件下，对应原图scale
var innerScale = 1.0;

//本来应该有的scale
var matrixScale = 1.0;

// Model matrix
var modelMatrix = new Matrix4();

var u_ModelMatrix;

var request_id = null;

// start time of playing animation
var g_start;
var duration = 0.0;

function animate() {
    var now = Date.now();
    var t = now - g_start + duration;
    var t2 = now - g_start;
    // Update the current rotation angle (adjusted by the elapsed time)
    currentAngle = ((45 * t2) / 1000.0) % 360;
    matrixScale = (0.2 + 0.2 * Math.abs((t/1000.0) % 8 - 4));

}
// Start drawing
function tick() {
    animate();  // Update the rotation angle
    draw();   // Draw the triangle
    request_id = requestAnimationFrame(tick); // Request that the browser calls tick
}

function storeCurrentPos(){
    let newpos;
    let vec3;
    for (let i in converted_vertex_pos) {
        vec3  = new Vector3(converted_vertex_pos[i]);
        newpos = modelMatrix.multiplyVector3(vec3);
        converted_vertex_pos[i] = newpos.elements;
    }
    modelMatrix.setIdentity();
    currentAngle = 0;
    innerScale = matrixScale;
}