/**
 * Created by Neo on 2017/11/14
 */
namespace ns {
    export class Node {
        public x: number;
        public y: number;
        public parent: Node;
        public f: number;
        public g: number;
        public h: number;

        public walkable:boolean = true;
        public cost = 10;
        public buriedDepth:number = 0;

        public constructor(x: number, y: number) {
            this.x = x;
            this.y = y;
            this.parent = null;
            this.g = 0;
            this.h = 0;
            this.f = 0;
        }

        public isIn(list: Node[]): boolean {
            for(let n of list){
                if(this.x === n.x && this.y === n.y){
                    return true;
                }
            }
            return false;
        }

        ///////////////////////////////////////////////////////////////////////////
        //protected
        //请在此处书写所有的保护方法
        ///////////////////////////////////////////////////////////////////////////


        //////////////////////////////////////////////////////////////////////////
        //private
        //请在此处书写所有的私有方法
        //////////////////////////////////////////////////////////////////////////


    }
}