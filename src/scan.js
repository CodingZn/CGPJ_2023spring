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
    constructor(y, nexty=null, edges=null) {
        //y不可改变
        this.y = y;
        //链表指向下一个yEntry
        this.nexty = nexty;
        //y对应的边的链表头部
        this.edges = edges;
    }

    //按x升序插入一条边
    addEdge(edge){

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

    init(edges){

    }

    fill(){

    }

}

