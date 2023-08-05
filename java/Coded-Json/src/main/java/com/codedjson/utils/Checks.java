package com.codedjson.utils;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class Checks {
    /**
     * Checks if expecting runtime keys
     */
    public boolean runtimeKeys(String content) {
        Matcher matcher = Keywords.runtimeVals.matcher(content);

        while(matcher.find()) {
            return true;
        }
        return false;
    }
}
