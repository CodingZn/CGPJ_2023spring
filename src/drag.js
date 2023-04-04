//表示当前是否正在拖拽某点
let ondrag = null;

function distance(x1, y1, x2, y2){
    return Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2));
}

//给定鼠标坐标，根据范围选择点；返回点的下标。如果没有点被选中，返回null。
//如果有多个点在范围内，优先选择下标最大的点。
function selectPoint(mouse_pos, radius=10/canvasSize.maxX){
    let p;
    for (p = converted_vertex_pos.length - 1; p >= 0; p--) {
        let point = converted_vertex_pos[p];
        if (distance(point[0], point[1], mouse_pos[0], mouse_pos[1]) <= radius)
            return p;
    }
    return null;
}

function mouseDownListener(event){

    ondrag = selectPoint(xyConvert([event.offsetX, event.offsetY]));
    //选中某点
    if(ondrag != null){
        webgl.onmousemove = dragPoint;
    }
}

function mouseUpListener(event){
    //放开某点
    if(ondrag != null){
        webgl.onmousemove = null;
        ondrag = null;
    }
}


//拖拽一个点的事件函数，在拖拽整个过程中始终执行
function dragPoint(event){

    //不允许出界
    if (event.offsetX >= 0 && event.offsetY >= 0 &&
        event.offsetX < canvasSize.maxX && event.offsetY < canvasSize.maxY){
        //更新点坐标
        converted_vertex_pos[ondrag] = xyConvert([event.offsetX, event.offsetY, 0]);

    }
    //重新画
    draw();
}