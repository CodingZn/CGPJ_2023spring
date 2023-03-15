import {drawLine} from "./func.js";

//边的结构，可看做链表结点
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

    //返回该对象的浅拷贝，next属性为null
    singleClone(){
        let e = new Edge(0, 0, 1, 1);
        e.ymin = this.ymin;
        e.ymax = this.ymax;
        e.x_ymin = this.x_ymin;
        e.m = this.m;
        e.next = null;
        return e;
    }
}

//边表中表示特定纵坐标值的条目。也可用作活跃边表
//可看做一个带属性的一维链表，也可看做二维链表的一个条目
class YEntry{
    constructor(y, next=null, edges=null) {
        this.y = y;
        //链表指向下一个yEntry
        this.next = next;
        //y对应的边的链表头部
        this.edges = edges;
    }

    //返回该对象的拷贝，其中edges是拷贝的链表，next为null
    singleClone(){
        let e = new YEntry(this.y);
        // clone edges
        let edg = this.edges;
        while(edg != null){
            e.addToTail(edg.singleClone());
            edg = edg.next;
        }
        return e;
    }

    //按x_ymin属性升序插入一条边edge，不考虑edge指向的边
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

    //将一条边edge插入到末尾，不考虑顺序
    addToTail(edge){
        if (this.edges==null){
            this.edges=edge;
            return;
        }
        let e = this.edges;
        while (e.next != null){
            e = e.next;
        }
        e.next = edge;
    }

    //以下步骤在EdgeTable::fill()中被调用，需按序进行！

    //将参数entry中的边的拷贝按序合并到本entry中（要求本entry必须有序，因而合并完也是有序的）
    mergeWith(yEntry){
        if (yEntry.edges == null)
            return;
        // return;
        for (let e = yEntry.edges; e != null; e = e.next) {
            this.addEdge(e.singleClone());
        }

    }
    //对所有的edge按从x小到大排序
    sortByX(){
        //用不到了，其余步骤即可维护有序性
    }
    //填充本entry对应的一行
    fillScanLine(cxt, color){
        let x_s = [];
        let e = this.edges;
        //获取所有边与扫描线的交点横坐标
        while (e != null){
            x_s.push(e.x_ymin);
            e = e.next;
        }
        for (let i = 0; i < x_s.length; i += 2){//在每对交点之间进行填充（要求交点为偶数个）
            drawLine(cxt, x_s[i], this.y, x_s[i+1], this.y, color);
        }
    }
    //删除已经无交点的边（需在填充之后使用，此时ymax=y）
    delEdgeByYmax(){
        let e = this.edges, e_last;
        while (e === this.edges && e != null){
            if (e.ymax === this.y){
                this.edges = e.next;
            }
            e = e.next;
        }
        e_last = this.edges;
        while (e != null){
            if (e.ymax === this.y){
                e_last.next = e.next;
            }
            else{
                e_last = e;
            }
            e = e.next;
        }
    }
    //更新交点x为下一条扫描线的交点: x = x + m，更新后认为此entry无序
    updateX(){
        for (let e=this.edges; e != null; e=e.next){
            e.x_ymin = e.x_ymin + e.m;
        }
    }

}

//边表。对应一个多边形
//是一个二维链表结构。直接维护YEntry链表，而每个YEntry又是一个链表
class EdgeTable{
    constructor() {
        //entry链表的开头项
        this.head = null;
        //包含的所有边的最值
        this.YMax = -1;
        this.YMin = 999999;
    }

