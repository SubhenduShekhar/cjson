import { CancellationToken, Definition, DefinitionProvider, LocationLink, Position, ProviderResult, Range, TextDocument, TextLine, Uri, window, workspace } from "vscode";
import path from "path";
import * as fs from "fs";

export class GoToImportDefinition implements DefinitionProvider {
    private relativeJPathRegex: RegExp = new RegExp("[$][.][.A-Za-z0-9]*", "g");
    importPaths: string[] = [];
    relativeVariablePaths: string[] = [];
    private curKey: string = "";

    findImportInDocument(documentText: string) {
        let importPaths: string[] = []

        while(documentText.includes("$import \"")) {
            let imports: string = documentText.split("$import \"")[1].split("\"")[0];
            let a = documentText.split("$import \"" + imports + "\"")
            documentText = documentText.replace("$import \"" + imports + "\"", "");
            importPaths.push(imports);
        }

        return importPaths;
    }

    findRelativeVariablePathsInDocument(documentText: string) {
        let relVarPaths: string[] = [];
        let relVarPathsExp: RegExpExecArray[] = [... documentText.matchAll(this.relativeJPathRegex)]

        for(let i = 0; i < relVarPathsExp.length; i ++)
            relVarPaths.push(relVarPathsExp[i].toString())

        return relVarPaths;
    }

    findKeysWithImports(documentText: string) {
        var keywordsWithImports: any = {};
        documentText.split("\r\n").forEach(eachLine => {
            this.importPaths.forEach(eachImport => {
                if(eachLine.includes("$import \"" + eachImport + "\""))
                    keywordsWithImports[eachLine.split("$import \"" + eachImport + "\"")[0].split("\"")[1].split("\"")[0]] = eachImport;
                    //this.keywordsWithImports.push(eachLine.split("$import \"" + eachImport + "\"")[0].split("\"")[1].split("\"")[0])
            })
        })
        return keywordsWithImports;
    }

    findRangeByTextInDocument(documentText: string, text: string) {
        let splitDoc: string[] = documentText.split("\n");
        let startPos = 0, endPos = 0;
        for(let i = 0; i < splitDoc.length; i ++) {
            if(splitDoc[i].includes(text)) {
                startPos = splitDoc[i].split(text)[0].length;
                endPos = text.length + startPos
                return new Range(new Position(i, startPos), new Position(i, endPos));
            }
        }
        return new Range(new Position(0, 0), new Position(0, 0))
    }

    checkPositionInRange(range: Range, position: Position) {
        return range.contains(position);
    }

    provideDefinition(document: TextDocument, position: Position, token: CancellationToken): ProviderResult<Definition | LocationLink[]> {
        this.importPaths = this.findImportInDocument(document.getText());

        for(let i = 0; i < this.importPaths.length; i ++) {
            if(workspace.workspaceFolders !== undefined) {
                var originRange = this.findRangeByTextInDocument(document.getText(), this.importPaths[i]);

                if(this.checkPositionInRange(originRange, position)) {
                    var paths: string = path.join(path.dirname(document.fileName), this.importPaths[i]);

                    return [{
                        targetRange: new Range(new Position(0, 9), new Position(700, 19)),
                        targetUri: Uri.file(paths),
                        originSelectionRange: originRange,
                        targetSelectionRange: new Range(new Position(0, 9), new Position(700, 19))
                    }]
                }
            }
        }

        var relativeVariablePaths: string[] = this.findRelativeVariablePathsInDocument(document.getText());
        var keysWithImports: any = this.findKeysWithImports(document.getText());

        for(let i = 0; i < relativeVariablePaths.length; i ++) {
            if(workspace.workspaceFolders !== undefined) {
                var originRange = this.findRangeByTextInDocument(document.getText(), relativeVariablePaths[i]);

                if(this.checkPositionInRange(originRange, position)) {
                    this.curKey = relativeVariablePaths[i].split("$.")[1];
                    let splitKeys: string[] = this.curKey.split(".");

                    for(let j = 0; j < splitKeys.length; j ++) {
                        var keysWithImports: any = this.findKeysWithImports(document.getText());

                        if(Object.keys(keysWithImports).includes(splitKeys[j])) {

                            //var newDocuText: string = fs.readFileSync(path.join(path.dirname(document.fileName), this.importPaths[i]))
                        }
                    }
                    this.findRelativeVariableLocationRecursively(document.getText(), 
                        position,
                        path.dirname(document.fileName),
                        this.curKey);
                }
            }
        }

        // var splittedPaths: string[] | undefined = keywordSearch?.split("$.")[1].split(".");
        // this.findRelativeVariableLocationRecursively(document.getText(), position, path.dirname(document.fileName));
    }



    findRelativeVariableLocationRecursively(documentText: string, position: Position, docPath: string, relVarPath: string) {
        var keys: string[] = this.curKey.split(".");
        var keysWithImports: any = this.findKeysWithImports(documentText);

        // When relative path is empty and value is found
        if(this.curKey == "")
            return docPath;
        
        for(let i = 0; i < keys.length; i ++) {
            if(Object.keys(keysWithImports).includes(keys[i])) {
                this.curKey = this.curKey.replace(keys[i], "");
                
                if(this.curKey.startsWith("."))
                    this.curKey = this.curKey.substring(1);
                // Find next key
                this.findRelativeVariableLocationRecursively(keysWithImports[keys[i]], position, docPath, this.curKey);
            }
            else {

            }
        }
    }
}