var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * Created by Neo on 2017/11/14
 */
var ns;
(function (ns) {
    var Node = (function () {
        function Node(x, y) {
            this.walkable = true;
            this.cost = 10;
            this.buriedDepth = 0;
            this.x = x;
            this.y = y;
            this.parent = null;
            this.g = 0;
            this.h = 0;
            this.f = 0;
        }
        Node.prototype.isIn = function (list) {
            for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
                var n = list_1[_i];
                if (this.x === n.x && this.y === n.y) {
                    return true;
                }
            }
            return false;
        };
        return Node;
    }());
    ns.Node = Node;
    __reflect(Node.prototype, "ns.Node");
})(ns || (ns = {}));
