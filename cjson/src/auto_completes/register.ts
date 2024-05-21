import * as vscode from 'vscode';
import { CompletionItems } from './completion-items';
import { convertDirectoryContentPathToRelative } from '../utils/utils';
import { GoToImportDefinition } from './goto-definition';
import { CJsonDocumentLinkProvider } from './document-links';
import { DirectoryContent } from '../utils/interfaces';

export function registerImportFilesCommand() {

	let disposable = vscode.languages.registerCompletionItemProvider({language: "cjson", scheme: "file"}, 
			new CompletionItems(), ".", "/", "\\");
    return disposable;
}

export function registerGoToImportDefinitionCommand() {
    return vscode.languages.registerDefinitionProvider({
        language: "cjson",
        scheme: "file"
    }, new GoToImportDefinition())
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