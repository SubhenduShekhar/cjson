import * as vscode from 'vscode';
import { CompletionItems } from './completion-items';
import { convertDirectoryContentPathToRelative } from '../utils/utils';

export function registerCommand() {
    var fileList: string[] | undefined = undefined
    if(vscode.workspace.workspaceFolders?.length != undefined) {
        if(vscode.workspace.workspaceFolders?.length != 0) 
            fileList = convertDirectoryContentPathToRelative(vscode.workspace.workspaceFolders[0].uri.path, 
                vscode.workspace.workspaceFolders[0].uri.path);
        else
            fileList = []
	}
    else
        vscode.window.showErrorMessage("CJSON extension requires opened folder. Select your test data folder and open it");

	let disposable = vscode.languages.registerCompletionItemProvider({language: "cjson", scheme: "file"}, 
			new CompletionItems(fileList), "$import ");
    return disposable;
}