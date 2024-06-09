export class Base {
    protected obj: any;
    isInjectExist: boolean = false;
    decodedRuntimeKeyList: string[] | undefined = [];

    protected removeFromStringArray(incomingList: string[], elementToRemove: string) {
        if(incomingList.includes(elementToRemove)) {
            return incomingList.filter(element => element !== elementToRemove)
        }
        return incomingList;
    }
}