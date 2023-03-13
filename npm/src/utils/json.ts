export function isContentJson(content: string) {
    try {
        JSON.parse(content);
        return true;
    }
    catch {
        return false;
    }
}

export function separateByComma(content: string) {
    return content.split(",");
}