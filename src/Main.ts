import Point = egret.Point;
import tr = egret.sys.tr;

class Main extends egret.DisplayObjectContainer {

    /**
     * 加载进度界面
     * Process interface loading
     */
    private loadingView: LoadingUI;

    public constructor() {
        super ();
        this.addEventListener (egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event: egret.Event) {
        //设置加载进度界面
        //Config to load process interface
        this.loadingView = new LoadingUI ();
        this.stage.addChild (this.loadingView);

        //初始化Resource资源加载库
        //initiate Resource loading library
        RES.addEventListener (RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig ("resource/default.res.json", "resource/");
    }

    /**
     * 配置文件加载完成,开始预加载preload资源组。
     * configuration file loading is completed, start to pre-load the preload resource group
     */
    private onConfigComplete(event: RES.ResourceEvent): void {
        RES.removeEventListener (RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener (RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener (RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener (RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener (RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        RES.loadGroup ("preload");
    }

    /**
     * preload资源组加载完成
     * Preload resource group is loaded
     */
    private onResourceLoadComplete(event: RES.ResourceEvent) {
        if (event.groupName == "preload") {
            this.stage.removeChild (this.loadingView);
            RES.removeEventListener (RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener (RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener (RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.removeEventListener (RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
            //this.createGameScene ();
            this.addChild(new ns.Game());
        }
    }

    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    private onItemLoadError(event: RES.ResourceEvent) {
        console.warn ("Url:" + event.resItem.url + " has failed to load");
    }

    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    private onResourceLoadError(event: RES.ResourceEvent) {
        console.warn ("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //Ignore the loading failed projects
        this.onResourceLoadComplete (event);
    }

    /**
     * preload资源组加载进度
     * Loading process of preload resource group
     */
    private onResourceProgress(event: RES.ResourceEvent) {
        if (event.groupName == "preload") {
            this.loadingView.setProgress (event.itemsLoaded, event.itemsTotal);
        }
    }

    private map: number[][] = [
        /*
        *0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11,12,13,14,15,16,17,18,19*/
        [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], /*0*/
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0], /*1*/
        [0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0], /*2*/
        [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0], /*3*/
        [0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0], /*4*/
        [0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0], /*5*/
        [0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0], /*6*/
        [0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0], /*7*/
        [0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0], /*8*/
        [0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1], /*9*/
        [0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0], /*10*/
        [0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0], /*11*/
        [0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0], /*12*/
        [0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0], /*13*/
        [0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0], /*14*/
        [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0], /*15*/
    ];

    private walkable = 0;
    private unWalkable = 1;
    private mapEditAble = false;
    private buildType: number;
    private W = 20;
    private end: Point;
    private start: Point;
    /**
     * 创建游戏场景
     * Create a game scene
     */
    private createGameScene() {
        let setUnwalkableBtn = this.createBtn (810, 40, "设置障碍", 0xff6922);
        setUnwalkableBtn.addEventListener (egret.TouchEvent.TOUCH_TAP, this.setUnwalkablePoint, this);
        this.addChild (setUnwalkableBtn);

        let setStartBtn = this.createBtn (810, 80, "设置起点", 0x228840);
        setStartBtn.addEventListener (egret.TouchEvent.TOUCH_TAP, this.setStartPoint, this);
        this.addChild (setStartBtn);

        let setEndBtn = this.createBtn (810, 120, "设置终点", 0xB22110);
        setEndBtn.addEventListener (egret.TouchEvent.TOUCH_TAP, this.setEndPoint, this);
        this.addChild (setEndBtn);

        let findPathBtn = this.createBtn (810, 200, "寻路", 0x9CCD7D);
        findPathBtn.addEventListener (egret.TouchEvent.TOUCH_TAP, this.findPath, this);
        this.addChild (findPathBtn);

        let resetBtn = this.createBtn(810,240,"重置");
        resetBtn.addEventListener (egret.TouchEvent.TOUCH_TAP, this.reset, this);
        this.addChild (resetBtn);

        this.touchEnabled = true;
        this.addEventListener (egret.TouchEvent.TOUCH_TAP, this.onTouchMap, this);

        this.buildMap (this.map);
    }


    private setUnwalkablePoint(): void {
        console.log ("设置障碍");
        this.mapEditAble = true;
        this.buildType = 1;
    }

    private setStartPoint(): void {
        console.log ("设置起点");
        this.mapEditAble = true;
        this.buildType = 2;
    }

    private setEndPoint(): void {
        console.log ("设置终点");
        this.mapEditAble = true;
        this.buildType = 3;
    }

    private path:ns.Node[];
    private findPath(): void {
        this.mapEditAble = false;
        if (this.end == null || this.start == null) {
            console.log ("未设置起点或终点");
            return;
        }
        let pathFinder = new ns.PathFinder ();
        pathFinder.setMap (this.map, 1);
        console.time();
        let path: ns.Node[] = pathFinder.findPath (this.start, this.end);
        this.path = path;
        console.timeEnd();


        if (path.length === 0) {
            console.log ("没有找到路径");
        } else {
            let pathLine = new egret.Shape();
            pathLine.graphics.lineStyle(2,0x9CCD7D);
            for (let node of path) {
                //this.updateBlock (node.x, node.y, 0x9CCD7D);
                pathLine.graphics.lineTo(node.x*40+20,node.y*40+20);
            }
            pathLine.graphics.endFill();
            this.addChild(pathLine);
            this.addEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
        }
    }
    private onEnterFrame(e:egret.Event):void {
        let node = this.path.pop();
        this.updateBlock(this.start.x, this.start.y, 0x000000);
        this.start.x = node.x;
        this.start.y = node.y;
        this.updateBlock(this.start.x, this.start.y, 0x228840);

        if(this.path.length === 0){
            this.removeEventListener(egret.Event.ENTER_FRAME,this.onEnterFrame, this);
        }
    }

    private reset():void {
        this.buildMap (this.map);
        this.start = null;
        this.end = null;
    }


    private onTouchMap(e: egret.TouchEvent): void {
        if (!this.mapEditAble) return;

        let x = Math.floor (e.stageX / 40);
        let y = Math.floor (e.stageY / 40);
        if(x<0||y<0 || x>19||y>15){
            console.log("超出边界");
            return;
        }

        switch (this.buildType) {
            case 1:
                if (this.map[y][x] == 1) {
                    this.map[y][x] = 0;
                    this.updateBlock (x, y, 0x000000);
                } else {
                    this.map[y][x] = 1;
                    this.updateBlock (x, y, 0xff6922);
                }

                break;
            case 2:
                if(this.start){
                    this.updateBlock (this.start.x, this.start.y, 0x000000);
                }
                this.start = new Point (x, y);
                this.updateBlock (this.start.x, this.start.y, 0x228840);
                break;
            case 3:
                if(this.end){
                    this.updateBlock (this.end.x, this.end.y, 0x000000);
                }
                this.end = new Point (x, y);
                this.updateBlock (this.end.x, this.end.y, 0xB22110);
                break;
        }

    }

    private createBtn(x: number, y: number, label: string, color: number = 0xffffff): egret.TextField {
        let btn = new egret.TextField ();
        btn.x = x;
        btn.y = y;
        btn.text = label;
        btn.touchEnabled = true;
        btn.size = 18;
        btn.textColor = color;
        return btn;
    }


    private buildMap(map: number[][]): void {
        for (let i = 0, col = map.length; i < col; i++) {
            let column = map[i];
            for (let j = 0, row = column.length; j < row; j++) {
                let cell = column[j];
                if (cell === this.walkable) {
                    this.addBlock (j, i);
                }
                else if (cell === this.unWalkable) {
                    this.addBlock (j, i, 0xff6922);
                }
            }
        }
        //this.addGridLine (map[0].length, map.length);
    }

    private grids: egret.Shape[] = [];

    private addBlock(x: number, y: number, color: number = 0x000000): void {
        let shp = new egret.Shape ();
        shp.graphics.beginFill (color);
        shp.graphics.drawRect (0, 0, 40, 40);
        shp.graphics.endFill ();
        shp.x = 40*x;
        shp.y = 40*y;
        this.addChild (shp);
        this.grids[y * this.W + x] = shp;
    }

    private updateBlock(x: number, y: number, color: number): void {
        let shp = this.grids[y * this.W + x];
        shp.graphics.beginFill (color);
        shp.graphics.drawRect (0, 0, 40, 40);
        shp.graphics.endFill ();
        shp.x = 40*x;
        shp.y = 40*y;
    }

    private addGridLine(w, h): void {
        let lineColor = 0x1BD9E7;
        for (let i = 0; i < w; i++) {
            let vline = new egret.Shape ();
            vline.graphics.lineStyle (.5, lineColor, 1, true);
            vline.graphics.moveTo (40 * i, 0);
            vline.graphics.lineTo (40 * i, 40 * h);
            this.addChild (vline);
        }
        for (let i = 0; i < h; i++) {
            let hline = new egret.Shape ();
            hline.graphics.lineStyle (1, lineColor, 1, true);
            hline.graphics.moveTo (0, 40 * i);
            hline.graphics.lineTo (40 * w, 40 * i);
            this.addChild (hline);
        }
    }
}

class Card {
    public id: number;
    //点数
    public point: number;
    //花色
    public suit: Suit;
    public pair: number;
    public weight: number;
    public name: string;

    public constructor(suit: Suit, point: number, pair: number = 1) {
        this.suit = suit;
        this.point = point;
        this.pair = pair;
        this.name = this.getName ();
        this.id = this.suit * 100 + this.point;
        this.weight = this.point * 100 + this.suit;
    }

    private getName(): string {
        let card: string = "" + Suit[this.suit];
        if (this.point === 1) {
            card += "A";
        } else if (this.point === 11) {
            card += "J";
        } else if (this.point === 12) {
            card += "Q";
        } else if (this.point === 13) {
            card += "K";
        } else {
            card += this.point;
        }
        return card;
    }

    private sortPoker(): void {
        let cardNames: string[] = [];
        let cards: Card[] = [];
        for (let i = 0; i < 20; i++) {
            let suit = Math.floor (Math.random () * 4 + 1);
            let point = Math.floor (Math.random () * 13 + 1);
            let card = new Card (suit, point);
            cardNames.push (card.name);
            cards.push (card);
        }
        console.log ("排序前：", cardNames.join (" "));

        //优先级
        let p: number[] = [];
        let count: number[] = [];
        let k105s: any[] = [];
        for (let i = 1; i <= 4; i++) {
            k105s[i] = [];
        }
        for (let card of cards) {
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

        for (let k105 of k105s) {
            if (k105 == null) continue;
            for (let card of k105) {
                if (card == null) break;
                if (card.point === 5) {
                    p[k105[0].id] = k105.suit * 1000;

                    count[13]--;
                    count[10]--;
                    count[5]--;

                    k105 = [];
                }
            }
        }


        cards.sort ((a, b) => {
            return b.weight - a.weight;
        });

        let names = [];
        for (let card of cards) {
            names.push (card.name);
        }
        console.log ("排序后：", names.join (" "));
    }
}

enum Suit {
    "♠" = 4,
    "♥" = 3,
    "♣" = 2,
    "♦" = 1
}
