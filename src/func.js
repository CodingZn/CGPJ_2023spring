import {canvasSize} from "./config.js"

//该函数在一个canvas上绘制一个点
//其中cxt是从canvas中获得的一个2d上下文context
//    x,y分别是该点的横纵坐标
//    color是表示颜色的整形数组，形如[r,g,b]
//    color在这里会本转化为表示颜色的字符串，其内容也可以是：
//        直接用颜色名称:   "red" "green" "blue"
//        十六进制颜色值:   "#EEEEFF"
//        rgb分量表示形式:  "rgb(0-255,0-255,0-255)"
//        rgba分量表示形式:  "rgba(0-255,1-255,1-255,透明度)"
//由于canvas本身没有绘制单个point的接口，所以我们通过绘制一条短路径替代
function drawPoint(cxt,x,y, color)
{
    //建立一条新的路径
    cxt.beginPath();
    //设置画笔的颜色
    cxt.strokeStyle ="rgb("+color[0] + "," +
        +color[1] + "," +
        +color[2] + ")" ;
    //设置路径起始位置
    cxt.moveTo(x,y);
    //在路径中添加一个节点
    cxt.lineTo(x+1,y+1);
    //用画笔颜色绘制路径
    cxt.stroke();
}

function distance(x1, y1, x2, y2){
    return Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2));
}

function drawVisualPoint(cxt, x, y, color, radius=10, border=1)
{
    for (let j = y - radius; j <= y + radius; j++) {
        if (j >= 0 && j < canvasSize.maxY){
            for (let i = x-radius; i <= x + radius; i++) {
                if (i >= 0 && i < canvasSize.maxX){
                    let dst = distance(x, y, i, j);
                    if (dst <= radius - 1)
                        drawPoint(cxt, i, j, color);
                    else if (dst <= radius && dst > radius - border)
                        drawPoint(cxt, i, j, [0, 0, 0]);
                }
            }
        }
    }
}

//绘制线段的函数绘制一条从(x1,y1)到(x2,y2)的线段，cxt和color两个参数意义与绘制点的函数相同，
function drawLine(cxt,x1,y1,x2,y2,color){

    cxt.beginPath();
    cxt.strokeStyle ="rgba("+color[0] + "," +
        +color[1] + "," +
        +color[2] + "," +
        +255 + ")" ;
    //这里线宽取1会有色差，但是类似半透明的效果有利于debug，取2效果较好
    cxt.lineWidth =1;
    cxt.moveTo(x1, y1);
    cxt.lineTo(x2, y2);
    cxt.stroke();
}
export {drawPoint, drawLine, drawVisualPoint};
