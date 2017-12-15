var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * Created by Neo on 2017/11/16
 */
var ns;
(function (ns) {
    var Grid = (function () {
        ////////////////////////////////////////////////////////////////////////////
        //public
        //请在此处书写所有的公有方法
        ////////////////////////////////////////////////////////////////////////////
        function Grid(column, row, cellSize) {
            this.setGrid(column, row, cellSize);
        }
        Grid.prototype.setGrid = function (column, row, cellSize) {
            this.column = column;
            this.row = row;
            this._cellSize = cellSize;
            this.nodes = [];
        };
        Grid.prototype.setNodeWalkable = function (x, y, walkable) {
            if (walkable === void 0) { walkable = true; }
            var node = this.getNode(x, y);
            if (node) {
                node.walkable = walkable;
            }
        };
        Grid.prototype.getNode = function (x, y) {
            var index = this.getIndex(x, y);
            if (index < 0) {
                console.log("获取节点失败，坐标越界");
                return null;
            }
            var node = this.nodes[index];
            if (!node) {
                node = new ns.Node(x, y);
                this.nodes[index] = node;
            }
            return this.nodes[index];
        };
        Grid.prototype.setStartNode = function (x, y) {
            var index = this.getIndex(x, y);
            if (index < 0) {
                console.error("起点的坐标越界");
                return;
            }
            this._startNode = this.nodes[index];
        };
        Grid.prototype.setEndNode = function (x, y) {
            var index = this.getIndex(x, y);
            if (index < 0) {
                console.error("终点的坐标越界");
                return;
            }
            this._endNode = this.nodes[index];
        };
        ///////////////////////////////////////////////////////////////////////////
        //protected
        //请在此处书写所有的保护方法
        ///////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////
        //private
        //请在此处书写所有的私有方法
        //////////////////////////////////////////////////////////////////////////
        Grid.prototype.getIndex = function (x, y) {
            if (x < 0 || y < 0 || x >= this.column || y >= this.row) {
                return -1;
            }
            return y * this.column + x;
        };
        Object.defineProperty(Grid.prototype, "startNode", {
            get: function () {
                return this._startNode;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Grid.prototype, "endNode", {
            get: function () {
                return this._endNode;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Grid.prototype, "numColumn", {
            get: function () {
                return this.column;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Grid.prototype, "numRow", {
            get: function () {
                return this.row;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Grid.prototype, "cellSize", {
            get: function () {
                return this._cellSize;
            },
            enumerable: true,
            configurable: true
        });
        return Grid;
    }());
    ns.Grid = Grid;
    __reflect(Grid.prototype, "ns.Grid");
})(ns || (ns = {}));
