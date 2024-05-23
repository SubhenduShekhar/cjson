import * as vscode from 'vscode';
import { CompletionItems } from './completion-items';
import { GoToImportDefinition } from './goto-definition';

export class Registers {
    static registerImportFilesCommand() {
        let disposable = vscode.languages.registerCompletionItemProvider({language: "cjson", scheme: "file"}, 
            new CompletionItems(), ".", "/", "\\");
    
        return disposable;
    }
    
    static registerGoToImportDefinitionCommand() {
        return vscode.languages.registerDefinitionProvider({
            language: "cjson",
            scheme: "file"
        }, new GoToImportDefinition())
    }
}