package com.codedjson.utils;

import com.codedjson.Json;
import com.codedjson.types.ParsedValue;

import java.io.FileNotFoundException;
import java.lang.reflect.Field;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class Decode extends Json {
    protected List<String> runtimeVals = new ArrayList<>();
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
        for(String eachLine : commentedLines)
            content = content.replace(eachLine, "");
    }
    private String decodeRelativePaths(String content) {
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

            while (value.value.toString().contains("$."))
                value = parse(value.value.toString());

            if(value.type.equals("String"))
                content = content.replaceAll("\"<" + eachJPath.replace("$", "\\$") + ">\"", Matcher.quoteReplacement("\"" + value.value + "\""));
            else
                content = content.replaceAll("\"<" + eachJPath.replace("$", "\\$") + ">\"", Matcher.quoteReplacement(value.value.toString()));
        }

        return content;
    }
    private String decodeRuntimeKeys(String content) {

        Matcher matcher = Keywords.runtimeVals.matcher(content);

        while(matcher.find()) {
            String group = matcher.group();

            if(!runtimeVals.contains(group)) {
                String variable = group.split("<")[1].split(">")[0];
                runtimeVals.add(variable);

                if(!content.contains("\"<" + Matcher.quoteReplacement(group) + ">\"")) {
                    variable = "\"<-" + variable + "->\"";
                    content = content.replaceAll(Pattern.quote(group), Matcher.quoteReplacement(variable));
                }
            }
        }
        return content;
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
            content = decodeRuntimeKeys(content);
            if(! isChanged) break;
        }
        json = parseJson(content);

        content = decodeRelativePaths(content);
    }
    protected <InjectingClass>String replaceContent(String content, InjectingClass injectingObj) throws NoSuchFieldException, IllegalAccessException {
        Field[] fields = injectingObj.getClass().getFields();

        for(Field eachField : fields) {
            String fieldName = eachField.getName();
            if(content.contains("\"<-" + fieldName + "->\"")) {
                Object value = injectingObj.getClass().getField(fieldName).get(injectingObj);
                if (value.getClass().getName().contains("ArrayList")) {
                    String listVal = "[";
                    for (Object eachVal : (List<Object>) value) {
                        if (getType(eachVal).equals("string"))
                            listVal += "\"" + eachVal + "\",";
                        else
                            listVal += eachVal + ",";
                    }
                    listVal = listVal.substring(0, listVal.length() - 1) + "]";
                    content = content.replaceAll(Pattern.quote("\"<-" + runtimeVals.get(runtimeVals.indexOf(fieldName)) + "->\""), listVal.toString());
                } else if (!getType(value).equals("string"))
                    content = content.replaceAll(Pattern.quote("\"<-" + runtimeVals.get(runtimeVals.indexOf(fieldName)) + "->\""), value.toString());
                else
                    content = content.replaceAll(Pattern.quote("<-" + runtimeVals.get(runtimeVals.indexOf(fieldName)) + "->"), value.toString());
            }
        }
        return content;
    }
}