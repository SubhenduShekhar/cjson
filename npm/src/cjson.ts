import { isAbsolutePath, read } from "./utils/file";
import * as path from 'path';
import { Is } from "./utils/is";
import Keywords from "./utils/keywords";
import { Json, isContentJson } from "./utils/json";
import { AbsolutePathConstraintError, CJSONContentInsteadOfFilePath } from "./utils/errors";
import { refineRelativePaths, refineRuntimeVals } from "./utils/refinery";

/**
 * Coded JSON is an extended format of JSON formatted data storage, which gives
 * you more previledge to organize data into more structured format.
 * 
 * Here is an example for `CJSON` format:
 * @example
 * 
 * {
    "source": $import "./source.json",
    "target": {
        "fruit": "Apple",
        "size": "Large",
        "color": "Red",
        "secColor": $.target.color,
        "colorList": [ $.target.color, $.target.secColor ],
        // You can add comments like this
        "digitCheck": 1.5,
        "digitImport": $.target.digitCheck,
        "digitArrayImport": [ $.target.digitCheck, $.target.digitImport ]
    }
}
 * 
 * 
 * The above `CJSON` snipped will be deserialized in JSON format and can be used 
 * as same as other JSON files.
 * 
 * For other details, please refer to official page: {@link https://subhendushekhar.github.io/cjson/}
 */
export class Cjson extends Is {
    // private obj: any;
    private filePath: string ;
    private content: string = "";
    public json: Json | undefined = undefined;
    public isContentCJson: boolean | undefined;
    public isContentJson = (isFilePath: boolean): boolean => { return isContentJson(this.content, isFilePath) };

