package com.codedjson.utils;

import com.codedjson.Json;
import com.codedjson.types.ParsedValue;

import java.io.FileNotFoundException;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class Decode extends Json {
    public Decode(String filePath, boolean isFilePath) throws Exception {
        super(filePath, isFilePath);
    }
    private String getFilePath(String content) {
        return content.split(Pattern.quote(Keywords.importKey))[1].split("\"")[0];
    }
    private String decodeImport(String content) throws FileNotFoundException {
        String filePath = this.getFilePath(content);

        String dirName = appendPath(getFullPath(), filePath);
        content = content.replaceAll(Pattern.quote(Keywords.importKey + filePath + "\""), Matcher.quoteReplacement(read(dirName)));

        if(isImport(content)) {
            decodeImport(content);
        }
        return content;
    }
    private void decodeSingleLineComment() {
        String[] lineSplit = content.split("\n");
        for(String eachLineSplit : lineSplit) {
            if(!eachLineSplit.trim().equals("") && eachLineSplit.trim().startsWith(Keywords.singleLineComment))
                content = content.replaceAll(eachLineSplit, "");
        }
    }
    private void decodeRelativePaths(String content) throws Exception {
        List<String> jpaths = new ArrayList<>();

        Matcher matcher = Keywords.relativeJPathRegex.matcher(content);

        while(matcher.find()) {
            String group = matcher.group();

            if(!jpaths.contains(group)) {
                jpaths.add(group);
                content = content.replaceAll(Pattern.quote(group), "\"<" + group.replace("$", "\\$") + ">\"");
            }
        }

        for(String eachJPath : jpaths) {
            ParsedValue value = parse(eachJPath);

            if(value.type.equals("String"))
                content = content.replaceAll("\"<" + eachJPath.replace("$", "\\$") + ">\"", Matcher.quoteReplacement("\"" + value.value + "\""));
            else
                content = content.replaceAll("\"<" + eachJPath.replace("$", "\\$") + ">\"", Matcher.quoteReplacement(value.value.toString()));
        }
    }
    protected void decodeKeywords() throws Exception {
        boolean isChanged;
        while(true) {
            isChanged = false;

            if(isImport(content)) {
                content = decodeImport(content);
                isChanged = true;
            }
            if(isSingleLineComent(content)) {
                decodeSingleLineComment();
                isChanged = true;
            }
            if(! isChanged) break;
        }
        json = parseJson(content);

        decodeRelativePaths(content);
    }
}