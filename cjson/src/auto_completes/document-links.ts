import { CancellationToken, DocumentLink, DocumentLinkProvider, Position, ProviderResult, Range, TextDocument, Uri } from "vscode";

export class CJsonDocumentLinkProvider implements DocumentLinkProvider {
    openPath: Uri = Uri.file("C:\\Users\\Home\\OneDrive\\Desktop\\projects\\cjson\\tests\\test-files\\targetRelativeCalls.cjson");
    range: Range = new Range(new Position(4, 9), new Position(4, 14));

    provideDocumentLinks(document: TextDocument, token: CancellationToken): ProviderResult<DocumentLink[]> {
        var a = new DocumentLink(this.range, this.openPath);
        return [a];
    }
    resolveDocumentLink?(link: DocumentLink, token: CancellationToken): ProviderResult<DocumentLink> {
        return link;
    }
    
}