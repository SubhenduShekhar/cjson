import { read } from "./utils/file";
import * as path from 'path';
import { Is } from "./utils/is";
import Keywords from "./utils/keywords";
import { Json, isContentJson } from "./utils/json";


export class Cjson extends Is {
    private obj: JSON | undefined;
    private filePath: string;
    private content: string = "";
    private commaSeparated: string[] = [];
    public json: Json | undefined = undefined;
    public isContentJson = (isFilePath: boolean): boolean => { return isContentJson(this.content, isFilePath) };

    constructor(filePath: string) {
        super();
        this.obj = undefined;
        this.filePath = filePath;
        this.content = read(this.filePath);
        this.commaSeparated = this.content.split(",");
        
        this.decodeKeywords();
        this.decodeRelativePaths();
        this.json = new Json(this.obj);
    }
    /**
     * Root function for decoding keywords
     * Need to improve performance. `v1.0.0`
     */
    private decodeKeywords() {
        for(let i = 0; i < this.commaSeparated.length; i ++) {
            if(this.isImport(this.commaSeparated[i])) {
                this.decodeImport(this.commaSeparated[i]);
                this.commaSeparated = this.content.split(",");
            }
            if(this.isSingleLineComment(this.commaSeparated[i])) {
                this.decodeSingleLineComment(this.commaSeparated[i]);
                this.commaSeparated = this.content.split(",");
            }
            if(this.isRelativeJPath(this.commaSeparated[i]).Result) {
                let keys: string[] = this.isRelativeJPath(this.commaSeparated[i]).Keys;
                for(let j = 0; j < keys.length; j ++)
                    this.content = this.content.replace(keys[j], "\"" + keys + "\"");
                this.commaSeparated = this.content.split(",");
            }
            
        }
        this.obj = JSON.parse(this.content);
    }
    /**
     * Import functions path to relative file is deocded.
     * Modifies `content`
     */
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
    /**
     * Deserializes the keywords.
     * @returns `JSON` if no errors. Else `undefined`
     */
    public deserialize() : JSON | undefined {
        return this.obj;
    }
    /**
     * Returns file path from `import` keyword
     * @param lineItem Comma separated line item in string
     * @returns File path in string
     */
    private getFilePath(lineItem: string): string {
        return lineItem.split(Keywords.importKey)[1].split("\"")[0];
    }
    /**
     * Decodes `import` keyword
     * @param lineItem Comma separated line item in string
     */
    private decodeImport(lineItem: string) {
        var filePath: string = this.getFilePath(lineItem);
        if(this.filePath !== undefined) {
            var dirname: string = path.dirname(this.filePath);
            var importFilePath: string = path.join(dirname, filePath);
            this.content = this.content.replace(Keywords.importKey + filePath + "\"", read(importFilePath))
        }
    }
    /**
     * Identifies comment lines. Can identify multiple lined comments
     * @param lineItem Comma separated line item in string
     */
    private decodeSingleLineComment(lineItem: string) {
        let lineSplit: string[] = lineItem.split("\r\n");
        for(let i = 0; i < lineSplit.length; i ++) {
            if(lineSplit[i].trim() !== "" && lineSplit[i].trim().startsWith(Keywords.singleLineComment))
                this.content = this.content.replace(lineSplit[i], "");
        }
    }
}