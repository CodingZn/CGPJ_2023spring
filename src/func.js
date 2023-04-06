//将canvas坐标转为webgl坐标
function xyConvert(canvasPos){
    return [2 * canvasPos[0]/canvasSize.maxX - 1, (-2) * canvasPos[1]/canvasSize.maxY + 1, canvasPos[2]];
}
//转换所有顶点
function convertAllPos(){
    converted_vertex_pos = [];
    for (let vertex of vertex_pos) {
        converted_vertex_pos.push(xyConvert(vertex));
    }
}
//将canvas颜色转为webgl颜色
function colorConvert(color){
    return [color[0]/255, color[1]/255, color[2]/255];
}
// 转换所有顶点颜色
function convertAllColor(){
    converted_vertex_color=[];
    for (let vertex of vertex_color) {
        converted_vertex_color.push(colorConvert(vertex));
    }
}
// 将四边形划分为三角形网格
function splitPolyToTriangle(polygon){
    var triangle=[];
    for (let poly of polygon){
        triangle.push([poly[0], poly[1], poly[2]]);
        triangle.push([poly[2], poly[3], poly[0]]);
    }
    return triangle;
}
// 三角形网格变量
var triangle = splitPolyToTriangle(polygon);
// webgl坐标系下点的坐标和颜色，默认使用这两个数组
var converted_vertex_pos=[];
var converted_vertex_color=[];