package com.codedjson.utils;

import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;

public class Is extends Base {
    public Is(String filePath, boolean isFilePath) throws FileNotFoundException {
        super(filePath, isFilePath);
    }
    public Is(String content) {
        super(content);
    }

    protected boolean isImport(String content) {
        return content.contains(Keywords.importKey);
    }
    protected boolean isSingleLineComent(String content) {
        commentedLines = new ArrayList<>();
        for (String eachLines : commaSeparatedLines = content.split("\n")) {
            if(eachLines.trim().startsWith(Keywords.singleLineComment))
                commentedLines.add(eachLines.trim());
        }
        return (commentedLines.size() != 0) ? true : false;
    }

    protected RelativeJPath isRelativeJPath(String content) {
        String[] splitByColon = content.split(":");
        List<String> relativeJPathKeys = new ArrayList<String>();
        for (String eachSplitByColon : splitByColon) {
            if(eachSplitByColon.trim().startsWith(Keywords.relativeJPath))
                relativeJPathKeys.add(eachSplitByColon.trim());
        }
        return (relativeJPathKeys.size() == 0 ?
                new RelativeJPath(false, relativeJPathKeys) :
                new RelativeJPath(true, relativeJPathKeys));
    }
    protected String getProvidedDataType(String filePath) {
        if(Keywords.importAsDataType(Matcher.quoteReplacement(filePath), "string").matcher(content).find())
            return "string";
        else if(Keywords.importAsDataType(Matcher.quoteReplacement(filePath), "int").matcher(content).find())
            return "int";
        else if(Keywords.importAsDataType(Matcher.quoteReplacement(filePath), "double").matcher(content).find())
            return "double";
        else if(Keywords.importAsDataType(Matcher.quoteReplacement(filePath), "char").matcher(content).find())
            return "char";
        else if(Keywords.importAsDataType(Matcher.quoteReplacement(filePath), "boolean").matcher(content).find())
            return "boolean";
        else return null;
    }
}
