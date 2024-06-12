import { Position, Range, TextDocument } from "vscode";

export abstract class Base {
    protected getCharactersByRange(document: TextDocument, startPosition: Position, endPosition: Position) {
        return document.getText(new Range(startPosition, endPosition));
    }
    protected abstract checkAndConfirm(item: string): boolean;
}