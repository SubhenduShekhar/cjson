package com.codedjson.utils;

import com.codedjson.Json;
import com.codedjson.exceptions.AbsolutePathConstraintError;
import com.codedjson.exceptions.IllegalJsonType;
import com.codedjson.exceptions.UndeserializedCJSON;
import com.codedjson.types.ParsedValue;
import com.google.gson.JsonObject;

import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class Decode extends Json {
    protected List<String> runtimeVals = new ArrayList<>();
    public Decode(String filePath, boolean isFilePath) throws FileNotFoundException {
        super(filePath, isFilePath);
    }
    public Decode(String filePath) {
        super(filePath);
    }
    private String getFilePath(String content) {
        return content.split(Pattern.quote(Keywords.importKey))[1].split("\"")[0];
    }
    private String decodeImport(String content) throws AbsolutePathConstraintError, FileNotFoundException {
        String filePath = this.getFilePath(content);
        String dirName;
        if(isAbsolutePath(filePath))
            dirName = filePath;
        else if(!isFilePath)
            throw new AbsolutePathConstraintError();
        else
            dirName = appendPath(getFullPath(), filePath);

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
            ParsedValue value = parseValue(eachJPath);

            while (value.value.toString().contains("$."))
                value = parseValue(value.value.toString());

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
    protected void decodeKeywords() throws AbsolutePathConstraintError, FileNotFoundException, IllegalJsonType {
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
    protected String replaceContent(String content, HashMap<String, Object> injectingObj) {
        for (String key : injectingObj.keySet())
            content = replaceContent(content, key, injectingObj.get(key));
        return content;
    }
    protected String replaceContent(String content, String key, Object value) {
        if (content.contains("\"<-" + key + "->\"")) {
            if (getType(value).equals("string"))
                content = content.replaceAll("<-" + key + "->", Matcher.quoteReplacement((String) value));
            else
                content = content.replaceAll("\"<-" + key + "->\"", Matcher.quoteReplacement(value.toString()));
        }
        return content;
    }
    protected void removeWithKey(String key) {
        if(key.startsWith(Keywords.relativeJPath))
            key = key.replace(Keywords.relativeJPath, "");

        String value = parseValue(key).value.toString();

        Matcher matcher = Keywords.keyValueSet(key, value, content).matcher(content);
        while (matcher.find()) {
            String group = matcher.group();
            content = content.replace(group, "");
        }
    }
    /*protected void findPathToConstruct(String key, Object value) {
        String[] keySets = key.split(Matcher.quoteReplacement(Keywords.relativeJPath))[1].split("\\.");
        String pathConstruct = "";
        Object valObject = null;

        for(String eachKey : keySets) {
            if(pathConstruct.equals(""))
                pathConstruct += eachKey;
            else
                pathConstruct += "." + eachKey;
            try {
                Object tempVal = getValueFromKey(pathConstruct);
                if(tempVal == null) throw new Exception();
                else valObject = tempVal;
            }
            catch (Exception e) {
                String updatedValue;// = valObject.toString() + ",";

                if(valObject.toString().endsWith("}")) {
                    updatedValue = valObject.toString().split("}")[0] + ",";
                    if(value.getClass().getName().toLowerCase().contains("string"))
                        updatedValue += eachKey + ":\"" + value + "\"";
                    else
                        updatedValue += eachKey + ":" + value;
                    updatedValue += "}";
                }
                else if(valObject.toString().endsWith("]")) {
                    updatedValue = valObject.toString().split("]")[0] + ",";
                    if(value.getClass().getName().toLowerCase().contains("string"))
                        updatedValue += eachKey + ":\"" + value + "\"";
                    else
                        updatedValue += eachKey + ":" + value;
                    updatedValue += "]";
                }
                else {

                }
                *//*if(value.getClass().getName().toLowerCase().contains("string"))
                    updatedValue += eachKey + ":\"" + value + "\"";
                else
                    updatedValue += eachKey + ":" + value;*//*
                content = content.replace(valObject.toString(), updatedValue);
            }
        }
    }*/
}