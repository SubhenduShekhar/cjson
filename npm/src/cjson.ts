import { read } from "./utils/file.js";
import * as path from 'path';
import { Is } from "./utils/is.js";

export class Cjson<T> extends Is {
    private obj: T | undefined;
    private filePath: string;
    private content: string = "";
    private commaSeparated: string[] = [];

    constructor(filePath: string) {
        super();
        this.obj = undefined;
        this.filePath = filePath;
    }

    public deserialize() {
        this.content = read(this.filePath);
        this.commaSeparated = this.content.split(",");
        for(let i = 0; i < this.commaSeparated.length; i ++) {
            if(this.isImport(this.commaSeparated[i]))
                this.decodeImport(this.commaSeparated[i]);
        }
        this.obj = JSON.parse(this.content);
        return this.obj;
    }

    private getFilePath(lineItem: string) {
        return lineItem.split("$import \"")[1].split("\"")[0];
    }

    private decodeImport(lineItem: string) {
        var filePath: string = this.getFilePath(lineItem);
        if(this.filePath !== undefined) {
            var dirname: string = path.dirname(this.filePath);
            var importFilePath: string = path.join(dirname, filePath);
            this.content = this.content.replace("$import \"" + filePath + "\"", read(importFilePath))
        }
        else throw new Error("filepath is undefined");
    }
} 