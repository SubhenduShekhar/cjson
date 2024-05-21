import { CancellationToken, CompletionContext, CompletionItem, CompletionItemKind, CompletionItemProvider, CompletionList, Position, ProviderResult, Range, TextDocument, window, workspace } from "vscode";
import { BackTrackSearchResult, DirectoryContent } from "../utils/interfaces";
import { setAutCompleteList } from "../utils/utils";

export class CompletionItems implements CompletionItemProvider {
    private fileList: DirectoryContent[] | undefined;
    private completionItemList: CompletionItem[] = [];
    // Condition for checkAndConfirm to work as expected
    private isDirectoryChanged: boolean = false;

    private checkAndConfirm(item: string) {
        if(this.isDirectoryChanged)
            return false;
        else {
            for(let i = 0; i < this.completionItemList.length; i ++) 
                if(JSON.parse(JSON.stringify(this.completionItemList[i].label.valueOf()))["label"] === item)
                    return true;
            return false;
        }
    }

    private backTrackAndCheckForString(document: TextDocument, position: Position, testChar: string): BackTrackSearchResult {
        let i = 2;
        if(document.getText().split("\n")[position.line].includes("$import ")) {
            var positionCharacterMatch = document.getText(new Range(position, new Position(position.line, position.character - i)));
            var lastValidPath: string = document.getText().split("\n")[position.line].split("$import \"")[1].split("\"")[0];

            try {
                while(! positionCharacterMatch.startsWith(testChar)) {
                    positionCharacterMatch = document.getText(new Range(position, new Position(position.line, position.character - i)));
                    i ++;
                }
                return {
                    strSet: positionCharacterMatch.substring(1, positionCharacterMatch.length - 1),
                    result: true,
                    lastValidPath: lastValidPath.replace(positionCharacterMatch, ""),
                    fullImportStatement: lastValidPath
                };
            }
            catch(error) {
                return {
                    strSet: null,
                    result: false,
                    lastValidPath: null,
                    fullImportStatement: lastValidPath
                };
            }
        }
        else {
            return {
                strSet: null,
                result: false,
                lastValidPath: null,
                fullImportStatement: null
            }
        }
    }

    provideCompletionItems(document: TextDocument, position: Position, token: CancellationToken, context: CompletionContext): ProviderResult<CompletionItem[] | CompletionList<CompletionItem>> {
        this.fileList = setAutCompleteList();

        var positionCharacterMatch = document.getText(new Range(position, new Position(position.line, position.character - 3)));
        var triggerToken: string = document.getText(new Range(position, new Position(position.line, position.character - 1)));

        this.completionItemList = [];

        if(positionCharacterMatch === "\"./") {
            this.setCompletionItemsList();
            this.isDirectoryChanged = false;
        }
        else if(triggerToken === ".") {
            this.completionItemList = [{
                label: "/"
            }]
        }
        else if(triggerToken === "/" || triggerToken === "\\") {
            var backtrackResult: BackTrackSearchResult = this.backTrackAndCheckForString(document, position, ".");
            this.isDirectoryChanged = true;

            if(backtrackResult.result && backtrackResult.strSet !== null) {
                if(this.fileList !== undefined) {
                    this.fileList = setAutCompleteList(backtrackResult.strSet);
                    this.setCompletionItemsList();
                }
                else
                    this.completionItemList = [];
            }
        }
        else {
            this.isDirectoryChanged = true;
            var backtrackResult: BackTrackSearchResult = this.backTrackAndCheckForString(document, position, "/");
            if(backtrackResult.fullImportStatement !== null) {
                let importPaths: string[] = backtrackResult.fullImportStatement?.split("/");
                if(importPaths[importPaths.length - 1].includes(".json")
                    || importPaths[importPaths.length - 1].includes(".cjson")) {
                }
                else {
                    this.fileList = setAutCompleteList(".");
                    this.setCompletionItemsList();
                    this.isDirectoryChanged = false;
                }
            }
        }
        return this.completionItemList;
    }

    resolveCompletionItem?(item: CompletionItem, token: CancellationToken): ProviderResult<CompletionItem> {
        return item;
    }

    private setCompletionItemsList() {
        if(this.fileList != undefined) {
            for(let i = 0; i < this.fileList.length; i ++) {
                if(!this.checkAndConfirm(this.fileList[i].url)) {
                    if(!this.fileList[i].isDirectory) 
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
        else 
            this.completionItemList = [];
    }
}