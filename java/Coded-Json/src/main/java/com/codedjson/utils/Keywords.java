package com.codedjson.utils;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class Keywords {
    public static String importKey = "$import \"";
    public static String singleLineComment = "//";
    public static String relativeJPath = "$.";
    public static Pattern relativeJPathRegex = Pattern.compile("[$][.][.A-Za-z0-9]*");
    public static Pattern runtimeVals = Pattern.compile("[<][A-Za-z0-9]*[>]");
    private static Pattern removeWithPreComma(String key, String value, String content) {
        Pattern pattern = Pattern.compile(",+\"" + key.split("\\.")[key.split("\\.").length - 1] + "\":\"?" + value + "\"?");
        Matcher matcher = pattern.matcher(content);
        while (matcher.find()) {
            matcher.group();
            return pattern;
        }
        return null;
    }
    private static Pattern removeWithSucComma(String key, String value, String content) {
        Pattern pattern = Pattern.compile("\"" + key.split("\\.")[key.split("\\.").length - 1] + "\":\"?" + value + "\"?,+");
        Matcher matcher = pattern.matcher(content);
        while (matcher.find()) {
            matcher.group();
            return pattern;
        }
        return null;
    }
    public static Pattern keyValueSet(String key, String value, String content) {
        value = value.replaceAll("\\.", "\\\\.")
                .replaceAll("\\[", "\\\\[")
                .replaceAll("\\?", "\\\\?")
                .replaceAll("\\*", "\\\\*")
                .replaceAll("\\+", "\\\\+")
                .replaceAll("\\{", "\\\\{")
                .replaceAll("\\$", "\\\\$")
                .replaceAll("\\^", "\\\\^");

        Pattern pattern = removeWithSucComma(key, value, content);
        if(pattern != null) return pattern;
        else return removeWithPreComma(key, value, content);
    }
}
