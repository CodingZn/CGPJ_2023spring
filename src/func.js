function xyConvert(canvasPos, canvasSize){
    return [2 * canvasPos[0]/canvasSize.maxX - 1, (-2) * canvasPos[1]/canvasSize.maxY + 1, canvasPos[2]];
}

function colorConvert(color){
    return [color[0]/255, color[1]/255, color[2]/255];
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