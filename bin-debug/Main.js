var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Point = egret.Point;
var tr = egret.sys.tr;
var Main = (function (_super) {
    __extends(Main, _super);
    function Main() {
        var _this = _super.call(this) || this;
        _this.map = [
            /*
            *0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11,12,13,14,15,16,17,18,19*/
            [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0],
            [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0],
            [0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0],
            [0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0],
            [0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0],
            [0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0],
            [0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
            [0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1],
            [0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0],
            [0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0],
            [0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
            [0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0],
            [0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
            [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
        ];
        _this.walkable = 0;
        _this.unWalkable = 1;
        _this.mapEditAble = false;
        _this.W = 20;
        _this.grids = [];
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    Main.prototype.onAddToStage = function (event) {
        //设置加载进度界面
        //Config to load process interface
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);
        //初始化Resource资源加载库
        //initiate Resource loading library
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
    };
    /**
     * 配置文件加载完成,开始预加载preload资源组。
     * configuration file loading is completed, start to pre-load the preload resource group
     */
    Main.prototype.onConfigComplete = function (event) {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        RES.loadGroup("preload");
    };
    /**
     * preload资源组加载完成
     * Preload resource group is loaded
     */
    Main.prototype.onResourceLoadComplete = function (event) {
        if (event.groupName == "preload") {
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
            //this.createGameScene ();
            this.addChild(new ns.Game());
        }
    };
    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    Main.prototype.onItemLoadError = function (event) {
        console.warn("Url:" + event.resItem.url + " has failed to load");
    };
    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    Main.prototype.onResourceLoadError = function (event) {
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //Ignore the loading failed projects
        this.onResourceLoadComplete(event);
    };
    /**
     * preload资源组加载进度
     * Loading process of preload resource group
     */
    Main.prototype.onResourceProgress = function (event) {
        if (event.groupName == "preload") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    };
    /**
     * 创建游戏场景
     * Create a game scene
     */
    Main.prototype.createGameScene = function () {
        var setUnwalkableBtn = this.createBtn(810, 40, "设置障碍", 0xff6922);
        setUnwalkableBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.setUnwalkablePoint, this);
        this.addChild(setUnwalkableBtn);
        var setStartBtn = this.createBtn(810, 80, "设置起点", 0x228840);
        setStartBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.setStartPoint, this);
        this.addChild(setStartBtn);
        var setEndBtn = this.createBtn(810, 120, "设置终点", 0xB22110);
        setEndBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.setEndPoint, this);
        this.addChild(setEndBtn);
        var findPathBtn = this.createBtn(810, 200, "寻路", 0x9CCD7D);
        findPathBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.findPath, this);
        this.addChild(findPathBtn);
        var resetBtn = this.createBtn(810, 240, "重置");
        resetBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.reset, this);
        this.addChild(resetBtn);
        this.touchEnabled = true;
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchMap, this);
        this.buildMap(this.map);
    };
    Main.prototype.setUnwalkablePoint = function () {
        console.log("设置障碍");
        this.mapEditAble = true;
        this.buildType = 1;
    };
    Main.prototype.setStartPoint = function () {
        console.log("设置起点");
        this.mapEditAble = true;
        this.buildType = 2;
    };
    Main.prototype.setEndPoint = function () {
        console.log("设置终点");
        this.mapEditAble = true;
        this.buildType = 3;
    };
    Main.prototype.findPath = function () {
        this.mapEditAble = false;
        if (this.end == null || this.start == null) {
            console.log("未设置起点或终点");
            return;
        }
        var pathFinder = new ns.PathFinder();
        pathFinder.setMap(this.map, 1);
        console.time();
        var path = pathFinder.findPath(this.start, this.end);
        this.path = path;
        console.timeEnd();
        if (path.length === 0) {
            console.log("没有找到路径");
        }
        else {
            var pathLine = new egret.Shape();
            pathLine.graphics.lineStyle(2, 0x9CCD7D);
            for (var _i = 0, path_1 = path; _i < path_1.length; _i++) {
                var node = path_1[_i];
                //this.updateBlock (node.x, node.y, 0x9CCD7D);
                pathLine.graphics.lineTo(node.x * 40 + 20, node.y * 40 + 20);
            }
            pathLine.graphics.endFill();
            this.addChild(pathLine);
            this.addEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
        }
    };
    Main.prototype.onEnterFrame = function (e) {
        var node = this.path.pop();
        this.updateBlock(this.start.x, this.start.y, 0x000000);
        this.start.x = node.x;
        this.start.y = node.y;
        this.updateBlock(this.start.x, this.start.y, 0x228840);
        if (this.path.length === 0) {
            this.removeEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
        }
    };
    Main.prototype.reset = function () {
        this.buildMap(this.map);
        this.start = null;
        this.end = null;
    };
    Main.prototype.onTouchMap = function (e) {
        if (!this.mapEditAble)
            return;
        var x = Math.floor(e.stageX / 40);
        var y = Math.floor(e.stageY / 40);
        if (x < 0 || y < 0 || x > 19 || y > 15) {
            console.log("超出边界");
            return;
        }
        switch (this.buildType) {
            case 1:
                if (this.map[y][x] == 1) {
                    this.map[y][x] = 0;
                    this.updateBlock(x, y, 0x000000);
                }
                else {
                    this.map[y][x] = 1;
                    this.updateBlock(x, y, 0xff6922);
                }
                break;
            case 2:
                if (this.start) {
                    this.updateBlock(this.start.x, this.start.y, 0x000000);
                }
                this.start = new Point(x, y);
                this.updateBlock(this.start.x, this.start.y, 0x228840);
                break;
            case 3:
                if (this.end) {
                    this.updateBlock(this.end.x, this.end.y, 0x000000);
                }
                this.end = new Point(x, y);
                this.updateBlock(this.end.x, this.end.y, 0xB22110);
                break;
        }
    };
    Main.prototype.createBtn = function (x, y, label, color) {
        if (color === void 0) { color = 0xffffff; }
        var btn = new egret.TextField();
        btn.x = x;
        btn.y = y;
        btn.text = label;
        btn.touchEnabled = true;
        btn.size = 18;
        btn.textColor = color;
        return btn;
    };
    Main.prototype.buildMap = function (map) {
        for (var i = 0, col = map.length; i < col; i++) {
            var column = map[i];
            for (var j = 0, row = column.length; j < row; j++) {
                var cell = column[j];
                if (cell === this.walkable) {
                    this.addBlock(j, i);
                }
                else if (cell === this.unWalkable) {
                    this.addBlock(j, i, 0xff6922);
                }
            }
        }
        //this.addGridLine (map[0].length, map.length);
    };
    Main.prototype.addBlock = function (x, y, color) {
        if (color === void 0) { color = 0x000000; }
        var shp = new egret.Shape();
        shp.graphics.beginFill(color);
        shp.graphics.drawRect(0, 0, 40, 40);
        shp.graphics.endFill();
        shp.x = 40 * x;
        shp.y = 40 * y;
        this.addChild(shp);
        this.grids[y * this.W + x] = shp;
    };
    Main.prototype.updateBlock = function (x, y, color) {
        var shp = this.grids[y * this.W + x];
        shp.graphics.beginFill(color);
        shp.graphics.drawRect(0, 0, 40, 40);
        shp.graphics.endFill();
        shp.x = 40 * x;
        shp.y = 40 * y;
    };
    Main.prototype.addGridLine = function (w, h) {
        var lineColor = 0x1BD9E7;
        for (var i = 0; i < w; i++) {
            var vline = new egret.Shape();
            vline.graphics.lineStyle(.5, lineColor, 1, true);
            vline.graphics.moveTo(40 * i, 0);
            vline.graphics.lineTo(40 * i, 40 * h);
            this.addChild(vline);
        }
        for (var i = 0; i < h; i++) {
            var hline = new egret.Shape();
            hline.graphics.lineStyle(1, lineColor, 1, true);
            hline.graphics.moveTo(0, 40 * i);
            hline.graphics.lineTo(40 * w, 40 * i);
            this.addChild(hline);
        }
    };
    return Main;
}(egret.DisplayObjectContainer));
__reflect(Main.prototype, "Main");
var Card = (function () {
    function Card(suit, point, pair) {
        if (pair === void 0) { pair = 1; }
        this.suit = suit;
        this.point = point;
        this.pair = pair;
        this.name = this.getName();
        this.id = this.suit * 100 + this.point;
        this.weight = this.point * 100 + this.suit;
    }
    Card.prototype.getName = function () {
        var card = "" + Suit[this.suit];
        if (this.point === 1) {
            card += "A";
        }
        else if (this.point === 11) {
            card += "J";
        }
        else if (this.point === 12) {
            card += "Q";
        }
        else if (this.point === 13) {
            card += "K";
        }
        else {
            card += this.point;
        }
        return card;
    };
    Card.prototype.sortPoker = function () {
        var cardNames = [];
        var cards = [];
        for (var i = 0; i < 20; i++) {
            var suit = Math.floor(Math.random() * 4 + 1);
            var point = Math.floor(Math.random() * 13 + 1);
            var card = new Card(suit, point);
            cardNames.push(card.name);
            cards.push(card);
        }
        console.log("排序前：", cardNames.join(" "));
        //优先级
        var p = [];
        var count = [];
        var k105s = [];
        for (var i = 1; i <= 4; i++) {
            k105s[i] = [];
        }
        for (var _i = 0, cards_1 = cards; _i < cards_1.length; _i++) {
            var card = cards_1[_i];
            p[card.id] = card.weight;
            count[card.point]++;
            if (card.point === 13) {
                k105s[card.suit][0] = card;
            }
            else if (card.point === 10) {
                k105s[card.suit][1] = card;
            }
            else if (card.point === 5) {
                k105s[card.suit][2] = card;
            }
        }
        for (var _a = 0, k105s_1 = k105s; _a < k105s_1.length; _a++) {
            var k105 = k105s_1[_a];
            if (k105 == null)
                continue;
            for (var _b = 0, k105_1 = k105; _b < k105_1.length; _b++) {
                var card = k105_1[_b];
                if (card == null)
                    break;
                if (card.point === 5) {
                    p[k105[0].id] = k105.suit * 1000;
                    count[13]--;
                    count[10]--;
                    count[5]--;
                    k105 = [];
                }
            }
        }
        cards.sort(function (a, b) {
            return b.weight - a.weight;
        });
        var names = [];
        for (var _c = 0, cards_2 = cards; _c < cards_2.length; _c++) {
            var card = cards_2[_c];
            names.push(card.name);
        }
        console.log("排序后：", names.join(" "));
    };
    return Card;
}());
__reflect(Card.prototype, "Card");
var Suit;
(function (Suit) {
    Suit[Suit["\u2660"] = 4] = "\u2660";
    Suit[Suit["\u2665"] = 3] = "\u2665";
    Suit[Suit["\u2663"] = 2] = "\u2663";
    Suit[Suit["\u2666"] = 1] = "\u2666";
})(Suit || (Suit = {}));
