var drawline = true;
function keyUpListener(event){
    let letter = event.key;
    switch (letter.toLowerCase()){
        case 't':
            if (request_id){
                let now = Date.now();
                duration += now - g_start;
                cancelAnimationFrame(request_id);
                request_id = null;
            }
            else {
                g_start = Date.now();
                tick();
            }
            break;
        case 'e':
            break;
        case 'b':
            drawline = !drawline;
            draw();
            break;
    }
}