export default class Keywords {
    public static importKey: string = "$import \""; 
    public static singleLineComment: string = "//";
    public static multiLineCommentStart: string = "/*";
    public static multiLineCommentEnd: string = "*/";

    public static relativeJPath: string = "$.";
    public static relativeJPathRegex: RegExp = new RegExp("[$][.][.A-Za-z0-9]*", "g");
    
    public static runTimeValsRegex: RegExp = new RegExp("[<][A-Za-z0-9]*[>]", "g");

    public static pathRegex: RegExp = new RegExp("[A-Za-z0-9:\\.]+", "g");

    public static removeWithSucComa = (key: string, value: string): RegExp => new RegExp("\"" + key.split(".")[key.split(".").length - 1] + "\":\\s*\"*" + value + "\"*,*\\s*\\t*\\r*\"", "g");
    public static removeWithPreComa = (key: string, value: string): RegExp => new RegExp(",*\n*\s*\\t*\r*\"" + key.split(".")[key.split(".").length - 1] + "\":\\s*\"*" + value + "\"*", "g");
}