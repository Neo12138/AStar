/**
 * Created by Neo on 2017/11/15
 */
namespace ns {
    import Point = egret.Point;

    export class PathFinder {
        private map: number[][];
        private unWalkablePoint: Point[];
        private unWalkable: number;
        private W: number;
        private H: number;

        //已经生成的节点
        private nodes: Node[];

        ////////////////////////////////////////////////////////////////////////////
        //public
        //请在此处书写所有的公有方法
        ////////////////////////////////////////////////////////////////////////////
        public constructor() {
            this.nodes = [];
        }

        /**
         * 输入整个地图信息，因此要标记哪个坐标是不可走的点
         * @param {number[][]} map 整个地图
         * @param {number} unWalkable 不可走的值
         */
        public setMap(map: number[][], unWalkable: number): void {
            this.map = map;
            this.unWalkable = unWalkable;
            this.H = this.map.length;
            this.W = this.map[0].length;
        }

        /**
         * 输入所有不可走的点的坐标，因此要确定地图的宽高
         * @param {egret.Point[]} unWalkablePoint 不可走点的坐标
         * @param {number} w 地图宽
         * @param {number} h 地图高
         */
        public setUnWalkablePoint(unWalkablePoint: Point[], w: number, h: number): void {
            this.unWalkablePoint = unWalkablePoint;
            this.W = w;
            this.H = h;
        }

        public findPath(start: Point, end: Point): Node[] {
            let openList: ns.Node[] = [];
            let closeList: ns.Node[] = [];
            let curNode: ns.Node;
            let endNode: ns.Node = new ns.Node (end.x, end.y);

            //1.把起点加入open list
            openList.push (new ns.Node (start.x, start.y));

            while (1) {
                //2.a遍历open list,找到f值最小的节点(如果每次都对open list从大到小排序了，最后一个便是f最小的)
                curNode = openList.pop ();
                //2.b把这个节点移入close list
                closeList.push (curNode);
                //2.c检查当前节点的8个相邻节点
                let roundNodes: ns.Node[] = this.getRoundNode (curNode);
                for (let node of roundNodes) {
                    if (node.isIn (closeList) || !this.isReachable (node)) {
                        continue;
                    }
                    if (node.isIn (openList)) {
                        let tryG = this.getG (node, curNode);
                        if (tryG < node.g) {
                            node.parent = curNode;
                            node.g = this.getG (node);
                            node.h = this.getH (node, endNode);
                            node.f = node.g + node.h;
                        }
                    }
                    else {
                        openList.push (node);

                        node.parent = curNode;
                        if (node.x == endNode.x && node.y == endNode.y) {
                            endNode = node;
                        }
                        node.g = this.getG (node);
                        node.h = this.getH (node, endNode);
                        node.f = node.g + node.h;
                    }
                }
                openList = openList.sort ((a, b) => {
                    return b.f - a.f;
                });
                //2.d 停止。当把终点加入open list；或者查找终点失败，并且open list是空的
                if (endNode.isIn (openList)) {
                    console.log ("终点加入openList, 找到路径");
                    break;
                } else if (openList.length === 0) {
                    console.log ("openList为空，-----没有找到路径");
                    break;
                }
            }
            let path: ns.Node[] = [];
            let tail: ns.Node = endNode;
            if (tail.parent != null) {
                path.push (endNode);
            }
            while (tail.parent != null) {
                tail = tail.parent;
                path.push (tail);
            }
            return path;
        }

        private grid: Grid;

