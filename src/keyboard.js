var drawline = true;
function keyUpListener(event){
    let letter = event.key;
    switch (letter.toLowerCase()){
        case 't':
            T_pressed();
            break;
        case 'e':
            if (request_id)
                T_pressed();
            break;
        case 'b':
            drawline = !drawline;
            draw();
            break;
    }
}

function T_pressed(){
    if (request_id){//停止播放
        cancelAnimationFrame(request_id);
        request_id = null;

        let now = Date.now();
        duration += now - g_start;

        webgl.onmousedown = mouseDownListener;
        webgl.onmouseup = mouseUpListener;
        //将当前点的位置写入变量
        storeCurrentPos();
        draw();
    }
    else {//开始播放
        g_start = Date.now();
        webgl.onmousedown = null;
        webgl.onmouseup = null;
        webgl.onmousemove = null;

        tick();
    }
}