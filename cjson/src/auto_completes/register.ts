import * as vscode from 'vscode';
import { CompletionItems } from './completion-items';
import { convertDirectoryContentPathToRelative } from '../utils/utils';
import { GoToDefinition } from './goto-definition';
import { CJsonDocumentLinkProvider } from './document-links';

export function registerImportFilesCommand() {
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
			new CompletionItems(fileList), "/");
    return disposable;
}

export function registerGoToDefinitionCommand() {
    return vscode.languages.registerDefinitionProvider({
        language: "cjson",
        scheme: "file"
    }, new GoToDefinition())
}

// export function cjsonRegisterDocumentLinkCommand() {
//     return vscode.languages.registerDocumentLinkProvider({
//         language: "cjson",
//         scheme: "file"
//     }, new CJsonDocumentLinkProvider())
// }

// export function registerGoToDeclarationCommand() {
//     return vscode.languages.registerDeclarationProvider({
//         language: "cjson",
//         scheme: "file"
//     }, new GoToDeclaration());
// }