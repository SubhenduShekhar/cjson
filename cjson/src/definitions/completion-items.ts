import { CancellationToken, CompletionContext, CompletionItem, CompletionItemKind, CompletionItemProvider, CompletionList, Position, ProviderResult, Range, TextDocument, commands, window, workspace } from "vscode";
import { BackTrackSearchResult, DirectoryContent } from "../utils/interfaces";
import { setAutCompleteList } from "../utils/utils";
import { Registers } from "./register";
import { Base } from "./base";
import { Cjson } from "coded-json";
import path from "path";

export class CompletionItems extends Base implements CompletionItemProvider {
    private fileList: DirectoryContent[] | undefined;
    public completionItemList: CompletionItem[] = [];
    public previousCompleteList: CompletionItem[] = [];
    // Condition for checkAndConfirm to work as expected
    private isDirectoryChanged: boolean = false;

    protected checkAndConfirm(item: string): boolean {
        if(this.isDirectoryChanged)
            return false;
        else {
            for(let i = 0; i < this.completionItemList.length; i ++) 
                if(JSON.parse(JSON.stringify(this.completionItemList[i].label.valueOf())) === item)
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
        
        this.previousCompleteList = this.completionItemList;

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
                this.completionItemList.push({
                    label: importPaths[importPaths.length - 1]
                })
                }
                else {
                    this.fileList = setAutCompleteList(".");
                    this.setCompletionItemsList();
                    this.isDirectoryChanged = false;
                }
            }
        }

        if(this.isCompletionListChanged(this.previousCompleteList, this.completionItemList))
            Registers.registerGoToImportDefinitionCommand();

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

    public isCompletionListChanged(sourceCompletionList: CompletionItem[], targetCompletionList: CompletionItem[]): boolean {
        if(sourceCompletionList.length !== targetCompletionList.length)
            return true;
        else {
            for(let i = 0; i < sourceCompletionList.length; i ++) {
                if(sourceCompletionList[i].label !== targetCompletionList[i].label)
                    return true;
            }
            return false;
        }
    }
}

export class RelativeVariableCompletionProvider extends Base implements CompletionItemProvider {
    public completionItemList: CompletionItem[] = [];

    protected checkAndConfirm(item: string): boolean {
        for(let i = 0; i < this.completionItemList.length; i ++) 
            if(JSON.parse(JSON.stringify(this.completionItemList[i].label.valueOf())) === item)
                return true;
        return false;
    }

    provideCompletionItems(document: TextDocument, position: Position, token: CancellationToken, context: CompletionContext): ProviderResult<CompletionItem[] | CompletionList<CompletionItem>> {
        if(workspace.workspaceFolders) {
            if(document.fileName !== undefined) {
                var cjson = new Cjson(document.fileName);
                cjson.json?.getAllKeys().map((eachElem) => {
                    if(! this.checkAndConfirm(eachElem))
                        this.completionItemList.push(new CompletionItem(eachElem));
                });
            }
            else
                window.showErrorMessage("No CJSON file is opened");
        }
        else
            window.showErrorMessage("CJSON requires folder to be opened");
        return this.completionItemList;
    }
    resolveCompletionItem?(item: CompletionItem, token: CancellationToken): ProviderResult<CompletionItem> {
        return item;
    }
}