var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 *
 * 节点类
 * @author
 *
 */
var NodePoint = (function () {
    function NodePoint(x, y) {
        this.walkable = true; //若是障碍节点，则设置为false
        this.alphable = false; //若是透明节点，则设置为true
        this.costMultiplier = 1.0;
        /** 埋葬深度 */
        this.buriedDepth = -1;
        this.x = x;
        this.y = y;
    }
    /** 得到此节点到另一节点的网格距离 */
    NodePoint.prototype.getDistanceTo = function (targetNode) {
        var disX = targetNode.x - this.x;
        var disY = targetNode.y - this.y;
        this.distance = Math.sqrt(disX * disX + disY * disY);
        return this.distance;
    };
    return NodePoint;
}());
__reflect(NodePoint.prototype, "NodePoint");
