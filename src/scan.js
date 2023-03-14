
class Edge{
    //通过两点坐标设置边，y1 != y2
    constructor(x1, y1, x2, y2) {
        if (y1 < y2){
            this.x_ymin = x1;
            this.ymin = y1;
            this.ymax = y2;
        }
        else{
            this.x_ymin = x2;
            this.ymin = y2;
            this.ymax = y1;
        }
        this.m = (x1-x2)/(y1-y2);
        this.next = null;
    }
}

class YEntry{
    constructor(y, next=null, edges=null) {
        //y不可改变
        this.y = y;
        //链表指向下一个yEntry
        this.next = next;
        //y对应的边的链表头部
        this.edges = edges;
    }

    //按x升序插入一条边
    addEdge(edge){
        if (this.edges==null){
            this.edges=edge;
        }
        else{
            let e = this.edges;
            let e_next = e.next;
            if (edge.x_ymin <= e.x_ymin){
                // insert
                edge.next = e;
                this.edges = edge;
                return;
            }
            while (e_next != null){
                if (e.x_ymin <= edge.x_ymin && edge.x_ymin <= e_next.x_ymin){
                    // insert
                    e.next = edge;
                    edge.next = e_next;
                    return;
                }
                e = e.next;
                e_next = e_next.next;
            }
            e.next = edge;
        }
    }

    //以下步骤需按序进行！
    //将参数entry中的边按x升序合并到本entry中
    mergeWith(yEntry){

    }
    //对所有的edge按从x小到大排序（没用？
    sortByX(){

    }
    //填充当前一行
    fillScanLine(){

    }
    //删除已经无交点的边（ymax=y）
    delEdgeByYmax(){

    }
    //更新交点x为下一条扫描线的交点
    updateX(){

    }

}

class EdgeTable{
    constructor() {
        this.head = null;
    }

    addEntry(entry){
        if (this.head == null){
            this.head = entry;
            return;
        }
        let e = this.head;
        if (entry.y < e.y){
            this.head = entry;
            entry.next = e;
            return;
        }
        let e_next;
        while (e != null){// entry.y >= e.y
            e_next = e.next;
            if (entry.y === e.y){
                return;
            }
            else if (e_next == null || entry.y < e_next.y){
                //insert
                e.next = entry;
                entry.next = e_next;
                return;
            }
            e = e.next;
        }
    }

    addEdge(edge){
        let y = edge.ymin;
        let entry_tmp = this.head;
        if (y < entry_tmp.y){
            this.addEntry(new YEntry(y, null, edge));
            return;
        }
        let entry_tmp_next;
        while(entry_tmp != null){//entry_tmp.y <= y
            entry_tmp_next = entry_tmp.next;
            if (entry_tmp.y === y){
                entry_tmp.addEdge(edge);
                return;
            }
            else if (entry_tmp_next == null || y < entry_tmp_next.y){//entry_tmp.y < y < entry_tmp_next.y
                let entry_new = new YEntry(y, null, edge);
                entry_tmp.next = entry_new;
                entry_new.next = entry_tmp_next;
                return;
            }
            entry_tmp = entry_tmp.next;
        }
    }

    init(edgeArray){

    }

    fill(){

    }

}

function scanAPolygon(cxt, vertex_array, color){
    var edgeTable = new EdgeTable();
    let n = vertex_array.length;
    for (let i = 0; i < n; i++) {
        let start_point = vertex_array[i%n], end_point = vertex_array[(i+1)%n];
        if (start_point[1] === end_point[1])//略过水平线
            continue;
        let edge = new Edge(start_point[0], start_point[1], end_point[0], end_point[1]);
        edgeTable.addEdge(edge);
    }
    console.log(edgeTable);
}

function scanAllPolygon(cxt, polygon, vertex_pos, vertex_color){

}

export {scanAllPolygon};
