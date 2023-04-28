import { read } from "./utils/file";
import * as path from 'path';
import { Is } from "./utils/is";
import Keywords from "./utils/keywords";
import { Json } from "./utils/json";

export class Cjson extends Is {
    private obj: JSON | undefined;
    private filePath: string;
    private content: string = "";
    private commaSeparated: string[] = [];
    private json: Json | undefined = undefined;

    constructor(filePath: string) {
        super();
        this.obj = undefined;
        this.filePath = filePath;
        this.content = read(this.filePath);
        this.commaSeparated = this.content.split(",");
    }

    private decodeKeywords() {
        for(let i = 0; i < this.commaSeparated.length; i ++) {
            if(this.isImport(this.commaSeparated[i]))
                this.decodeImport(this.commaSeparated[i]);
            if(this.isSingleLineComment(this.commaSeparated[i])) 
                this.decodeSingleLineComment(this.commaSeparated[i]);
            if(this.isRelativeJPath(this.commaSeparated[i]).Result) {
                let keys: string[] = this.isRelativeJPath(this.commaSeparated[i]).Keys;
                for(let j = 0; j < keys.length; j ++)
                    this.content = this.content.replace(keys[j], "\"" + keys + "\"")
            }
        }
        this.obj = JSON.parse(this.content);
    }

    private decodeRelativePaths() {
        this.content = JSON.stringify(this.obj);
        this.commaSeparated = this.content.split(",");
        for(let i = 0; i < this.commaSeparated.length; i ++) {
            let eachPath: string[] = this.commaSeparated[i].split(":");
            for(let j = 0; j < eachPath.length; j ++) {
                if(eachPath[j].trim().startsWith("\"" + Keywords.relativeJPath)) {
                    let exactKey: string = eachPath[j].trim().split("\"" + Keywords.relativeJPath)[1].split("\"")[0];
                    let value = this.json?.parse(exactKey);
                    if(typeof value === "string") 
                        value = "\"" + value + "\"";
                    this.content = this.content.replace("\"" + Keywords.relativeJPath + exactKey + "\"", value);
                }
            }
        }
        this.obj = JSON.parse(this.content);
    }

    public deserialize() {
        this.decodeKeywords();
        this.json = new Json(this.obj);
        this.decodeRelativePaths();
        return this.obj;
    }

    private getFilePath(lineItem: string) {
        return lineItem.split(Keywords.importKey)[1].split("\"")[0];
    }

    private decodeImport(lineItem: string) {
        var filePath: string = this.getFilePath(lineItem);
        if(this.filePath !== undefined) {
            var dirname: string = path.dirname(this.filePath);
            var importFilePath: string = path.join(dirname, filePath);
            this.content = this.content.replace(Keywords.importKey + filePath + "\"", read(importFilePath))
        }
    }

    private decodeSingleLineComment(lineItem: string) {
        let lineSplit: string[] = lineItem.split("\r\n");
        for(let i = 0; i < lineSplit.length; i ++) {
            if(lineSplit[i].trim() !== "" && lineSplit[i].trim().startsWith(Keywords.singleLineComment))
                this.content = this.content.replace(lineSplit[i], "");
        }
    }
}