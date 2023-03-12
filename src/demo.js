import * as func from "./func.js";
import * as config from "./config.js"

var c=document.getElementById("myCanvas");
var cxt=c.getContext("2d");
//将canvas坐标整体偏移0.5，用于解决宽度为1个像素的线段的绘制问题，具体原理详见project文档
cxt.translate(0.5, 0.5);

c.width = config.canvasSize.maxX;
c.height = config.canvasSize.maxY;

for (let i = 0; i < config.polygon.length; i++) {
    let rect = config.polygon[i];
    for (let j = 0; j < 4; j++) {
        let startPointIndex = rect[j%4];
        let endPointIndex = rect[(j+1)%4];
        func.drawLine(cxt, config.vertex_pos[startPointIndex][0], config.vertex_pos[startPointIndex][1],
            config.vertex_pos[endPointIndex][0], config.vertex_pos[endPointIndex][1],
            [0, 0, 0]);
    }
}