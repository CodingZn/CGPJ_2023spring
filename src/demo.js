function xyConvert(canvasPos, canvasSize){
    return [2 * canvasPos[0]/canvasSize.maxX - 1, (-2) * canvasPos[1]/canvasSize.maxY + 1, canvasPos[2]];
}

function main(){
    var webgl = document.getElementById("webgl");
    var gl = getWebGLContext(webgl);
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }
    // Vertex shader program
    var VSHADER_SOURCE =
        'attribute vec4 a_Position;\n' + // attribute variable
        'void main() {\n' +
        '  gl_Position = a_Position;\n' +
        '  gl_PointSize = 10.0;\n' +
        '}\n';

// Fragment shader program
    var FSHADER_SOURCE =
        'void main() {\n' +
        '  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' +
        '}\n';

    // Initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to intialize shaders.');
        return;
    }

    // Get the storage location of a_Position
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return;
    }

    // console.log(canvasSize);
    for (pos of vertex_pos){
        // console.log(pos);
        // console.log(xyConvert(pos, canvasSize));
        // Pass vertex position to attribute variable
        gl.vertexAttrib3fv(a_Position, xyConvert(pos, canvasSize));
// Draw
        gl.drawArrays(gl.POINTS, 0, 1);
    }

}