import * as fs from 'fs';
import * as path from 'path';

export var read = (filePath: string) => {
    if(path.isAbsolute(filePath))
        return fs.readFileSync(filePath).toString();
    else throw new Error("Please specify absolute path");
}