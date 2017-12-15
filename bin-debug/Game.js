var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by Neo on 2017/11/17
 */
var ns;
(function (ns) {
    var Game = (function (_super) {
        __extends(Game, _super);
        ////////////////////////////////////////////////////////////////////////////
        //public
        //请在此处书写所有的公有方法
        ////////////////////////////////////////////////////////////////////////////
        function Game() {
            var _this = _super.call(this) || this;
            _this.cellSize = 40;
            _this.createGrid();
            _this.createPlayer();
            return _this;
        }
        ///////////////////////////////////////////////////////////////////////////
        //protected
        //请在此处书写所有的保护方法
        ///////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////
        //private
        //请在此处书写所有的私有方法
        //////////////////////////////////////////////////////////////////////////
        Game.prototype.createGrid = function () {
            this.gridContent = new egret.DisplayObjectContainer();
            this.gridContent.touchEnabled = true;
            this.gridContent.touchChildren = false;
            this.gridContent.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGridTouched, this);
            this.addChild(this.gridContent);
            var col = 32;
            var row = 16;
            this.cellSize = 40;
            var numUnWalkable = Math.floor(0.2 * col * row);
            this.grid = new ns.Grid(col, row, this.cellSize);
            for (var i = 0; i < numUnWalkable; i++) {
                var x = Math.floor(Math.random() * col);
                var y = Math.floor(Math.random() * row);
                this.grid.setNodeWalkable(x, y, false);
            }
            this.drawGrid();
        };
        Game.prototype.createPlayer = function () {
            this.player = new egret.Shape();
            this.player.graphics.beginFill(0xff0000);
            this.player.graphics.drawCircle(0, 0, 10);
            this.player.graphics.endFill();
            this.player.x = 60;
            this.player.y = 60;
            this.addChild(this.player);
        };
        Game.prototype.onGridTouched = function (e) {
            var x = Math.floor(e.stageX / this.cellSize);
            var y = Math.floor(e.stageY / this.cellSize);
            console.log("--终点", x, y);
            //let endNode:Node = this.grid.getNode(x,y);
            var x2 = Math.floor(this.player.x / this.cellSize);
            var y2 = Math.floor(this.player.y / this.cellSize);
            console.log("起点--", x2, y2);
            //let startNode:Node = this.grid.getNode(x2,y2);
            this.grid.setStartNode(x2, y2);
            this.grid.setEndNode(x, y);
            if (this.pathLine) {
                this.removeChild(this.pathLine);
            }
            this.findPath();
        };
        Game.prototype.drawGrid = function () {
            this.cells = [];
            for (var i = 0; i < this.grid.numColumn; i++) {
                for (var j = 0; j < this.grid.numRow; j++) {
                    var node = this.grid.getNode(i, j);
                    var cell = new egret.Shape();
                    var index = j * this.cellSize + i;
                    cell.graphics.beginFill(this.getColor(node));
                    cell.graphics.drawRect(0, 0, this.cellSize, this.cellSize);
                    cell.graphics.endFill();
                    cell.x = i * this.cellSize;
                    cell.y = j * this.cellSize;
                    this.gridContent.addChild(cell);
                    this.cells[index] = cell;
                }
            }
        };
        Game.prototype.getColor = function (node) {
            if (!node)
                return 0x000000;
            if (!node.walkable)
                return 0xff6922;
            if (node == this.grid.startNode)
                return 0x999900;
            if (node == this.grid.endNode)
                return 0x0000ff;
            return 0x000000;
        };
        Game.prototype.findPath = function () {
            var pathFinder = new ns.PathFinder();
            console.time("寻路");
            this.path = pathFinder.findPathByGrid(this.grid);
            console.timeEnd("寻路");
            if (this.path.length === 0) {
                console.log("没有找到路径");
            }
            else {
                this.drawPath(this.path);
                this.addEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
            }
        };
        Game.prototype.onEnterFrame = function (e) {
            var node = this.path.pop();
            this.player.x = (node.x + 0.5) * this.cellSize;
            this.player.y = (node.y + 0.5) * this.cellSize;
            if (this.path.length === 0) {
                this.removeEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
            }
        };
        Game.prototype.drawPath = function (path, color) {
            if (color === void 0) { color = 0x9CCD7D; }
            var pathLine = new egret.Shape();
            this.pathLine = pathLine;
            pathLine.graphics.lineStyle(2, color);
            for (var _i = 0, path_1 = path; _i < path_1.length; _i++) {
                var node = path_1[_i];
                var x = (node.x + 0.5) * this.cellSize;
                var y = (node.y + 0.5) * this.cellSize;
                pathLine.graphics.lineTo(x, y);
            }
            pathLine.graphics.endFill();
            this.addChild(pathLine);
        };
        return Game;
    }(egret.Sprite));
    ns.Game = Game;
    __reflect(Game.prototype, "ns.Game");
})(ns || (ns = {}));
