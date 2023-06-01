import * as fs from 'fs';
import * as path from 'path';

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