import Keywords from "./keywords";

export class Is {
    protected isImport(lineItem: string) {
        if(lineItem.includes(Keywords.importCheck))
            return true;
        return false;
    }

    protected isSingleLineComment(lineItem: string) {
        if(lineItem.includes(Keywords.singleLineComment))
            return true;
        return false;
    }

    protected isMultiLineCommentStart(lineItem: string) {
        if(lineItem.includes(Keywords.multiLineCommentStart))
            return true;
        return false;
    }

    protected isMultiLineCommentEnd(lineItem: string) {
        if(lineItem.includes(Keywords.multiLineCommentEnd))
            return true;
        return false;
    }
}