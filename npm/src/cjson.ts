import { read } from "./utils/file";
import * as path from 'path';
import { Is } from "./utils/is";
import Keywords from "./utils/keywords";

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
            this.decodeImport(this.commaSeparated[i]);
            this.decodeSingleLineComment(this.commaSeparated[i]);
            this.decodeMultiLineComment(this.commaSeparated[i], i);
        }
        this.obj = JSON.parse(this.content);
        return this.obj;
    }

    private getFilePath(lineItem: string) {
        return lineItem.split(Keywords.importCheck)[1].split("\"")[0];
    }

    private decodeImport(lineItem: string) {
        if(this.isImport(lineItem)) {
            var filePath: string = this.getFilePath(lineItem);
            if(this.filePath !== undefined) {
                var dirname: string = path.dirname(this.filePath);
                var importFilePath: string = path.join(dirname, filePath);
                this.content = this.content.replace(Keywords.importCheck + filePath + "\"", read(importFilePath))
                this.commaSeparated = this.content.split(",");
            }
            else throw new Error("filepath is undefined");
        }
    }

    private decodeSingleLineComment(lineItem: string) {
        if(this.isSingleLineComment(lineItem)) {
            var commentedLine: string = Keywords.singleLineComment + lineItem.split(Keywords.singleLineComment)[1];
            this.content = this.content.replace(commentedLine, "");
        }
    }

    private decodeMultiLineComment(lineItem: string, index: number) {
        if(this.isMultiLineCommentStart(lineItem)) {
            var commentedLine: string = lineItem.split(Keywords.multiLineCommentStart)[1];
            for(let i = index; i < this.commaSeparated.length; i ++) {
                if(this.isMultiLineCommentEnd(this.commaSeparated[i]))
                    break;
                else commentedLine += this.commaSeparated[i];
            }
            this.content = this.content.replace(commentedLine, "");
        }
    }
}

var a = new Cjson<string>("C:\\Users\\Home\\OneDrive\\Desktop\\projects\\Coded-Json-Tests\\test-files\\target.cjson");

a.deserialize();