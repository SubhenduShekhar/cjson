import { CancellationToken, Definition, DefinitionProvider, DeclarationProvider, Location, LocationLink, Position, ProviderResult, Range, TextDocument, Uri, window, workspace, Declaration } from "vscode";
import path from "path";

export class GoToImportDefinition implements DefinitionProvider {
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

    provideDefinition(document: TextDocument, position: Position, token: CancellationToken): ProviderResult<Definition | LocationLink[]> {
        var locationLink: LocationLink[] = [];
        
        var importPaths: string[] = this.findImportInDocument(document.getText());

        var urlLoc: Uri = Uri.file("C:\\Users\\Home\\OneDrive\\Desktop\\projects\\cjson\\tests\\test-files\\targetRelativeCalls.cjson");

        // locationLink.push({
        //     targetRange: new Range(new Position(6, 9), new Position(7, 19)),
        //     targetUri: urlLoc,
        //     originSelectionRange: new Range(new Position(3, 5), new Position(3, 11)),
        //     targetSelectionRange: new Range(new Position(7, 9), new Position(7, 17))
        // });

        for(let i = 0; i < importPaths.length; i ++) {
            if(workspace.workspaceFolders !== undefined) {
                var paths = path.join(workspace.workspaceFolders[0].uri.path, importPaths[i]);
                var urlLoc: Uri = Uri.file(paths);

                locationLink.push({
                    targetRange: new Range(new Position(6, 9), new Position(7, 19)),
                    targetUri: urlLoc,
                    originSelectionRange: new Range(new Position(i, 5), new Position(i, 11)),
                    targetSelectionRange: new Range(new Position(7, 9), new Position(7, 17))
                });
            }
        }
        return locationLink;
    }
}

// export class GoToDeclaration implements DeclarationProvider {
//     provideDeclaration(document: TextDocument, position: Position, token: CancellationToken): ProviderResult<Declaration> {
//         var a:Declaration = {
//             range: new Range(new Position(4, 5), new Position(4, 11)),
//             uri: document.uri
//         }
//         return a;
//     }
// }