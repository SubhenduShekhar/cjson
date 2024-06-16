import { Position, Range, TextDocument } from "vscode";

export abstract class Base {
    protected getCharactersByRange(document: TextDocument, startPosition: Position, endPosition: Position) {
        return document.getText(new Range(startPosition, endPosition));
    }
    protected abstract checkAndConfirm(item: string): boolean;
}

export abstract class GotoDefinitionBase{
    protected abstract findRangeByTextInDocument(document: TextDocument, text: string, lineNumber: number): Range;

    protected checkPositionInRange(range: Range, position: Position) {
        return range.contains(position);
    }
}