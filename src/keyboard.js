function keyUpListener(event){
    var letter = event.key;
    switch (letter.toLowerCase()){
        case 't':
            if (request_id){
                cancelAnimationFrame(request_id);
                request_id = null;
            }
            else {
                tick();
            }
            break;
        case 'e':
            break;
        case 'b':
            break;
    }
}