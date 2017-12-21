/**
 * Created by Neo on 2017/11/16
 */
namespace ns {
    export class Grid {
        private column: number;
        private row: number;
        private _cellSize: number;

        private nodes: Node[];
        private _startNode: Node;
        private _endNode: Node;

        ////////////////////////////////////////////////////////////////////////////
        //public
        //请在此处书写所有的公有方法
        ////////////////////////////////////////////////////////////////////////////
        public constructor(column: number, row: number, cellSize: number) {
            this.setGrid (column, row, cellSize);
        }

        public reset():void {
            this.nodes.forEach(node=>node.reset());
        }

        public setGrid(column: number, row: number, cellSize: number): void {
            this.column = column;
            this.row = row;
            this._cellSize = cellSize;
            this.nodes = [];
        }

        public setNodeWalkable(x: number, y: number, walkable: boolean = true): void {
            let node: Node = this.getNode (x, y);
            if(node){
                node.walkable = walkable;
            }
        }

        public getNode(x: number, y: number): Node {
            let index = this.getIndex (x, y);
            if(index < 0){
                console.log("获取节点失败，坐标越界");
                return null;
            }
            let node: Node = this.nodes[index];
            if (!node) {
                node = new Node (x, y);
                this.nodes[index] = node;
            }
            return this.nodes[index];
        }


        public setStartNode(x: number, y: number): void {
            let index = this.getIndex (x, y);
            if(index < 0){
                console.error("起点的坐标越界");
                return;
            }
            this._startNode = this.nodes[index];
        }

        public setEndNode(x: number, y: number): void {
            let index = this.getIndex (x, y);
            if(index < 0){
                console.error("终点的坐标越界");
                return;
            }
            this._endNode = this.nodes[index];
        }

        ///////////////////////////////////////////////////////////////////////////
        //protected
        //请在此处书写所有的保护方法
        ///////////////////////////////////////////////////////////////////////////


        //////////////////////////////////////////////////////////////////////////
        //private
        //请在此处书写所有的私有方法
        //////////////////////////////////////////////////////////////////////////
        private getIndex(x: number, y: number): number {
            if (x < 0 || y < 0 || x >= this.column || y >= this.row) {
                return -1;
            }
            return y * this.column + x;
        }

        public get startNode() {
            return this._startNode;
        }

        public get endNode() {
            return this._endNode;
        }

        public get numColumn() {
            return this.column;
        }

        public get numRow() {
            return this.row;
        }

        public get cellSize() {
            return this._cellSize;
        }
    }
}