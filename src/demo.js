// Vertex shader program
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'attribute float a_PointSize;\n' + // attribute variable
    'void main() {\n' +
    '  gl_Position = a_Position;\n' +
    '  gl_PointSize = a_PointSize;\n' +
    '}\n';

// Fragment shader program
var FSHADER_SOURCE =
    'void main() {\n' +
    '  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' +
    '}\n';

var webgl = document.getElementById("webgl");
var gl = getWebGLContext(webgl);

function main(){
    webgl.width = canvasSize.maxX;
    webgl.height = canvasSize.maxY;
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }
    // Initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to intialize shaders.');
        return;
    }

    // Get the storage location of a_Position
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    var a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
    gl.vertexAttrib1f(a_PointSize, 3.0);
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return;
    }
    // Specify the color for clearing <canvas>
    gl.clearColor(0, 0, 0, 1);
    draw();

    webgl.onmousedown = mouseDownListener;
    webgl.onmouseup = mouseUpListener;
}

function draw(){
    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    drawPoints();
    drawRects();
}

function drawLines(){
    for (let poly of polygon) {
        let vertex_pos_ = [];
        vertex_pos_.push(vertex_pos[poly[0]]);
        vertex_pos_.push(vertex_pos[poly[1]]);
        vertex_pos_.push(vertex_pos[poly[2]]);
        vertex_pos_.push(vertex_pos[poly[3]]);
        let n = initVertexBuffers(gl, vertex_pos_);
        if (n < 0) {
            console.log('Failed to set the positions of the vertices');
            return;
        }
        // Draw three points
        gl.drawArrays(gl.LINE_LOOP, 0, n);
    }
}

function drawRects(){
    for (let poly of polygon) {
        let vertex_pos_ = [];
        vertex_pos_.push(vertex_pos[poly[0]]);
        vertex_pos_.push(vertex_pos[poly[1]]);
        vertex_pos_.push(vertex_pos[poly[3]]);
        vertex_pos_.push(vertex_pos[poly[2]]);
        let n = initVertexBuffers(gl, vertex_pos_);
        if (n < 0) {
            console.log('Failed to set the positions of the vertices');
            return;
        }
        // Draw three points
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
    }
}

function drawPoints(){
    // Write the positions of vertices to a vertex shader
    var n = initVertexBuffers(gl, vertex_pos);
    if (n < 0) {
        console.log('Failed to set the positions of the vertices');
        return;
    }

    // Draw three points
    gl.drawArrays(gl.POINTS, 0, n);
}


function initVertexBuffers(gl, vertex_pos) {
    var arr = [];
    for (let i in vertex_pos){
        arr.push(xyConvert(vertex_pos[i], canvasSize)[0]);
        arr.push(xyConvert(vertex_pos[i], canvasSize)[1]);
    }
    var vertices = new Float32Array(arr);
    var n = vertex_pos.length; // The number of vertices

    // Create a buffer object
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
    }

    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    // Write date into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return -1;
    }
    // Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);

    return n;
}