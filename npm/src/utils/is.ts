export class Is {
    protected isImport(lineItem: string) {
        if(lineItem.includes("$import \""))
            return true;
        return false;
    }
}