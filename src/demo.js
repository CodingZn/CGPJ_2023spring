// Vertex shader program
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'attribute float a_PointSize;\n' + // attribute variable
    'attribute vec4 a_Color;\n' +
    'varying vec4 v_Color;' +
    'uniform mat4 u_ModelMatrix;\n' +
    'void main() {\n' +
    '  gl_Position = u_ModelMatrix * a_Position;\n' +
    '  gl_PointSize = a_PointSize;\n' +
    '  v_Color = a_Color;\n' +
    '}\n';

// Fragment shader program
var FSHADER_SOURCE =
    // '#ifdef GL_ES\n' +
    'precision mediump float;\n' + // Precision qualifier (See Chapter 6)
    // '#endif GL_ES\n' +
    'varying vec4 v_Color;\n' +    // Receive the data from the vertex shader
    'void main() {\n' +
    '  gl_FragColor = v_Color;\n' +
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

    // Get storage location of u_ModelMatrix
    u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    if (!u_ModelMatrix) {
        console.log('Failed to get the storage location of u_ModelMatrix');
        return;
    }

    // Specify the color for clearing <canvas>
    gl.clearColor(0, 0, 0, 1);

    convertAllPos();
    convertAllColor();

    draw();   // Draw the triangle

    webgl.onmousedown = mouseDownListener;
    webgl.onmouseup = mouseUpListener;
    window.onkeyup = keyUpListener;
}

function draw(){
    modelMatrix.setScale(currentScale,currentScale,currentScale);
    modelMatrix.rotate(currentAngle, 0, 0, 1);

    // Pass the rotation matrix to the vertex shader
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    drawRects();
    if (drawline){
        drawPoints();
        drawLines();
    }
}

function drawLines(){
    for (let tri of triangle) {
        let arr = [];
        for (let index of tri){
            arr.push(converted_vertex_pos[index][0]);
            arr.push(converted_vertex_pos[index][1]);
            arr.push(1.0);
            arr.push(0.0);
            arr.push(0.0);
        }
        let n = initVertexBuffers(gl, arr, 3);
        if (n < 0) {
            console.log('Failed to set the positions of the vertices');
            return;
        }
        // Draw three points
        gl.drawArrays(gl.LINE_LOOP, 0, n);
    }

}

function drawRects(){
    for (let tri of triangle) {
        let arr = [];
        for (let index of tri){
            arr.push(converted_vertex_pos[index][0]);
            arr.push(converted_vertex_pos[index][1]);
            arr.push(converted_vertex_color[index][0]);
            arr.push(converted_vertex_color[index][1]);
            arr.push(converted_vertex_color[index][2]);
        }

        let n = initVertexBuffers(gl, arr, tri.length);
        if (n < 0) {
            console.log('Failed to set the positions of the vertices');
            return;
        }
        // Draw three points
        gl.drawArrays(gl.TRIANGLES, 0, n);
    }
}

function drawPoints(){
    var arr = [];
    for (let i in vertex_pos){
        arr.push(converted_vertex_pos[i][0]);
        arr.push(converted_vertex_pos[i][1]);
        arr.push(converted_vertex_color[i][0]);
        arr.push(converted_vertex_color[i][1]);
        arr.push(converted_vertex_color[i][2]);
    }
    // Write the positions of vertices to a vertex shader
    var n = initVertexBuffers(gl, arr, vertex_pos.length);
    if (n < 0) {
        console.log('Failed to set the positions of the vertices');
        return;
    }

    gl.drawArrays(gl.POINTS, 0, n);
}


function initVertexBuffers(gl, arr, n) {
    var vertices = new Float32Array(arr);

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

    var FSIZE = vertices.BYTES_PER_ELEMENT;

    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    // Get the storage location of a_Position
    var a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
    gl.vertexAttrib1f(a_PointSize, 9.0);
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return -1;
    }
    // Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE*5, 0);
    gl.enableVertexAttribArray(a_Position);

    // Get the storage location of a_Position, assign buffer and enable
    var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
    if(a_Color < 0) {
        console.log('Failed to get the storage location of a_Color');
        return -1;
    }
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 5, FSIZE * 2);
    gl.enableVertexAttribArray(a_Color);  // Enable the assignment of the buffer object


    return n;
}