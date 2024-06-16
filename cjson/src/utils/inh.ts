import { Cjson } from "coded-json";

export class NewC extends Cjson {
    obj = null;

    constructor(filePath: string) {
        super(filePath, false);
        this.obj = this.obj;
    }
    public getDecodedString() {
        console.log(JSON.stringify(this.obj));
    }
}