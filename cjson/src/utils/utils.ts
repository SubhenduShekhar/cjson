import * as fs from "fs";
import { DirectoryContent } from "./interfaces";
import path from "path";
import * as vscode from "vscode";
import { Cjson } from "coded-json";
import { NewC } from "./inh";

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

export function findValueForRelativePath(variable: string, baseDocumentPath: vscode.Uri) {
    var splittedVariable: string[] = variable.split(".");
    for(let i = 0; i < splittedVariable.length; i ++) {
        if(splittedVariable[i] === "$") continue;
        var a = new NewC(baseDocumentPath.fsPath);
        a.getDecodedString();
        // var cjson: Cjson = new Cjson(baseDocumentPath.fsPath, false);

        // var val = cjson.json?.parse(variable);
    }
}