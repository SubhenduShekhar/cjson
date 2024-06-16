import * as vscode from 'vscode';
import { CompletionItems, RelativeVariableCompletionProvider } from './completion-items';
import { GoToImportDefinition, GoToVariableDefinition } from './goto-definition';
import fs from "fs";
import { Cjson } from "coded-json";

export class Registers {
    static registerImportFilesCommand() {
        let disposable = vscode.languages.registerCompletionItemProvider({language: "cjson", scheme: "file"}, 
            new CompletionItems(), ".", "/", "\\", "$");
    
        return disposable;
    }
    
    static registerGoToImportDefinitionCommand() {
        return vscode.languages.registerDefinitionProvider({
            language: "cjson",
            scheme: "file"
        }, new GoToImportDefinition())
    }

    static registerDeserializedPreviewView(nodePath: string) {
        let panel = vscode.window.createWebviewPanel("cjson.deseralizeAndPreview", "Deserialised " + nodePath.split("/")[nodePath.split("/").length - 1],
        vscode.ViewColumn.One,
        {
            enableScripts: true,
            enableForms: true,
            enableCommandUris: true
        }
    );
        fs.readFile(nodePath, (err, data) => {
            if(err)
                vscode.window.showErrorMessage(err.message);
            else {
                var content = new Cjson(nodePath, false).deserialize();
                var strContent = JSON.stringify(content, null, 4);

                panel.webview.html = `<!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Document</title>
                </head>
                <body onload="setData()">
                    <div>
                        <pre style="font-family: sans-serif;" id="content">`+ strContent + `</pre>
                    </div>
                </body>
                </html>`;
            }
        });
    }

    static registerDeseralizeAndPreviewCommand() {
        return vscode.commands.registerCommand("cjson.deseralizeAndPreview", (node) => {
            this.registerDeserializedPreviewView(node.path.substring(1));
        }, this);
    }

    static registerRelativeVariableMappingCommand() {
        return vscode.languages.registerCompletionItemProvider({ language: "cjson", scheme: "file"},
            new RelativeVariableCompletionProvider(), "$");
    }

    static registerGoToVariableDefinitionCommand() {
        return vscode.languages.registerDefinitionProvider({
            language: "cjson",
            scheme: "file"
        }, new GoToVariableDefinition())
    }
}