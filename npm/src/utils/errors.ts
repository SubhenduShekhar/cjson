export function UndefinedObjectError(message?: string) {
    if(message !== undefined)
        throw new Error(message);
    else throw new Error("Undefined object detected");
}

export function CJSONContentInsteadOfFilePath(message?: string) {
    if(message !== undefined)
        throw new Error(message);
    else throw new Error("Expected CJSON content instead of file path");
}

export function AbsolutePathConstraintError(message?: string) {
    if(message !== undefined) throw new Error(message);
    else throw new Error("Absolute path required instead of relative path");
}