        public findPathByGrid(grid: Grid): Node[] {
            this.grid = grid;
            let openList: Node[] = [];
            let closeList: Node[] = [];
            let startNode = this.grid.startNode;
            let endNode = this.grid.endNode;

            //当前检查的节点
            let curNode: Node;
            //1.把开始节点加入open list
            openList.push (startNode);

            while (1) {
                //2.a遍历open list，找到f值最小的节点
                //openList已经按f从大到小排序了
                curNode = openList.pop ();
                //2.b把这个阶段移入close list
                closeList.push (curNode);

                //2.c检查当前节点的8个相邻节点
                //这个方法其实会返回9个节点（包括curNode）
                let roundNodes:Node[] = this.getRoundNode2(curNode);
                for(let node of roundNodes){
                    if(node.isIn(closeList) || !this.isReachable(node, curNode)){
                        continue;
                    }
                    if(node.isIn(openList)){
                        let testG = this.getG(node, curNode);
                        if(testG < node.g){
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

                openList = openList.sort((a,b)=>{
                    return b.f - a.f;
                });

                //2.d停止。当把终点加入了open list;或者检查完所有点
                console.log(openList);
                if(endNode.isIn(openList)){
                    console.log("终点加入open list, 找到路径");
                    break;
                }else if(openList.length === 0){
                    console.log("检查完所有节点，没有找到路径");
                    break;
                }
            }

            let path: ns.Node[] = [];
            let tail: ns.Node = endNode;
            if (tail.parent != null) {
                path.push (endNode);
            }
            while (tail.parent != null) {
                tail = tail.parent;
                path.push (tail);
            }
            return path;
        }

        ///////////////////////////////////////////////////////////////////////////
        //protected
        //请在此处书写所有的保护方法
        ///////////////////////////////////////////////////////////////////////////


        //////////////////////////////////////////////////////////////////////////
        //private
        //请在此处书写所有的私有方法
        //////////////////////////////////////////////////////////////////////////
        private getRoundNode(node: ns.Node): ns.Node[] {
            let map = this.map;
            let round: ns.Node[] = [];
            let xs: number[] = [-1, 0, 1];
            let ys: number[] = [-1, 0, 1];

            if (node.x - 1 < 0) {
                xs.splice (xs.indexOf (-1), 1);
            } else if (map[node.y][node.x - 1] === this.unWalkable) {
                xs.splice (xs.indexOf (-1), 1);
            }

            if (node.x + 1 >= this.W) {
                xs.splice (xs.indexOf (1), 1);
            } else if (map[node.y][node.x + 1] === this.unWalkable) {
                xs.splice (xs.indexOf (1), 1);
            }

            if (node.y - 1 < 0) {
                ys.splice (ys.indexOf (-1), 1);
            } else if (map[node.y - 1][node.x] === this.unWalkable) {
                ys.splice (ys.indexOf (-1), 1);
            }

            if (node.y + 1 >= this.H) {
                ys.splice (ys.indexOf (1), 1);
            } else if (map[node.y + 1][node.x] === this.unWalkable) {
                ys.splice (ys.indexOf (1), 1);
            }

            for (let x of xs) {
                if (x == null) {
                    continue;
                }
                for (let y of ys) {
                    if (y == null) {
                        continue;
                    }
                    round.push (this.getNode (node.x + x, node.y + y));
                }
            }
            return round;
        }

        private getRoundNode2(node: Node): Node[] {
            let round: ns.Node[] = [];
            let startX: number = node.x - 1 < 0 ? 0 : node.x - 1;
            let endX: number = node.x + 1 >= this.grid.numColumn ? this.grid.numColumn - 1 : node.x + 1;
            let startY: number = node.y - 1 < 0 ? 0 : node.y - 1;
            let endY: number = node.y + 1 >= this.grid.numRow ? this.grid.numRow - 1 : node.y + 1;

            for (let i = startX; i <= endX; i++) {
                for (let j = startY; j <= endY; j++) {
                    let node = this.grid.getNode (i, j);
                    round.push (node);
                }
            }
            return round;
        }

        private getNode(x, y): ns.Node {
            let index = y * this.W + x;
            let node = this.nodes[index];
            if (!node) {
                node = new ns.Node (x, y);
                this.nodes[index] = node;
            }
            return node;
        }

        private getG(node: ns.Node, from?: ns.Node): number {
            let g: number;
            if (!from) from = node.parent;
            if (from.x !== node.x && from.y !== node.y) {
                g = from.g + 14;
            }
            else {
                g = from.g + 10;
            }
            return g;
        }

        private getH(node: ns.Node, end: ns.Node): number {
            let x = Math.abs (end.x - node.x);
            let y = Math.abs (end.y - node.y);
            return 10 * (x + y);
        }

        //检查这个点是否可到达,或者这个点是否在不可到达点的拐角处
        private isReachable(node: Node, curNode?:Node): boolean {
            if(node.walkable && this.grid.getNode(node.x, curNode.y).walkable
                && this.grid.getNode(curNode.x,node.y).walkable){
                return true;
            }
            return false;
        }

    }
}