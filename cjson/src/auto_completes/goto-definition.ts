import { CancellationToken, Definition, DefinitionProvider, DeclarationProvider, Location, LocationLink, Position, ProviderResult, Range, TextDocument, Uri, window, workspace, Declaration } from "vscode";

export class GoToDefinition implements DefinitionProvider {
    provideDefinition(document: TextDocument, position: Position, token: CancellationToken): ProviderResult<Definition | LocationLink[]> {
        var locationLink: LocationLink[] = [];

        var urlLoc: Uri = Uri.file("C:\\Users\\Home\\OneDrive\\Desktop\\projects\\cjson\\tests\\test-files\\targetRelativeCalls.cjson");

        locationLink.push({
            targetRange: new Range(new Position(6, 9), new Position(7, 19)),
            targetUri: urlLoc,
            originSelectionRange: new Range(new Position(3, 5), new Position(3, 11)),
            targetSelectionRange: new Range(new Position(7, 9), new Position(7, 17))
        });
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