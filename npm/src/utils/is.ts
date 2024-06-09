import { Base } from "./base";
import Keywords from "./keywords";

/**
 * Detects keywords
 */
export class Is extends Base {
    /**
     * Detects `import`
     * @param lineItem Comma separated line item in string
     * @returns `true` if found
     */
    protected isImport = (lineItem: string) => lineItem.includes(Keywords.importKey)
    /**
     * Checks single line comment
     * @param lineItem Comma separated line item in string
     * @returns `true` if found
     */
    protected isSingleLineComment(lineItem: string) {
        var splittedLines: string[] = lineItem.split("\r\n");

        for(let i = 0; i < splittedLines.length; i ++)
            if(splittedLines[i].trim().startsWith(Keywords.singleLineComment))
                return true;
        return false;
    }
    /**
     * @deprecated Out of scope in `v1.0.0`
     * @param lineItem Comma separated line item in string
     * @returns `true` if found
     */
    protected isMultiLineCommentStart(lineItem: string) {
        if(lineItem.includes(Keywords.multiLineCommentStart))
            return true;
        return false;
    }
    /**
     * @deprecated Out of scope in `v1.0.0`
     * @param lineItem Comma separated line item in string
     * @returns `true` if found
     */
    protected isMultiLineCommentEnd(lineItem: string) {
        if(lineItem.includes(Keywords.multiLineCommentEnd))
            return true;
        return false;
    }
    /**
     * Checks whether load contains relative JPaths
     * @param lineItem Comma separated line item in string
     * @returns `true` if found
     */
    protected isRelativeJPath(lineItem: string) {
        let splitByColon: string[] = lineItem.split(":");
        let relativeJPathKeys: string[] = [];
        for(let i = 0; i < splitByColon.length; i ++) {
            if(splitByColon[i].trim().startsWith(Keywords.relativeJPath))
                relativeJPathKeys.push(splitByColon[i].trim());
        }
        if(relativeJPathKeys.length === 0) return {
            Result: false,
            Keys: relativeJPathKeys
        };
        else return {
            Result: true,
            Keys: relativeJPathKeys
        }
    }
    protected isRuntimeKeysPresent(content: string) {
        let runtimeValsList = content.match(Keywords.decodedRuntimeKeys);
        if(runtimeValsList !== undefined) {
            this.decodedRuntimeKeyList = runtimeValsList?.filter((value, index, array) => { return array.indexOf(value) === index });
            return true;
        }
        else
            return false;
    }
}