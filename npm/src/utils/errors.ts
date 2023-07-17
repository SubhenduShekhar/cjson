export function UndefinedObjectError(message?: string) {
    if(message !== undefined)
        throw new Error(message);
    else throw new Error("Undefined object detected");
}