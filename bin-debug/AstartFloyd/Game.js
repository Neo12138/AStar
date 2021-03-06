var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * 最后是测试主类
 * @author
 *
 */
var GameTest = (function (_super) {
    __extends(GameTest, _super);
    function GameTest() {
        var _this = _super.call(this) || this;
        _this._cellSize = 40;
        GameTest.instance = _this;
        _this.makeGrid();
        _this.makePlayer();
        return _this;
    }
    /**
    * Creates the player sprite. Just a circle here.
    */
    GameTest.prototype.makePlayer = function () {
        this._player = new egret.Sprite();
        //this._player.touchChildren = false;
        this._player.touchEnabled = true; //当为true时 点击事件会穿过该对象到达侦听对象
        this._player.graphics.beginFill(0xff0000);
        this._player.graphics.drawCircle(0, 0, 10);
        this._player.graphics.endFill();
        this._player.x = 60;
        this._player.y = 60;
        this.addChild(this._player);
        this._lineShape = new egret.Shape();
        this.addChild(this._lineShape);
    };
    /**
    * Creates a grid with a bunch of random unwalkable nodes.
    */
    GameTest.prototype.makeGrid = function () {
        this._gridContent = new egret.DisplayObjectContainer();
        this._gridContent.touchEnabled = true;
        this._gridContent.touchChildren = false;
        this._gridContent.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGridClick, this);
        this.addChild(this._gridContent);
        this._grid = new Grid(30, 16, 20);
        //随机障碍物
        for (var i = 0; i < 200; i++) {
            this._grid.setWalkable(Math.floor(Math.random() * 30), Math.floor(Math.random() * 16), false);
        }
        this.drawGrid();
    };
    /**
    * Draws the given grid, coloring each cell according to its state.
    */
    GameTest.prototype.drawGrid = function () {
        this._gridArr = new Array();
        for (var i = 0; i < this._grid.numCols; i++) {
            this._gridArr[i] = [];
            for (var j = 0; j < this._grid.numRows; j++) {
                var node = this._grid.getNode(i, j);
                var rect = new egret.Shape();
                rect.graphics.lineStyle(0.1);
                rect.graphics.beginFill(this.getColor(node));
                rect.graphics.drawRect(0, 0, this._cellSize, this._cellSize);
                rect.graphics.endFill();
                rect.x = i * this._cellSize;
                rect.y = j * this._cellSize;
                this._gridContent.addChild(rect);
                this._gridArr[i][j] = rect;
            }
        }
    };
    /**
    * Determines the color of a given node based on its state.
    */
    GameTest.prototype.getColor = function (node) {
        if (!node.walkable)
            return 0x000000;
        if (node == this._grid.startNode)
            return 0x999900;
        if (node == this._grid.endNode)
            return 0x0000ff;
        return 0xcccccc;
    };
    /**
    * Handles the click event on the GridView. Finds the clicked on cell and toggles its walkable state.
    */
    GameTest.prototype.onGridClick = function (event) {
        var xpos = Math.floor(event.stageX / this._cellSize);
        var ypos = Math.floor(event.stageY / this._cellSize);
        var endNp = this._grid.getNode(xpos, ypos);
        var xpos2 = Math.floor(this._player.x / this._cellSize);
        var ypos2 = Math.floor(this._player.y / this._cellSize);
        var startNp = this._grid.getNode(xpos2, ypos2);
        //如果点击的节点不能通行则寻找替代节点
        if (endNp.walkable == false) {
            var replacer = this._grid.findReplacer(startNp, endNp);
            if (replacer) {
                xpos = replacer.x;
                ypos = replacer.y;
            }
        }
        this._grid.setStartNode(xpos2, ypos2);
        this._grid.setEndNode(xpos, ypos);
        this.findPath();
        ////画红线 显示寻路路径
        /*
        this._lineShape.graphics.clear();
        this._lineShape.graphics.lineStyle(1,0xFF0000);
        this._lineShape.graphics.moveTo(xpos2 * this._cellSize + 10,ypos2 * this._cellSize + 10);
        this._lineShape.graphics.lineTo(xpos * this._cellSize + 10,ypos * this._cellSize + 10);
        this._lineShape.graphics.endFill();
        */
    };
    /**
    * Creates an instance of AStar and uses it to find a path.
    */
    GameTest.prototype.findPath = function () {
        var astar = new AStar2();
        console.time("寻路");
        if (astar.findPath(this._grid)) {
            //得到平滑路径
            astar.floyd();
            //在路径中去掉起点节点，避免玩家对象走回头路
            astar.floydPath.shift();
            this._path = astar.floydPath;
            //this._path = astar.path;
            this._index = 0;
            this.addEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
        }
        console.timeEnd("寻路");
    };
    /**
    * 最后走动
    */
    GameTest.prototype.onEnterFrame = function (evt) {
        if (this._path.length == 0) {
            this.removeEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
            return;
        }
        var targetX = this._path[this._index].x * this._cellSize + this._cellSize / 2;
        var targetY = this._path[this._index].y * this._cellSize + this._cellSize / 2;
        var dx = targetX - this._player.x;
        var dy = targetY - this._player.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 1) {
            this._index++;
            if (this._index >= this._path.length) {
                this.removeEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
            }
        }
        else {
            this._player.x += dx * .5;
            this._player.y += dy * .5;
        }
    };
    return GameTest;
}(egret.DisplayObjectContainer));
__reflect(GameTest.prototype, "GameTest");
