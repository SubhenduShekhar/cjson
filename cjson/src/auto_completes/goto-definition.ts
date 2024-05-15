import { CancellationToken, Definition, DefinitionProvider, LocationLink, Position, ProviderResult, Range, TextDocument, TextLine, Uri, window, workspace } from "vscode";
import path from "path";
import vscode from "vscode";

export class GoToImportDefinition implements DefinitionProvider {
    importPaths: string[] = [];

    findImportInDocument(documentText: string) {
        let importPaths: string[] = []

        while(documentText.includes("$import \"")) {
            let imports: string = documentText.split("$import \"")[1].split("\"")[0];
            documentText = documentText.replace("$import \"" + imports + "\"", "");
            importPaths.push(imports);
        }

        return importPaths;
    }

    findRangeByTextInDocument(document: TextDocument, text: string) {
        let splitDoc: string[] = document.getText().split("\n");
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
                var originRange = this.findRangeByTextInDocument(document, this.importPaths[i]);

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
    }
}