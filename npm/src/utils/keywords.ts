export default class Keywords {
    public static importKey: string = "$import \""; 
    public static singleLineComment: string = "//";
    public static multiLineCommentStart: string = "/*";
    public static multiLineCommentEnd: string = "*/";

    public static relativeJPath: string = "$.";
    public static relativeJPathRegex: RegExp = new RegExp("[$][.][.A-Za-z0-9]*", "g");
    
    public static runTimeValsRegex: RegExp = new RegExp("[<][A-Za-z0-9]*[>]", "g");

    public static pathRegex: RegExp = new RegExp("[A-Za-z0-9:\\.]+", "g");

}