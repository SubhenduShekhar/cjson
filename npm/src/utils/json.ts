import { Base } from './base';
import * as file from './file';
import Keywords from './keywords';
import { regexRefinery } from './refinery';

/**
 * Checks for `JSON` content
 * @param content String type content
 * @returns `true` if content is JSON type
 */
export function isContentJson(content: string, isFilePath?: boolean) {
    if(isFilePath)
        content = file.read(content).toString();
    try {
        JSON.parse(content);
        return true;
    }
    catch {
        return false;
    }
}
/**
 * Split by comma
 * @param content String type content
 * @returns `string[]`
 */
export function separateByComma(content: string) {
    return content.split(",");
}
/**
 * `JSON` specific functions
 */
export class Json extends Base {
    private jsonKeys: string[] = [];
    private jsonValues: string[] = [];
    private filePath: string | undefined;

    constructor(obj: any | string, isFilePath?: boolean) {
        super();
        if(typeof obj === "string" && isFilePath) {
            this.filePath = obj;
            this.obj = JSON.parse(file.read(this.filePath));
        }
        else if(typeof obj === "string" && !isFilePath) {
            this.obj = JSON.parse(obj)
            this.filePath = undefined;
        }
        else if(obj !== undefined) {
            this.obj = obj;
            this.filePath = undefined;
        }
    }
    /**
     * Allowed data types
     */
    private dataTypes = [
        "string",
        "number",
        "boolean"
    ]
    /**
     * Pushes valid JSON path keys
     * @param eachKey Key to be appended
     * @param prevKey Previous key
     */
    private pushKey(eachKey: string, prevKey: string) {
        if(prevKey === "")
            this.jsonKeys.push(eachKey);
        else
            this.jsonKeys.push(prevKey + "." + eachKey)
    }
    /**
     * Reads keys in recursive manner
     * @param jsonData `JSON` data
     * @param prevKey Previous key
     */
    private getKeys(jsonData: any, prevKey: string = "") {
        if(isContentJson(JSON.stringify(jsonData))) {
            Object.keys(jsonData).forEach(eachKey => {
                if(Array.isArray(jsonData[eachKey])) {
                    var allRaw: boolean = true;
                    for(let i = 0; i < jsonData[eachKey].length; i ++) {
                        if(this.dataTypes.includes(typeof jsonData[eachKey][i])) 
                            continue;
                        else {
                            allRaw = false
                            if(prevKey !== "")
                                this.getKeys(jsonData[eachKey][i], prevKey + "." + eachKey + "[" + i + "]");
                            else
                                this.getKeys(jsonData[eachKey][i], eachKey + "[" + i + "]");
                        }
                    }
                    if(allRaw && jsonData[eachKey].length !== 0)
                        for(let i = 0; i < jsonData[eachKey].length; i ++)
                        this.pushKey(eachKey + "[" + i + "]", prevKey);
                }
                else if(this.dataTypes.includes(typeof jsonData[eachKey]))
                    this.pushKey(eachKey, prevKey)
                else if(isContentJson(JSON.stringify(jsonData[eachKey]))) {
                    if(prevKey !== "")
                        this.getKeys(jsonData[eachKey], prevKey + "." + eachKey)
                    else
                        this.getKeys(jsonData[eachKey], eachKey)
                }
                else if(jsonData[eachKey] === null)
                    this.pushKey(eachKey, prevKey);
            })
        }
        else if(Array.isArray(jsonData)) {
            jsonData.forEach(eachElem => this.getKeys(eachElem))
        }
    }
    /**
     * Parses value from JSON 
     * @param key
     * @returns Value fetched from key
     */
    private getValueFromKey(key: string) {
        let value = this.obj;
        if(key.includes(".")) {
            let keyList: string[] = key.split(".");
            for(let j = 0; j < keyList.length; j ++) {
                if(keyList[j].includes("[") && keyList[j].includes("]")) {
                    let key: string = keyList[j].split("[")[0];
                    let index: number = parseInt(keyList[j].split("[")[1].split("]")[0]);
                    value = value[key][index];
                }
                else
                    value = value[keyList[j]];
            }
        }
        else if(key === "")
            value = this.obj;
        else
            value = value[key];
        return value;
    }
    /**
     * Parses value from JSON 
     * @param key 
     * @returns Value fetched from key
     */
    public parse(key?: string) {
        if(key?.startsWith("$."))
            key = key.split("$.")[1];
        if(key !== undefined)
            return this.getValueFromKey(key);
        else
            return this.obj;
    }
    /**
     * Reads all possible keys.
     * @returns Keys `string[]`
     */
    public getAllKeys() {
        this.getKeys(this.obj);
        return this.jsonKeys;
    }
    /**
     * Fetches all values with given `JSON` keys
     * @returns Values in `string[]`
     */
    public getAllValues() {
        if(this.jsonKeys.length === 0)
            this.getAllKeys();

        for(let i = 0; i < this.jsonKeys.length; i ++) {
            let value = this.getValueFromKey(this.jsonKeys[i]);
            this.jsonValues.push(value);
        }
        return this.jsonValues;
    }
    private removeWithSucComma(key: string, value: any, content: string) {
        var uniqueKeys = content.match(Keywords.removeWithSucComa(key, regexRefinery(value)))?.filter((value, index, array) => { return array.indexOf(value) === index });
        
        if(uniqueKeys !== undefined) {
            for(let i = 0; i < uniqueKeys?.length; i ++) {
                var val = regexRefinery(uniqueKeys[i]);
                content = content.replace(new RegExp(val, "g"), "");
            }
        }
        return content;
    }
    private removeWithPreComma(key: string, value: string, content: string) {
        var uniqueKeys = content.match(Keywords.removeWithPreComa(key, regexRefinery(value)))?.filter((value, index, array) => { return array.indexOf(value) === index });
        
        if(uniqueKeys !== undefined) {
            for(let i = 0; i < uniqueKeys?.length; i ++) {
                var val = regexRefinery(uniqueKeys[i]);
                content = content.replace(new RegExp(val, "g"), "");
            }
        }
        return content;
    }
    private removeRecursively(key: string, obj: any) {
        if(key.split(".").length === 1) {
            let stringObj: string = JSON.stringify(obj);
            let con = this.removeWithSucComma(key, obj[key], stringObj);
            if(! isContentJson(con)) {
                con = this.removeWithPreComma(key, obj[key], stringObj);
                con = this.removeWithSucComma(key, obj[key], con);
            }
            return con;
        }
        else {
            let curKey: string = key.split(".")[0];
            var a = this.removeRecursively(key.replace(curKey + ".", ""), obj[curKey]);
            
            if(a !== undefined)
                obj[curKey] = JSON.parse(a);
            else
                obj[curKey] = a;
            return JSON.stringify(obj);
        }
    }
    /**
     * Removes a key:value from the JSON context. Key will be JPath in `$.full.path` format
     * 
     * The function automatically deserializes before removing. So, no need to explicitely deserialize it.
     * @param key JPath to the key
     * @param content JSON `string` content from which to be removed.
     * @returns Resultant content in `JSON` object
     */
    public removeWithKey(key: string, content: string) {
        if(key.startsWith(Keywords.relativeJPath))
            key = key.replace(Keywords.relativeJPath, "");
        var value = this.parse(key);
        
        if(typeof value !== "object")
            this.obj = JSON.parse(this.removeRecursively(key, JSON.parse(content)));
        else {
            // Replacing with null first and then removing the key:value set
            var nulledObj: any = this.replaceRecursively(key, null, JSON.parse(content));
            this.obj = JSON.parse(this.removeRecursively(key, nulledObj));
        }
        return this.obj;
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
    public replace = (jPath: string, value: any, obj: any) => {
        this.obj = this.replaceRecursively(jPath, value, obj);
        return this.obj;
    }
    /**
     * Recursive function for replacing data in provided key.
     * @private
     * @param key 
     * @param obj 
     * @returns 
     */
    private replaceRecursively(key: string, value: any, obj: any): any {
        if(key.split(".").length === 1)
            obj[key] = value;
        else {
            let curKey: string = key.split(".")[0];
            obj[curKey] = this.replaceRecursively(key.replace(curKey + ".", ""), value, obj[curKey]);
        }
        return obj;
    }
}