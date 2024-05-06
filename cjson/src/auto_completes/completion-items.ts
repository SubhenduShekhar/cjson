import { CancellationToken, CompletionContext, CompletionItem, CompletionItemProvider, CompletionList, Position, ProviderResult, TextDocument } from "vscode";

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
        if(this.fileList != undefined) {
            for(let i = 0; i < this.fileList.length; i ++) {
                if(!this.checkAndConfirm(this.fileList[i])) 
                    this.completionItemList.push(new CompletionItem({
                        label: "\"" + this.fileList[i] + "\""
                    }))
            }
        }
        
        return this.completionItemList;
    }

    resolveCompletionItem?(item: CompletionItem, token: CancellationToken): ProviderResult<CompletionItem> {
        throw new Error("Method not implemented.");
    }
}