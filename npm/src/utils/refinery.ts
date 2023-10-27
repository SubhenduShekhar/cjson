/**
 * Refines relative paths with `$.`
 * @param content local instance of json content
 * @param uniqueKeys Filtered keys from keywords
 * @returns refined json content with `"<$...."`
 */
export function refineRelativePaths(content: string, uniqueKeys: string[]) {
    uniqueKeys?.map(eachKey => {
        let keyRegex = new RegExp(eachKey.replace("$", "\\$"), 'g');
        content = content.replace(keyRegex, "\"<" + eachKey + ">\"");
    });
    return content;
}
/**
 * Refines runtime variables for `inject()`
 * @param content local instance of json content
 * @param uniqueKeys 
 * @returns `content`
 */
export function refineRuntimeVals(content: string, uniqueKeys: string[]) {
    uniqueKeys?.map(eachKey => {

        content = content.replace(new RegExp(eachKey, "g"), "\"<-" + eachKey.split("<")[1].split(">")[0] + "->\"");
    });
    return content;
}