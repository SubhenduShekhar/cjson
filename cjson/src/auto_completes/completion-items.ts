import { CancellationToken, CompletionContext, CompletionItem, CompletionItemProvider, CompletionList, Position, ProviderResult, Range, TextDocument } from "vscode";
import * as fs from "fs";

export class CompletionItems implements CompletionItemProvider {
    private fileList: string[] | undefined;
    private completionItemList: CompletionItem[] = [];

    constructor(fileList: string[] | undefined) {
        this.fileList = fileList;
    }

    checkAndConfirm(item: string) {
        for(let i = 0; i < this.completionItemList.length; i ++) 
            if(JSON.parse(JSON.stringify(this.completionItemList[i].label.valueOf()))["label"] === item)
                return true;

        return false;
    }

    provideCompletionItems(document: TextDocument, position: Position, token: CancellationToken, context: CompletionContext): ProviderResult<CompletionItem[] | CompletionList<CompletionItem>> {
        if(context.triggerCharacter === "/") {
            if(this.fileList != undefined) {
                for(let i = 0; i < this.fileList.length; i ++) {
                    if(!this.checkAndConfirm(this.fileList[i])) 
                        this.completionItemList.push(new CompletionItem({
                            label: this.fileList[i]
                        }))
                }
            }
        }
        else {
            this.completionItemList = [];
            console.log("cleared")
        }
        return this.completionItemList;
    }

    resolveCompletionItem?(item: CompletionItem, token: CancellationToken): ProviderResult<CompletionItem> {
        return item;
    }
}