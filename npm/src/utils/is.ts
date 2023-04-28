import Keywords from "./keywords";

export class Is {
    protected isImport(lineItem: string) {
        if(lineItem.includes(Keywords.importKey))
            return true;
        return false;
    }

    protected isSingleLineComment(lineItem: string) {
        if(lineItem.includes(Keywords.singleLineComment))
            return true;
        return false;
    }

    protected isRelativeJPath(lineItem: string) {
        let splitByColon: string[] = lineItem.split(":");
        let relativeJPathKeys: string[] = [];
        for(let i = 0; i < splitByColon.length; i ++) {
            if(splitByColon[i].trim().startsWith(Keywords.relativeJPath))
                relativeJPathKeys.push(splitByColon[i].trim());
        }
        if(relativeJPathKeys.length === 0) return {
            Result: false,
            Keys: relativeJPathKeys
        };
        else return {
            Result: true,
            Keys: relativeJPathKeys
        }
    }
}