import { CancellationToken, CompletionContext, CompletionItem, CompletionItemKind, CompletionItemProvider, CompletionList, Position, ProviderResult, Range, TextDocument, workspace } from "vscode";
import * as fs from "fs";
import { BackTrackSearchResult, DirectoryContent } from "../utils/interfaces";
import { convertDirectoryContentPathToRelative, setAutCompleteList } from "../utils/utils";

export class CompletionItems implements CompletionItemProvider {
    private fileList: DirectoryContent[] | undefined;
    private completionItemList: CompletionItem[] = [];

    constructor(fileList: DirectoryContent[] | undefined) {
        this.fileList = fileList;
    }

    checkAndConfirm(item: string) {
        for(let i = 0; i < this.completionItemList.length; i ++) 
            if(JSON.parse(JSON.stringify(this.completionItemList[i].label.valueOf()))["label"] === item)
                return true;

        return false;
    }

    backTrackAndCheckForString(document: TextDocument, position: Position, testChar: string): BackTrackSearchResult {
        let i = 2;
        if(document.getText().split("\n")[position.line].includes("$import ")) {
            var positionCharacterMatch = document.getText(new Range(position, new Position(position.line, position.character - i)));
            try {
                while(!(positionCharacterMatch.startsWith(testChar) || positionCharacterMatch.startsWith(testChar))) {
                    positionCharacterMatch = document.getText(new Range(position, new Position(position.line, position.character - i)));
                    i ++;
                }
                return {
                    strSet: positionCharacterMatch.substring(1, positionCharacterMatch.length - 1),
                    result: true
                };
            }
            catch(error) {
                return {
                    strSet: null,
                    result: false
                };
            }
        }
        else {
            return {
                strSet: null,
                result: false
            }
        }
    }

    provideCompletionItems(document: TextDocument, position: Position, token: CancellationToken, context: CompletionContext): ProviderResult<CompletionItem[] | CompletionList<CompletionItem>> {
        this.fileList = setAutCompleteList();

        var positionCharacterMatch = document.getText(new Range(position, new Position(position.line, position.character - 3)));
        var triggerToken: string = document.getText(new Range(position, new Position(position.line, position.character - 1)));

        if(positionCharacterMatch === "\"./") {
            if(this.fileList != undefined) {
                for(let i = 0; i < this.fileList.length; i ++) {
                    if(!this.checkAndConfirm(this.fileList[i].url) && !this.fileList[i].isDirectory) 
                        this.completionItemList.push(new CompletionItem({
                            label: this.fileList[i].url
                        }, CompletionItemKind.File))
                    else
                        this.completionItemList.push(new CompletionItem({
                            label: this.fileList[i].url
                        }, CompletionItemKind.Folder))
                }
            }
        }
        else if(triggerToken === "/" || triggerToken === "\\") {
            var backtrackResult: BackTrackSearchResult = this.backTrackAndCheckForString(document, position, "/");
            if(backtrackResult.result && backtrackResult.strSet !== null) {
                if(this.fileList!== undefined) {
                    for(let i = 0; i < this.fileList.length; i ++) {
                        if(this.fileList[i].filename === backtrackResult.strSet) {
                            if(this.fileList[i].isDirectory) {
                                console.log("yes");
                            }
                        }
                    }
                }
                
            }
        }
        else 
            this.completionItemList = [];
        return this.completionItemList;
    }

    resolveCompletionItem?(item: CompletionItem, token: CancellationToken): ProviderResult<CompletionItem> {
        return item;
    }
}