    //插入有特征值y的entry
    //调用者需保证表中没有以y为特征值的entry
    //若对应的y值entry已存在，则不会插入
    addEntry(entry){
        //update Ymax/Ymin
        if (entry.edges != null){
            let e = entry.edges;
            while (e != null){
                if (e.ymin < this.YMin)
                    this.YMin = e.ymin;
                if (e.ymax > this.YMax)
                    this.YMax = e.ymax;
                e = e.next;
            }
        }
        //add entry
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

    //插入一条边，按照ymin归类到对应entry，且维持entry中x_ymin的升序排列。如无对应entry，会在表中创建。
    addEdge(edge){
        //update Ymax/Ymin
        let e = edge;
        while (e != null){
            if (e.ymin < this.YMin)
                this.YMin = e.ymin;
            if (e.ymax > this.YMax)
                this.YMax = e.ymax;
            e = e.next;
        }
        //add edge
        let y = edge.ymin;
        if (this.head == null){
            this.addEntry(new YEntry(y, null, edge));
            return;
        }
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

    //return the copied entry with y. if not exist, create an empty entry with y
    findEntry(y){
        let e = this.head;
        while (e != null){
            if (e.y === y){
                return e.singleClone();
            }
            e = e.next;
        }
        return new YEntry(y);
    }

    //对此边表表示的多边形进行填充
    fill(cxt, color){
        //扫描线的纵坐标值
        let scanningLineY = this.YMin;
        //活动边表（AET），用链表维护当前与扫描线相交的边
        let activeEdgeTable = new YEntry(scanningLineY);
        for (; scanningLineY <= this.YMax;){
            //合并表项，同时按照x递增排序。
            //旧的AET不保证有序
            let oldAET = activeEdgeTable.singleClone();
            //在边表中获取当前扫描线对应的边表，作为新的AET（等价于将有序新边加入新AET）
            activeEdgeTable = this.findEntry(scanningLineY);
            //将旧边加入新AET，顺便维护了顺序。
            activeEdgeTable.mergeWith(oldAET);
            //填充本扫描线
            activeEdgeTable.fillScanLine(cxt, color);
            //删除已经无交点的边
            activeEdgeTable.delEdgeByYmax();
            //更新扫描y坐标值，同时更新交点横坐标
            scanningLineY += 1;
            activeEdgeTable.y += 1;
            activeEdgeTable.updateX();
            //此时AET已经无序
        }
    }

}

// 扫描填充一个多边形
function scanAPolygon(cxt, vertex_array, color){
    // set edgeTable
    var edgeTable = new EdgeTable();
    let edgeArray = [];
    let n = vertex_array.length;
    for (let i = 0; i < n; i++) {
        let start_point = vertex_array[i%n], end_point = vertex_array[(i+1)%n];
        if (start_point[1] === end_point[1])//略过水平线
            continue;
        let edge = new Edge(start_point[0], start_point[1], end_point[0], end_point[1]);
        edgeArray.push(edge);
    }
    //两线相交，扫描线穿过顶点。若扫描线穿过图形内外两侧，需调整使其只算一个交点
    for (let i = 0; i < edgeArray.length; i++) {
        let edge1 = edgeArray[i%edgeArray.length], edge2 = edgeArray[(i+1)%edgeArray.length];
        if (edge1.ymin === edge2.ymax){// 扫描线穿过内外两侧，将y值低的一边ymax减一
            edge2.ymax--;
            if (edge2.ymax === edge2.ymin){// 剔除掉经过调整之后变水平了的边
                let i = edgeArray.indexOf(edge2);
                edgeArray.splice(i, 1);
            }

        }
        else if (edge1.ymax === edge2.ymin){
            edge1.ymax--;
            if (edge1.ymax === edge1.ymin){
                let i = edgeArray.indexOf(edge1);
                edgeArray.splice(i, 1);
            }
        }
    }
    //加入边表
    for (let i = 0; i < edgeArray.length; i++) {
        edgeTable.addEdge(edgeArray[i]);
    }
    //填充
    edgeTable.fill(cxt, color);
}

// 填充扫描所有多边形
function scanAllPolygon(cxt, polygon, vertex_pos, vertex_color){
    for (let j = 0; j < polygon.length; j++) {
        let vertex_array = [];
        for (let i = 0; i < polygon[j].length; i++) {
            vertex_array.push(vertex_pos[polygon[j][i]]);
        }
        scanAPolygon(cxt, vertex_array, vertex_color[polygon[j][0]]);
    }
}


export {scanAPolygon, scanAllPolygon};
