function xyConvert(canvasPos){
    return [2 * canvasPos[0]/canvasSize.maxX - 1, (-2) * canvasPos[1]/canvasSize.maxY + 1, canvasPos[2]];
}

function convertAllPos(){
    converted_vertex_pos = [];
    for (let vertex of vertex_pos) {
        converted_vertex_pos.push(xyConvert(vertex));
    }
}

function convertOnePos(index){
    converted_vertex_pos[index] = xyConvert(vertex_pos[index]);
}

function colorConvert(color){
    return [color[0]/255, color[1]/255, color[2]/255];
}

function convertAllColor(){
    converted_vertex_color=[];
    for (let vertex of vertex_color) {
        converted_vertex_color.push(colorConvert(vertex));
    }
}

function convertOneColor(index){
    converted_vertex_color[index] = colorConvert(vertex_pos[index]);
}

function splitPolyToTriangle(polygon){
    var triangle=[];
    for (let poly of polygon){
        triangle.push([poly[0], poly[1], poly[2]]);
        triangle.push([poly[2], poly[3], poly[0]]);
    }
    return triangle;
}

var triangle = splitPolyToTriangle(polygon);

var converted_vertex_pos=[];
var converted_vertex_color=[];