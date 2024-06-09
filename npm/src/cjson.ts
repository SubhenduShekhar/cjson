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
        this.decodeKeywords();
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
                this.content = this.decodeImport(this.content, path.dirname(this.filePath));
                isChanged = true
            }
            if(this.isSingleLineComment(this.content)) {
                this.decodeSingleLineComment(this.content);
                isChanged = true
            }
            this.content = this.decodeRuntimeKeys(this.content);
            if(!isChanged) break;
        }
        if(this.isRelativeJPath(this.content)) {
            this.content = this.decodeRelativePaths(this.content);
            isChanged = true;
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

        if(uniqueKeys) 
            content = refineRelativePaths(content, uniqueKeys);

        this.refineObj(content);
        return content;
    }
    /**
     * Deserializes the keywords.
     * @returns `JSON` if no errors. Else `undefined`
     */
    public deserialize() : Cjson {
        this.content = this.decodeRelativePathValues(this.content);
        this.refineObj(this.content);
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
    private decodeImport(content: string, curPath: string): string {
        var filePath: string = this.getFilePath(content);
        var importFilePath: string;

        if(isAbsolutePath(filePath))
            importFilePath = filePath;

        else if(!isAbsolutePath(filePath) && this.isContentCJson) throw AbsolutePathConstraintError("Only absolute path is supported in import statements");

        else 
            var importFilePath: string = path.join(curPath, filePath);
            
        var innerContent: string = read(importFilePath);

        var qr = "";
        if(this.isImport(innerContent))
            qr = this.decodeImport(innerContent, path.dirname(importFilePath))
        else 
            qr = innerContent;
        
        content = content.replace(Keywords.importKey + filePath + "\"", qr);

        if(this.isImport(content)) 
            content = this.decodeImport(content, curPath);

        return content;
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

        var uniqueKeys = this.content.match(Keywords.decodedRuntimeKeys)?.filter((value, index, array) => { return array.indexOf(value) === index });
        
        uniqueKeys = uniqueKeys?.flatMap(eachElem => eachElem.split("<-")[1].split("->")[0]);

        var injectObjKeys: string[] = Object.keys(injectingObj);

        for(let i = 0; i < injectObjKeys.length; i ++) {
            if(uniqueKeys?.includes(injectObjKeys[i])) {
                if(typeof injectingObj[injectObjKeys[i]] === "boolean" || 
                    typeof injectingObj[injectObjKeys[i]] === "bigint" ||
                    typeof injectingObj[injectObjKeys[i]] === "number")
                    content = content.replace(new RegExp("\"<-" + injectObjKeys[i] + "->\"", "g"), injectingObj[injectObjKeys[i]]);
                else if(typeof injectingObj[injectObjKeys[i]] === "object")
                    content = content.replace(new RegExp("\"<-" + injectObjKeys[i] + "->\"", "g"), JSON.stringify(injectingObj[injectObjKeys[i]]));
                else
                    content = content.replace(new RegExp("<-" + injectObjKeys[i] + "->", "g"), injectingObj[injectObjKeys[i]]);
                
                if(this.decodedRuntimeKeyList !== undefined)
                    this.removeFromStringArray(this.decodedRuntimeKeyList, injectObjKeys[i]);
                else
                    console.error("Cannot update Base.decodedRuntimeKeyList as it is undefined");
            }
        }

        if(this.content.match(Keywords.decodedRuntimeKeys)?.filter((value, index, array) => { return array.indexOf(value) === index }).length !== 0)
            console.warn("Still some runtime keys are expecting values... Run cjson.getAllRuntimeKeys()")
        else 
            this.isInjectExist = false;

        content = this.decodeRelativePathValues(content);
        this.refineObj(content);
        return this;
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
        if(jPath.startsWith("$."))
            jPath = jPath.split("$.")[1];
        this.obj = this.json?.replace(jPath, value, this.obj);
        this.refineObj(Cjson.toString(this.obj));
        return this;
    }
    private decodeRuntimeKeys(content: string) {
        var runtimeKeys: string[] | undefined = content.match(Keywords.runtimeVals)?.filter((value, index, array) => { return array.indexOf(value) === index });

        if(runtimeKeys !== undefined && runtimeKeys !== null) {
            this.isInjectExist = true;

            for(let i = 0; i < runtimeKeys.length; i ++) {
                let variable: string = runtimeKeys[i].split("<")[1].split(">")[0];
                let ignoreUnderQuotes: RegExpMatchArray | null = content.match("\".*" + runtimeKeys[i] + ".*\"");

                if(ignoreUnderQuotes === null) {
                    variable = "\"<-" + variable + "->\"";
                    content = content.replace(new RegExp(runtimeKeys[i], "g"), variable);
                }
            }
        }
        return content;
    }
    private decodeRelativePathValues(content: string) {
        var encodedKeys: string[] | undefined = content.match(Keywords.encodedRelativeJPathRegex)?.filter((value, index, array) => { return array.indexOf(value) === index });
        if(encodedKeys) {
            for(let i = 0; i < encodedKeys.length; i ++) {
                let key: string = encodedKeys[i].split("<")[1].split(">")[0];
                let value = this.json?.parse(key);
                if(value !== null) {
                    while(JSON.stringify(value).includes("$.")) 
                        value = this.json?.parse(value.split("<")[1].split(">")[0]);

                    if(typeof value === "string")
                        content = content.replace(new RegExp(encodedKeys[i].replace("$", "\\$"), "g"), value);
                    else
                        content = content.replace(new RegExp("\"" + encodedKeys[i].replace("$", "\\$") + "\"", "g"), value);
                }
                else
                    content = content.replace(new RegExp("\"" + encodedKeys[i].replace("$", "\\$") + "\"", "g"), "null");
            }
        }
        return content;
    }
}