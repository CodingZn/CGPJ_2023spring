import * as config from "./config.js"
import {mouseDownListener, mouseUpListener} from "./drag.js";
import {drawAllLines, drawAllPoints} from "./func.js";
import {scanAllPolygon} from "./scan.js";

var c=document.getElementById("myCanvas");
var cxt=c.getContext("2d");
//将canvas坐标整体偏移0.5，用于解决宽度为1个像素的线段的绘制问题，具体原理详见project文档
cxt.translate(0.5, 0.5);
//根据配置文件设置画布大小
c.width = config.canvasSize.maxX;
c.height = config.canvasSize.maxY;
//绘制
scanAllPolygon(cxt, config.polygon, config.vertex_pos, config.vertex_color);
drawAllLines(cxt, config.polygon, config.vertex_pos);
drawAllPoints(cxt, config.vertex_pos, config.vertex_color);
//添加事件函数以支持拖拽
c.onmousedown = mouseDownListener;
c.onmouseup = mouseUpListener;