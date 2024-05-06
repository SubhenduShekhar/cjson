import * as fs from "fs";

export function convertDirectoryContentPathToRelative(absDirPath: string, pathToRemove: string): string[] {
    absDirPath = absDirPath.substring(1);
    var dirContents: string[] = fs.readdirSync(absDirPath);
    var relPaths: string[] = [];

    for(let i = 0; i < dirContents.length; i ++) 
        relPaths.push(dirContents[i].replace(pathToRemove, ""))

    return relPaths;
}