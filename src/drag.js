import {distance, drawVisualPoint} from "./func.js";
import {vertex_pos, vertex_color} from "./config.js";

var c=document.getElementById("myCanvas");
var cxt=c.getContext("2d");

//表示当前是否正在拖拽某点
var ondrag = null;

//给定鼠标坐标，根据范围选择点；返回点的下标。如果没有点被选中，返回null。
//如果有多个点在范围内，优先选择下标最小的点。
function selectPoint(mouse_pos, vertex_pos, radius=10){
    let p;
    for (p = 0; p < vertex_pos.length; p++) {
        let point = vertex_pos[p];
        if (distance(point[0], point[1], mouse_pos[0], mouse_pos[1]) <= radius)
            return p;
    }
    return null;
}

function mouseDownListener(event){
    console.log("mousedown");
    ondrag = selectPoint([event.offsetX, event.offsetY], vertex_pos);
    console.log(ondrag);
    //选中某点
    if(ondrag){
        c.onmousemove = dragPoint;
    }
}

function mouseUpListener(event){
    console.log(ondrag);
    //放开某点
    if(ondrag){
        c.onmousemove = null;
        ondrag = null;
    }
}


//拖拽一个点的事件函数
function dragPoint(event){
    //更新点坐标
    vertex_pos[ondrag] = [event.offsetX, event.offsetY, 0];

    //重新画点
    drawVisualPoint(cxt, vertex_pos[ondrag][0], vertex_pos[ondrag][1], vertex_color[ondrag])
}

export {mouseDownListener, mouseUpListener};