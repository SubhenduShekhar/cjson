package com.codedjson.utils;

import com.codedjson.*;
import com.codedjson.exceptions.AbsolutePathConstraintError;
import com.codedjson.exceptions.IllegalJsonType;
import com.codedjson.exceptions.UndeserializedCJSON;
import com.codedjson.types.ParsedValue;
import com.google.gson.JsonObject;

import java.io.FileNotFoundException;
import java.lang.reflect.Field;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class Decode extends Json {
    private static List<String> stringToIgnore = Arrays.asList( "hash", "serialVersionUID", "serialPersistentFields", "CASE_INSENSITIVE_ORDER", "MIN_VALUE", "MAX_VALUE", "TYPE", "digits", "DigitTens", "DigitOnes", "sizeTable", "SIZE", "BYTES", "serialVersionUID",
            "POSITIVE_INFINITY", "NEGATIVE_INFINITY", "NaN", "MIN_NORMAL", "MAX_EXPONENT", "MIN_EXPONENT");
    protected List<String> runtimeVals = new ArrayList<>();
    private List<String> jpaths = new ArrayList<>();
    public Decode(String filePath, boolean isFilePath) throws FileNotFoundException {
        super(filePath, isFilePath);
    }
    public Decode(String filePath) {
        super(filePath);
    }
    private String getFilePath(String content) {
        return content.split(Pattern.quote(Keywords.importKey))[1].split("\"")[0];
    }
    private String decodeImport(String content, String curPath) throws AbsolutePathConstraintError, FileNotFoundException {
        String filePath = this.getFilePath(content);
        String fileName = filePath.split("/")[filePath.split("/").length - 1];

        String importFilePath;
        if(isAbsolutePath(filePath))
            importFilePath = filePath;
        else if(!isFilePath)
            throw new AbsolutePathConstraintError();
        else {
            String dirName = appendPath(getFullPath(), getDirectory(filePath));

            if(! curPath.equals(""))
                dirName = Paths.get(curPath, getDirectory(filePath)).toString();

            importFilePath = appendPath(dirName, fileName);
        }

        String innerContent = read(importFilePath);
        String quoteReplacedContent = null;
        if(isImport(innerContent)) {
            quoteReplacedContent = Matcher.quoteReplacement(decodeImport(innerContent, getDirectory(importFilePath)));
        }
        else
            quoteReplacedContent = Matcher.quoteReplacement(innerContent);

        content = content.replaceAll(Pattern.quote(Keywords.importKey + filePath + "\""), quoteReplacedContent);

        if(isImport(content))
            content = decodeImport(content, curPath);

        return content;
    }
    private void decodeSingleLineComment() {
        for(String eachLine : commentedLines)
            content = content.replace(eachLine, "");
    }
    private String decodeRelativePaths(String content) throws IllegalJsonType {
        Matcher matcher = Keywords.relativeJPathRegex.matcher(content);

        while (matcher.find()) {
            String group = matcher.group();

            if (!jpaths.contains(group)) {
                jpaths.add(group);
                content = content.replaceAll(Pattern.quote(group), "\"<" + group.replace("$", "\\$") + ">\"");
            }
        }

        json = parseJson(content);

        return content;
    }
    private String decodeRuntimeKeys(String content) {

        Matcher matcher = Keywords.runtimeVals.matcher(content);

        while(matcher.find()) {
            isInjectDone = false;
            isInjectExist = true;
            String group = matcher.group();

            if(!runtimeVals.contains(group)) {
                String variable = group.split("<")[1].split(">")[0];
                runtimeVals.add(variable);

                Matcher ignoreUnderQuotes = Pattern.compile("\".*" + Matcher.quoteReplacement(group) + ".*\"").matcher(content);
                if (!ignoreUnderQuotes.find()) {
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
                if(this.filePath != null)
                    content = decodeImport(content, getDirectory(filePath));
                else
                    content = decodeImport(content, "");
                isChanged = true;
            }
            if(isSingleLineComent(content)) {
                decodeSingleLineComment();
                isChanged = true;
            }
            content = decodeRuntimeKeys(content);
            if(! isChanged) break;
        }
        content = decodeRelativePaths(content);

        json = parseJson(content);
    }
    protected String replaceContent(String content, HashMap<String, Object> injectingObj) {
        for (String key : injectingObj.keySet())
            content = replaceContent(content, key, injectingObj.get(key));
        return content;
    }
    protected String replaceContent(String content, String key, Object value) {
        if (content.contains("\"<-" + key + "->\"")) {
            key = Pattern.quote(key);
            if(value == null)
                content = content.replaceAll("\"<-" + key + "->\"", "null");
            else if(isContentJson(value.toString()))
                content = content.replaceAll("\"<-" + key + "->\"", (String) value);
            else if (getType(value).equals("string"))
                content = content.replaceAll("<-" + key + "->", Matcher.quoteReplacement((String) value));
            else
                content = content.replaceAll("\"<-" + key + "->\"", Matcher.quoteReplacement(value.toString()));
        }
        return content;
    }
    protected void removeWithKey(String key) {
        if(key.startsWith(Keywords.relativeJPath))
            key = key.replace(Keywords.relativeJPath, "");

        String value = null;
        try {
            value = parseValue(key).value.toString();
        } catch (NullPointerException nullPointerException) {
            throw new NullPointerException("$." + key + " is not found in deserialized JSON");
        }

        Matcher matcher = Keywords.keyValueSet(key, value, content).matcher(content);
        while (matcher.find()) {
            String group = matcher.group();
            content = content.replace(group, "");
        }
    }
    /**
     * Master function to convert JAVA object to JSON string
     * @param object
     * @return
     * @throws IllegalAccessException
     */
    protected static String getAsString(Object object) throws IllegalAccessException {
        if(object == null) return "null";
        else if(object.getClass().getName().toLowerCase().contains("int")
                || object.getClass().getName().toLowerCase().contains("double")
                || object.getClass().getName().toLowerCase().contains("boolean")) {
            for (Field field : object.getClass().getDeclaredFields()) {
                if(! stringToIgnore.contains(field.getName()))
                    return object.toString();
            }
            return null;
        }
        else if(object.getClass().getName().toLowerCase().contains("string")) {
            for (Field field : object.getClass().getDeclaredFields()) {
                if(! stringToIgnore.contains(field.getName()))
                    return "\"" + object + "\"";
            }
            return null;
        }
        else if(object.getClass().getName().toLowerCase().contains("arraylist")) {
            List<Object> li = (List<Object>) object;
            if(li == null)
                return "[]";
            else if(li.size() == 0)
                return "[]";

            String values = "[";
            for(Object obj : li) {
                if(obj.getClass().getName().toLowerCase().contains("string"))
                    values += "\"" + obj + "\",";
                else
                    values += getAsString(obj) + ",";
            }
            values = values.substring(0, values.length() - 1);
            return values + "]";
        }
        else if(object.getClass().getName().toLowerCase().contains("hashmap")) {
            String values = "{";
            HashMap<String, Object> hashObj = (HashMap<String, Object>) object;
            for (String keys : hashObj.keySet()) {
                if(hashObj.get(keys) != null) {
                    if(hashObj.get(keys).getClass().getName().toLowerCase().contains("string"))
                        values += "\"" + keys + "\":\"" + hashObj.get(keys) + "\",";
                    else
                        values += "\"" + keys + "\":" + getAsString(hashObj.get(keys)) + ",";
                }
                else return "null";
            }
            return values.substring(0, values.length() - 1) + "}";
        }
        else {
            Field[] fields = object.getClass().getFields();
            String values = "{";
            for(Field field : fields) {
                field.setAccessible(true);
                Object a = getAsString(field.get(object));
                if(! stringToIgnore.contains(field.getName()))
                    values += "\"" + field.getName() + "\":" + a + ",";
            }
            values = values.substring(0, values.length() - 1);
            return values + "}";
        }
    }
    protected String decodeRelativePathValues(String content) {
        Matcher matcher = Keywords.encodedRelativeJPathRegex.matcher(content);

        while (matcher.find()) {
            String eachJPath = matcher.group();

            ParsedValue value = parseValue(eachJPath);
            if(value.value != null) {
                while (value.value.toString().contains("$."))
                    value = parseValue(value.value.toString());

                if (value.type.equals("String"))
                    content = content.replaceAll(eachJPath.replace("$", "\\$"), Matcher.quoteReplacement(value.value.toString()));
                else
                    content = content.replaceAll("\"" + eachJPath.replace("$", "\\$") + "\"", Matcher.quoteReplacement(value.value.toString()));
            }
        }

        return content;
    }
    protected boolean isRuntimeKeysExist(String content) {

        Matcher matcher = Keywords.runtimeVals.matcher(content);

        while(matcher.find()) {
            isInjectDone = false;
            return true;
        }
        return false;
    }
}