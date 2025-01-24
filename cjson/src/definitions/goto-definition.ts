import { CancellationToken, Definition, DefinitionProvider, LocationLink, Position, ProviderResult, Range, TextDocument, TextLine, Uri, window, workspace } from "vscode";
import path from "path";
import * as fs from "fs";
import { Cjson } from "coded-json";

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
        var prevDocPath: string = "";

        for(let i = 0; i < relativeVariablePaths.length; i ++) {
            if(workspace.workspaceFolders !== undefined) {
                var originRange = this.findRangeByTextInDocument(document.getText(), relativeVariablePaths[i]);

                if(this.checkPositionInRange(originRange, position)) {
                    this.curKey = relativeVariablePaths[i].split("$.")[1];
                    let splitKeys: string[] = this.curKey.split(".");

                    var docText: string = document.getText();
                    var docPath: string = document.fileName
                    var targetRange: Range = new Range(new Position(0, 0), new Position(0, 0));


                    for(let j = 0; j < splitKeys.length; j ++) {
                        var keysWithImports: any = this.findKeysWithImports(docText);

                        if(Object.keys(keysWithImports).includes(splitKeys[j])) {
                            docPath = path.join(path.dirname(document.fileName), keysWithImports[splitKeys[j]]);
                            docText = fs.readFileSync(docPath).toString();
                        }
                        else {
                            if(prevDocPath !== docPath) {
                                var cjson = new Cjson(docPath);
                                
                                if(Object.keys(cjson.deserialize()).includes(splitKeys[j])) {
                                    targetRange = this.findRangeByTextInDocument(docText, splitKeys[j])
                                    let jsn = JSON.parse(cjson.deserializeAsString())[splitKeys[j]]
                                    docText = JSON.stringify(jsn)
                                }
                                prevDocPath = docPath;
                            }
                            else {
                                if(Object.keys(JSON.parse(docText)).includes(splitKeys[j])) {
                                    docText = JSON.stringify(JSON.parse(docText)[splitKeys[j]])
                                    let gotRange: Range = this.findRangeByTextInDocument(docText, splitKeys[j]);
                                    let start: Position = new Position(targetRange.start.line + gotRange.start.line, targetRange.start.character + gotRange.start.character)
                                    let end: Position = new Position(targetRange.end.line + gotRange.end.line, targetRange.end.line + gotRange.end.line);
                                    targetRange = new Range(start, end);
                                }
                            }
                        }
                    }

                    return [{
                        targetRange: targetRange,
                        targetUri: Uri.file(docPath),
                        originSelectionRange: originRange,
                        targetSelectionRange: targetRange
                    }]
                }
            }
        }
    }
}