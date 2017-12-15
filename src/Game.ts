/**
 * Created by Neo on 2017/11/17
 */
namespace ns {
    export class Game extends egret.Sprite {
        private cellSize: number = 40;
        private grid: Grid;
        private path: Node[];

        private gridContent: egret.DisplayObjectContainer;
        private cells: egret.Shape[];
        private player: egret.Shape;
        private pathLine:egret.Shape;
        ////////////////////////////////////////////////////////////////////////////
        //public
        //请在此处书写所有的公有方法
        ////////////////////////////////////////////////////////////////////////////
        public constructor() {
            super ();
            this.createGrid ();
            this.createPlayer ();
        }


        ///////////////////////////////////////////////////////////////////////////
        //protected
        //请在此处书写所有的保护方法
        ///////////////////////////////////////////////////////////////////////////


        //////////////////////////////////////////////////////////////////////////
        //private
        //请在此处书写所有的私有方法
        //////////////////////////////////////////////////////////////////////////
        private createGrid(): void {
            this.gridContent = new egret.DisplayObjectContainer ();
            this.gridContent.touchEnabled = true;
            this.gridContent.touchChildren = false;
            this.gridContent.addEventListener (egret.TouchEvent.TOUCH_TAP, this.onGridTouched, this);
            this.addChild (this.gridContent);

            let col = 32;
            let row = 16;
            this.cellSize = 40;
            let numUnWalkable = Math.floor (0.2 * col * row);
            this.grid = new Grid (col, row, this.cellSize);

            for (let i = 0; i < numUnWalkable; i++) {
                let x = Math.floor (Math.random () * col);
                let y = Math.floor (Math.random () * row);
                this.grid.setNodeWalkable (x, y, false);
            }

            this.drawGrid ();
        }

        private createPlayer(): void {
            this.player = new egret.Shape ();
            this.player.graphics.beginFill (0xff0000);
            this.player.graphics.drawCircle (0, 0, 10);
            this.player.graphics.endFill ();
            this.player.x = 60;
            this.player.y = 60;
            this.addChild (this.player);
        }

        private onGridTouched(e: egret.TouchEvent): void {
            let x = Math.floor(e.stageX / this.cellSize);
            let y = Math.floor(e.stageY /this.cellSize);
            console.log("--终点",x,y);
            //let endNode:Node = this.grid.getNode(x,y);

            let x2 = Math.floor(this.player.x / this.cellSize);
            let y2 = Math.floor(this.player.y / this.cellSize);
            console.log("起点--",x2,y2);
            //let startNode:Node = this.grid.getNode(x2,y2);

            this.grid.setStartNode(x2,y2);
            this.grid.setEndNode(x,y);

            if(this.pathLine){
                this.removeChild(this.pathLine);
            }

            this.findPath();
        }

        private drawGrid(): void {
            this.cells = [];
            for (let i = 0; i < this.grid.numColumn; i++) {
                for (let j = 0; j < this.grid.numRow; j++) {
                    let node: Node = this.grid.getNode (i, j);
                    let cell: egret.Shape = new egret.Shape ();
                    let index = j * this.cellSize + i;

                    cell.graphics.beginFill (this.getColor (node));
                    cell.graphics.drawRect (0, 0, this.cellSize, this.cellSize);
                    cell.graphics.endFill ();
                    cell.x = i * this.cellSize;
                    cell.y = j * this.cellSize;
                    this.gridContent.addChild (cell);

                    this.cells[index] = cell;
                }
            }
        }

        private getColor(node: Node): number {
            if (!node) return 0x000000;
            if (!node.walkable) return 0xff6922;
            if (node == this.grid.startNode) return 0x999900;
            if (node == this.grid.endNode) return 0x0000ff;
            return 0x000000;
        }

        private findPath():void{
            let pathFinder: PathFinder = new PathFinder();
            console.time("寻路");
            this.path = pathFinder.findPathByGrid(this.grid);
            console.timeEnd("寻路");

            if(this.path.length === 0){
                console.log("没有找到路径");
            }else{
                this.drawPath(this.path);
                this.addEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
            }
        }

        private onEnterFrame(e:egret.Event):void {
            let node = this.path.pop();
            this.player.x = (node.x+0.5)*this.cellSize;
            this.player.y = (node.y+0.5)*this.cellSize;

            if(this.path.length === 0){
                this.removeEventListener(egret.Event.ENTER_FRAME,this.onEnterFrame, this);
            }
        }


        private drawPath(path: Node[], color: number = 0x9CCD7D): void {
            let pathLine = new egret.Shape ();
            this.pathLine = pathLine;
            pathLine.graphics.lineStyle (2, color);
            for (let node of path) {
                let x = (node.x + 0.5) * this.cellSize;
                let y = (node.y + 0.5) * this.cellSize;
                pathLine.graphics.lineTo (x, y);
            }
            pathLine.graphics.endFill ();
            this.addChild (pathLine);
        }
    }
}