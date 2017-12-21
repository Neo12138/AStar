var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * Created by Neo on 2017/11/15
 */
var ns;
(function (ns) {
    var PathFinder = (function () {
        ////////////////////////////////////////////////////////////////////////////
        //public
        //请在此处书写所有的公有方法
        ////////////////////////////////////////////////////////////////////////////
        function PathFinder() {
            this.nodes = [];
        }
        /**
         * 输入整个地图信息，因此要标记哪个坐标是不可走的点
         * @param {number[][]} map 整个地图
         * @param {number} unWalkable 不可走的值
         */
        PathFinder.prototype.setMap = function (map, unWalkable) {
            this.map = map;
            this.unWalkable = unWalkable;
            this.H = this.map.length;
            this.W = this.map[0].length;
        };
        /**
         * 输入所有不可走的点的坐标，因此要确定地图的宽高
         * @param {egret.Point[]} unWalkablePoint 不可走点的坐标
         * @param {number} w 地图宽
         * @param {number} h 地图高
         */
        PathFinder.prototype.setUnWalkablePoint = function (unWalkablePoint, w, h) {
            this.unWalkablePoint = unWalkablePoint;
            this.W = w;
            this.H = h;
        };
        PathFinder.prototype.findPath = function (start, end) {
            var openList = [];
            var closeList = [];
            var curNode;
            var endNode = new ns.Node(end.x, end.y);
            //1.把起点加入open list
            openList.push(new ns.Node(start.x, start.y));
            while (1) {
                //2.a遍历open list,找到f值最小的节点(如果每次都对open list从大到小排序了，最后一个便是f最小的)
                curNode = openList.pop();
                //2.b把这个节点移入close list
                closeList.push(curNode);
                //2.c检查当前节点的8个相邻节点
                var roundNodes = this.getRoundNode(curNode);
                for (var _i = 0, roundNodes_1 = roundNodes; _i < roundNodes_1.length; _i++) {
                    var node = roundNodes_1[_i];
                    if (node.isIn(closeList) || !this.isReachable(node)) {
                        continue;
                    }
                    if (node.isIn(openList)) {
                        var tryG = this.getG(node, curNode);
                        if (tryG < node.g) {
                            node.parent = curNode;
                            node.g = this.getG(node);
                            node.h = this.getH(node, endNode);
                            node.f = node.g + node.h;
                        }
                    }
                    else {
                        openList.push(node);
                        node.parent = curNode;
                        if (node.x == endNode.x && node.y == endNode.y) {
                            endNode = node;
                        }
                        node.g = this.getG(node);
                        node.h = this.getH(node, endNode);
                        node.f = node.g + node.h;
                    }
                }
                openList = openList.sort(function (a, b) {
                    return b.f - a.f;
                });
                //2.d 停止。当把终点加入open list；或者查找终点失败，并且open list是空的
                if (endNode.isIn(openList)) {
                    console.log("终点加入openList, 找到路径");
                    break;
                }
                else if (openList.length === 0) {
                    console.log("openList为空，-----没有找到路径");
                    break;
                }
            }
            var path = [];
            var tail = endNode;
            if (tail.parent != null) {
                path.push(endNode);
            }
            while (tail.parent != null) {
                tail = tail.parent;
                path.push(tail);
            }
            return path;
        };
        PathFinder.prototype.findPathByGrid = function (grid) {
            this.grid = grid;
            var openList = [];
            var closeList = [];
            var startNode = this.grid.startNode;
            var endNode = this.grid.endNode;
            //当前检查的节点
            var curNode;
            //1.把开始节点加入open list
            openList.push(startNode);
            while (1) {
                //2.a遍历open list，找到f值最小的节点
                //openList已经按f从大到小排序了
                curNode = openList.pop();
                //2.b把这个阶段移入close list
                closeList.push(curNode);
                //2.c检查当前节点的8个相邻节点
                //这个方法其实会返回9个节点（包括curNode）
                var roundNodes = this.getRoundNode2(curNode);
                for (var _i = 0, roundNodes_2 = roundNodes; _i < roundNodes_2.length; _i++) {
                    var node = roundNodes_2[_i];
                    if (node.isIn(closeList) || !this.isReachable(node, curNode)) {
                        continue;
                    }
                    if (node.isIn(openList)) {
                        var testG = this.getG(node, curNode);
                        if (testG < node.g) {
                            node.parent = curNode;
                            node.g = testG;
                            node.h = this.getH(node, endNode);
                            node.f = node.g + node.h;
                        }
                    }
                    else {
                        openList.push(node);
                        node.parent = curNode;
                        node.g = this.getG(node);
                        node.h = this.getH(node, endNode);
                        node.f = node.g + node.h;
                    }
                }
                openList = openList.sort(function (a, b) {
                    return b.f - a.f;
                });
                //2.d停止。当把终点加入了open list;或者检查完所有点
                if (endNode.isIn(openList)) {
                    console.log("终点加入open list, 找到路径");
                    break;
                }
                else if (openList.length === 0) {
                    console.log("检查完所有节点，没有找到路径");
                    break;
                }
            }
            var path = [];
            var tail = endNode;
            if (tail.parent != null) {
                path.push(endNode);
            }
            while (tail.parent != null) {
                tail = tail.parent;
                path.push(tail);
            }
            return path;
        };
        ///////////////////////////////////////////////////////////////////////////
        //protected
        //请在此处书写所有的保护方法
        ///////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////
        //private
        //请在此处书写所有的私有方法
        //////////////////////////////////////////////////////////////////////////
        PathFinder.prototype.getRoundNode = function (node) {
            var map = this.map;
            var round = [];
            var xs = [-1, 0, 1];
            var ys = [-1, 0, 1];
            if (node.x - 1 < 0) {
                xs.splice(xs.indexOf(-1), 1);
            }
            else if (map[node.y][node.x - 1] === this.unWalkable) {
                xs.splice(xs.indexOf(-1), 1);
            }
            if (node.x + 1 >= this.W) {
                xs.splice(xs.indexOf(1), 1);
            }
            else if (map[node.y][node.x + 1] === this.unWalkable) {
                xs.splice(xs.indexOf(1), 1);
            }
            if (node.y - 1 < 0) {
                ys.splice(ys.indexOf(-1), 1);
            }
            else if (map[node.y - 1][node.x] === this.unWalkable) {
                ys.splice(ys.indexOf(-1), 1);
            }
            if (node.y + 1 >= this.H) {
                ys.splice(ys.indexOf(1), 1);
            }
            else if (map[node.y + 1][node.x] === this.unWalkable) {
                ys.splice(ys.indexOf(1), 1);
            }
            for (var _i = 0, xs_1 = xs; _i < xs_1.length; _i++) {
                var x = xs_1[_i];
                if (x == null) {
                    continue;
                }
                for (var _a = 0, ys_1 = ys; _a < ys_1.length; _a++) {
                    var y = ys_1[_a];
                    if (y == null) {
                        continue;
                    }
                    round.push(this.getNode(node.x + x, node.y + y));
                }
            }
            return round;
        };
        PathFinder.prototype.getRoundNode2 = function (node) {
            var round = [];
            var startX = node.x - 1 < 0 ? 0 : node.x - 1;
            var endX = node.x + 1 >= this.grid.numColumn ? this.grid.numColumn - 1 : node.x + 1;
            var startY = node.y - 1 < 0 ? 0 : node.y - 1;
            var endY = node.y + 1 >= this.grid.numRow ? this.grid.numRow - 1 : node.y + 1;
            for (var i = startX; i <= endX; i++) {
                for (var j = startY; j <= endY; j++) {
                    var node_1 = this.grid.getNode(i, j);
                    round.push(node_1);
                }
            }
            return round;
        };
        PathFinder.prototype.getNode = function (x, y) {
            var index = y * this.W + x;
            var node = this.nodes[index];
            if (!node) {
                node = new ns.Node(x, y);
                this.nodes[index] = node;
            }
            return node;
        };
        PathFinder.prototype.getG = function (node, from) {
            var g;
            if (!from)
                from = node.parent;
            if (from.x !== node.x && from.y !== node.y) {
                g = from.g + 14;
            }
            else {
                g = from.g + 10;
            }
            return g;
        };
        PathFinder.prototype.getH = function (node, end) {
            var x = Math.abs(end.x - node.x);
            var y = Math.abs(end.y - node.y);
            return 10 * (x + y);
        };
        //检查这个点是否可到达,或者这个点是否在不可到达点的拐角处
        PathFinder.prototype.isReachable = function (node, curNode) {
            if (node.walkable && this.grid.getNode(node.x, curNode.y).walkable
                && this.grid.getNode(curNode.x, node.y).walkable) {
                return true;
            }
            return false;
        };
        return PathFinder;
    }());
    ns.PathFinder = PathFinder;
    __reflect(PathFinder.prototype, "ns.PathFinder");
})(ns || (ns = {}));
