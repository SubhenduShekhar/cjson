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
 * @returns  `true` if the path is absolute, else `false`
 */
export var isAbsolutePath = (filePath: string) => {
    if(filePath.startsWith("\\"))
        filePath = filePath.substring(1)
    
    return path.isAbsolute(filePath);
}