    /**
     * Coded JSON is an extended format of JSON formatted data storage, which gives
     * you more previledge to organize data into more structured format.
     * 
     * Here is an example for `CJSON` format:
     * @example
     * 
     * {
        "source": $import "./source.json",
        "target": {
            "fruit": "Apple",
            "size": "Large",
            "color": "Red",
            "secColor": $.target.color,
            "colorList": [ $.target.color, $.target.secColor ],
            // You can add comments like this
            "digitCheck": 1.5,
            "digitImport": $.target.digitCheck,
            "digitArrayImport": [ $.target.digitCheck, $.target.digitImport ]
        }
    }
     * 
     * 
     * The above `CJSON` snipped will be deserialized in JSON format and can be used 
     * as same as other JSON files.
     * 
     * For other details, please refer to official page: {@link https://subhendushekhar.github.io/cjson/}
     * 
     * @param content Can be path to the CJSON file. In this case the second param can be optional
     * @param isContentCJson Set this true if you are passing raw CJSON content as `content`
     */
    constructor(content: string, isContentCJson?: boolean) {
        super();
        this.obj = undefined;
        
        if(isAbsolutePath(content) && isContentCJson) throw CJSONContentInsteadOfFilePath("CJSON flag is true, but got file path");

        if(isContentCJson) {
            this.filePath = __dirname;
            this.content = content;
            this.isContentCJson = isContentCJson;
        } else {
            this.filePath = content;
            this.content = read(this.filePath);
        }
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
                this.content = this.decodeImport(this.content);
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

        if(uniqueKeys) {
            content = refineRelativePaths(content, uniqueKeys);

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
            });
        }
        this.refineObj(content);
        return content;
    }
    /**
     * Deserializes the keywords.
     * @returns `JSON` if no errors. Else `undefined`
     */
    public deserialize() : any {
        this.decodeKeywords();
        this.decodeRelativePaths(this.content);
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
    private decodeImport(content: string, curPath?: string): string {
        var filePath: string = this.getFilePath(content);
        var fileName: string = filePath.split("/")[filePath.split("/").length - 1];
        var importFilePath: string;


        if(isAbsolutePath(filePath))
            importFilePath = filePath;

        else if(!isAbsolutePath(filePath) && this.isContentCJson) throw AbsolutePathConstraintError("Only absolute path is supported in import statements");

        else {
            var dirname: string = path.join(path.dirname(this.filePath), path.dirname(filePath));

            if(curPath !== undefined)
                dirname = path.join(curPath, path.dirname(filePath));

            importFilePath = path.join(dirname, fileName);
        }
        content = content.replace(Keywords.importKey + filePath + "\"", read(importFilePath));

        if(this.isImport(content)) {
            return this.decodeImport(content, path.dirname(importFilePath));
        } else {
            return content;
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
    private decodeRuntimeVals(content: string, uniqueKeys: string[], injectingObj: any) {
        if(uniqueKeys !== undefined) {
            content = refineRuntimeVals(content, uniqueKeys);
            
            uniqueKeys?.map(eachKey => {
                eachKey = eachKey.split("<")[1].split(">")[0];

                let keyRegex = new RegExp("<-" + eachKey + "->", 'g');
                
                if(typeof injectingObj[eachKey] === "string")
                    content = content.replace(keyRegex, injectingObj[eachKey]);
                else {
                    keyRegex = new RegExp("\"<-" + eachKey + "->\"", 'g');
                    content = content.replace(keyRegex, JSON.stringify(injectingObj[eachKey]));
                }
            });
        }
        return content;
    }
    /**
     * Use this for injecting variable at runtime.
     * 
     * Value need to be replaced can be stored with a key like `<key>`.
     * 
     * Pass the value as json object in `injectingObj`
     * @param injectingObj Runtime values to be injected in json format
     * @returns `JSON` if no errors. Else `undefined`
     */
    public inject(injectingObj: any) {
        let content = this.content;

        this.decodeKeywords();

        var uniqueKeys = this.content.match(Keywords.runTimeValsRegex)?.filter((value, index, array) => { return array.indexOf(value) === index });
        if(uniqueKeys) {
            content = refineRuntimeVals(content, uniqueKeys);

            content = this.decodeRuntimeVals(content, uniqueKeys, injectingObj);
        }
        uniqueKeys = this.content.match(Keywords.relativeJPathRegex)?.filter((value, index, array) => { return array.indexOf(value) === index });
        if(uniqueKeys)
            content = this.decodeRelativePaths(content);
        
        this.refineObj(content);
        return this.obj;
    }
    /**
     * Converts JSON object to string. Just a wrapper over `JSON.stringify()`
     * @param obj JSON object
     * @returns JSON string
     */
    public static toString(obj: any) {
        if(obj === null) return "{}";
        else if(!isContentJson(JSON.stringify(obj))) throw new Error("Object is not a JSON");
        else return JSON.stringify(obj);
    }
    /**
     * Deserializes `CJSON` content and returns content as string.
     * 
     * Content will be of pure JSON content and can be parsed as `JSON`
     * @returns `JSON` equivalent of `CJSON` content in `string`
     */
    public deserializeAsString() : string {
        if(this.obj === undefined)
            this.deserialize();
        
        return this.content;
    }
    /**
     * Removes a key:value from the CJSON context. Key will be JPath in `$.full.path` format
     * 
     * The function automatically deserializes before removing. So, no need to explicitely deserialize it.
     * @param key JPath to the key to be removed.
     * @returns Resultant content in `JSON` object
     */
    public remove(key: string) {
        this.deserialize();
        this.obj = this.json?.removeWithKey(key, this.content);
        this.content = Cjson.toString(this.obj);
        return this;
    }
    /**
     * Replace a JPath to a specified value. The function context is of JSON and cannot be used in CJSON context.
     * 
     * In order to use this in CJSON context, follow below steps:
     * <ol>
     * <li>Create CJson object</li>
     * <li>Deserialize</li>
     * <li>Deserialize</li>
     * <li>cjson.json?.replace("$.jpath", value, object)</li>
     * </ol>
     * @param key 
     * @param value 
     * @param jsonObject 
     * @returns 
     */
    public replace = (jPath: string, value: any) => {
        this.deserialize();
        if(jPath.startsWith("$."))
            jPath = jPath.split("$.")[1];
        this.obj = this.json?.replace(jPath, value, this.obj);
        this.refineObj(Cjson.toString(this.obj));
        return this;
    }
}