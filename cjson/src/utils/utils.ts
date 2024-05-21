import * as fs from "fs";
import { DirectoryContent } from "./interfaces";
import path from "path";
import * as vscode from "vscode";

export function convertDirectoryContentPathToRelative(absDirPath: string, pathToRemove: string): DirectoryContent[] {
    absDirPath = absDirPath.substring(1);
    var dirContents: fs.Dirent[] = fs.readdirSync(absDirPath, {
        withFileTypes: true
    });
    var relPaths: DirectoryContent[] = [];

    for(let i = 0; i < dirContents.length; i ++) {
        relPaths.push({
            url: path.join(dirContents[i].path, dirContents[i].name)
                    .replace(path.join(pathToRemove.substring(1)), "")
                    .substring(1),
            isDirectory: dirContents[i].isDirectory(),
            filename: dirContents[i].name
        })
    }
    
    return relPaths;
}

export function setAutCompleteList(relativeFolderPath?: string) {
    var dirContent: DirectoryContent[] = [];

    if(relativeFolderPath === undefined)
        relativeFolderPath = "";
    
    if(vscode.workspace.workspaceFolders?.length != undefined) {
        if(vscode.workspace.workspaceFolders?.length != 0) 
            dirContent = convertDirectoryContentPathToRelative(path.join(vscode.workspace.workspaceFolders[0].uri.path, relativeFolderPath), 
                path.join(vscode.workspace.workspaceFolders[0].uri.path, relativeFolderPath));
        else
            dirContent = []
	}
    else {
        vscode.window.showErrorMessage("CJSON extension requires opened folder. Select your test data folder and open it");
        dirContent = [];
    }
    return dirContent;
}