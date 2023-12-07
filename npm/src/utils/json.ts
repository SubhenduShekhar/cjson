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
        content = file.read(content);
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
export class Json {
    private obj: any | string;
    private jsonKeys: string[] = [];
    private jsonValues: string[] = [];
    private filePath: string | undefined;

    constructor(obj: any | string, isFilePath?: boolean) {
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
    private removeWithSucComma(key: string, value: string, content: string) {
        var uniqueKeys = content.match(Keywords.removeWithSucComa(key, value))?.filter((value, index, array) => { return array.indexOf(value) === index });
        if(uniqueKeys !== undefined) {
            for(let i = 0; i < uniqueKeys?.length; i ++) {
                var value = regexRefinery(uniqueKeys[i]);
                content = content.replace(new RegExp(value, "g"), "");
            }
        }
        return content;
    }
    private removeWithPreComma(key: string, value: string, content: string) {
        var uniqueKeys = content.match(Keywords.removeWithPreComa(key, value))?.filter((value, index, array) => { return array.indexOf(value) === index });
        console.log("-----------");
        console.log(uniqueKeys);
        if(uniqueKeys !== undefined) {
            for(let i = 0; i < uniqueKeys?.length; i ++) {
                var value = regexRefinery(uniqueKeys[i]);
                content = content.replace(new RegExp(value, "g"), "");
            }
        }
        return content;
    }
    private getAllKeyValueMatch(key: string, obj: any) {
        // value = regexRefinery(value);
        // content = this.removeWithSucComma(key, value, content);
        // return this.removeWithPreComma(key, value, content);
        // console.log(key.split(".").length)
        if(key.split(".").length === 1) {
            let stringObj: string = JSON.stringify(obj);
            let con = this.removeWithPreComma(key, obj[key], stringObj);
            con = this.removeWithSucComma(key, obj[key], stringObj);
            console.log(con);
        }
        else {
            let curKey: string = key.split(".")[0];
            this.getAllKeyValueMatch(key.replace(curKey + ".", ""), obj[curKey]);
        }        
    }
    public removeWithKey(key: string, content: string) {
        if(key.startsWith(Keywords.relativeJPath))
            key = key.replace(Keywords.relativeJPath, "");
        this.getAllKeyValueMatch(key, JSON.parse(content));
        // var value: string = this.parse(key);
        // console.log("Removing - " + key + ":" + value)
        // return this.getAllKeyValueMatch(key, value, content);

    }
}