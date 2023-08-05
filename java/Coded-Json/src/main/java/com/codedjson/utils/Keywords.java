package com.codedjson.utils;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class Keywords {
    public static String importKey = "$import \"";
    public static String singleLineComment = "//";
    public static String relativeJPath = "$.";
    public static Pattern relativeJPathRegex = Pattern.compile("[$][.][.A-Za-z0-9]*");
    public static Pattern runtimeVals = Pattern.compile("[<][A-Za-z0-9]*[>]");
    public static Pattern keyValueSet(String key, String value) {
        value = value.replaceAll("\\.", "\\\\.")
                .replaceAll("\\[", "\\\\[")
                .replaceAll("\\?", "\\\\?")
                .replaceAll("\\*", "\\\\*")
                .replaceAll("\\+", "\\\\+")
                .replaceAll("\\{", "\\\\{")
                .replaceAll("\\$", "\\\\$")
                .replaceAll("\\^", "\\\\^");

        return Pattern.compile("\"" + key.split("\\.")[key.split("\\.").length - 1] + "\":" + value + ",?");
    }
}
