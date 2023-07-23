import * as fs from 'fs';
import * as path from 'path';
import Keywords from './keywords';

/**
 * Reads file content
 * @param filePath Comma separated line item in string
 * @returns File content in string
 * @throws If not absolute. Please specify absolute path
 */
export var read = (filePath: string) => {
    if(path.isAbsolute(filePath))
        return fs.readFileSync(filePath).toString();
    else throw new Error("Please specify absolute path");
}
/**
 * Checks if the path is absolute or relative
 * @param filePath 
 * @returns 
 */
export var isAbsolutePath = (filePath: string) => {
    // var uniqueKeys = filePath.match(Keywords.runTimeValsRegex)?.filter((value, index, array) => { return array.indexOf(value) === index });
    // console.log(uniqueKeys);
    return (path.isAbsolute(filePath) ? true : false);
}