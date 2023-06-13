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
        this.decodeRelativePaths(this.content);
    }
    /**
     * Root function for decoding keywords
     * Need to improve performance. `v1.0.0`
     */
    private decodeKeywords() {
        var isChanged: boolean = false;
        while(true) {
            isChanged = false;

            if(this.isImport(this.content)) {
                this.decodeImport(this.content);
                isChanged = true
            }
            if(this.isSingleLineComment(this.content)) {
                this.decodeSingleLineComment(this.content);
                isChanged = true
            }
            if(!isChanged) break;
        }
    }

    private refineObj(content?: string) {
        if(content) this.content = content;

        this.json = new Json(this.content, false);
        this.obj = JSON.parse(this.content);
    }
    /**
     * Import functions path to relative file is deocded.
     * Modifies `content`
     */
    private decodeRelativePaths(content: string) {
        var uniqueKeys = content.match(Keywords.relativeJPathRegex)?.filter((value, index, array) => { return array.indexOf(value) === index } )

        uniqueKeys?.map(eachKey => {
            let keyRegex = new RegExp(eachKey.replace("$", "\\$"), 'g');
            content = content.replace(keyRegex, "\"<" + eachKey + ">\"");
        });

        this.refineObj(content);

        uniqueKeys?.map(eachKey => {
            let keyRegex = new RegExp("\\<" + eachKey.replace("$", "\\$") + "\\>", 'g');
            
            while(this.json?.parse(eachKey.split(Keywords.relativeJPath)[1]).toString().startsWith("<$.")) {
                this.refineObj(content);
            }

            if(typeof this.json?.parse(eachKey.split(Keywords.relativeJPath)[1]) !== "string") {
                keyRegex = new RegExp("\"\\<" + eachKey.replace("$", "\\$") + "\\>\"", "g");

                content = content.replace(new RegExp(keyRegex), this.json?.parse(eachKey.split(Keywords.relativeJPath)[1]))
            } else
                content = content.replace(keyRegex, this.json?.parse(eachKey.split(Keywords.relativeJPath)[1]).toString())
        })
        this.refineObj(content);
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