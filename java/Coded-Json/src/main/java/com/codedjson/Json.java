package com.codedjson;

import com.codedjson.exceptions.NullJsonKeys;
import com.codedjson.types.ParsedValue;
import com.codedjson.utils.Is;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonPrimitive;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class Json extends Is {
    protected Object json;
    public List<String> jsonKeys;
    public List<Object> jsonValues;
    private String[] dataTypes = new String[] { "string", "int", "boolean", "double" };
    public Json(String filePath, boolean isFilePath) throws Exception {
        super(filePath, isFilePath);
        this.filePath = filePath;
    }
    public Json(String content) throws Exception {
        super(content, false);
    }
    public boolean isContentJson(String content) throws Exception {
        try {
            parseJson(content);
            return true;
        }
        catch (Exception e) {
            return false;
        }
    }
    public boolean isContentJson(String content, boolean isFilePath) {
        try {
            parseJson(read(content));
            return true;
        }
        catch (Exception e) {
            return false;
        }
    }
    private void pushKey(String eachKey, String prevKey) {
        if(prevKey.equals(""))
            jsonKeys.add(eachKey);
        else
            jsonKeys.add(prevKey + "." + eachKey);
    }
    private String getJsonType(JsonElement jsonData) {
        String type;
        if(jsonData.getClass().getName().contains("JsonPrimitive"))
            type = getType(jsonData.getAsString());
        else
            type = getType(jsonData);
        return type;
    }
    private boolean rawDataTypeCheck(JsonElement jsonData) {
        String type = getJsonType(jsonData);
        return Arrays.stream(dataTypes).anyMatch(eachItem -> eachItem.equals(type));
    }
    private void getKeys(Object jsonData, String prevKey) throws Exception {
        if(jsonData.getClass().getName().contains("JsonObject")) {
            for (String eachJsonData : ((JsonObject) jsonData).keySet()) {
                if(((JsonObject)jsonData).get(eachJsonData).getClass().getName().contains("JsonArray")) {
                    boolean allRaw = true;
                    for(int i = 0; i < ((JsonObject)jsonData).get(eachJsonData).getAsJsonArray().size(); i ++) {
                        String type = getJsonType(((JsonObject)jsonData).getAsJsonArray(eachJsonData).get(i));
                        if(Arrays.stream(dataTypes).anyMatch(eachItem -> eachItem.equals(type)))
                            continue;
                        else {
                            allRaw = false;
                            if(!prevKey.equals(""))
                                getKeys(((JsonObject) jsonData).getAsJsonArray(eachJsonData).get(i), prevKey + "." + eachJsonData + "[" + i + "]");
                            else
                                getKeys(((JsonObject) jsonData).getAsJsonArray(eachJsonData).get(i), eachJsonData + "[" + i + "]");
                        }
                    }
                    if(allRaw && ((JsonObject) jsonData).getAsJsonArray(eachJsonData).size() != 0) {
                        for(int i = 0; i < ((JsonObject) jsonData).getAsJsonArray(eachJsonData).size(); i ++)
                            pushKey(eachJsonData + "[" + i + "]", prevKey);
                    }
                }
                else if(rawDataTypeCheck(((JsonObject) jsonData).get(eachJsonData)))
                    pushKey(eachJsonData, prevKey);
                else if(isContentJson(((JsonObject) jsonData).get(eachJsonData).toString())) {
                    if(! prevKey.equals(""))
                        getKeys(((JsonObject) jsonData).get(eachJsonData), prevKey + "." + eachJsonData);
                    else
                        getKeys(((JsonObject) jsonData).get(eachJsonData), eachJsonData);
                }
            }
        }
        else if(jsonData.getClass().getName().contains("JsonArray"))
            for (Object eachData : (JsonArray)jsonData)
                getKeys(eachData, "");
    }
    public List<String> getAllKeys() throws Exception {
        jsonKeys = new ArrayList<>();
        getKeys(json, "");
        return jsonKeys;
    }
    private Object getValueFromKey(String key) {
        Object value = json;
        if(key.contains(".")) {
            String[] keyList = key.split("\\.");
            for(int j = 0; j < keyList.length; j ++) {
                if(keyList[j].equals("$")) continue;
                if(keyList[j].contains("[") && keyList[j].contains("]")) {
                    String eachKey = keyList[j].split("\\[")[0];
                    int index = Integer.parseInt(keyList[j].split("\\[")[1].split("\\]")[0]);
                    value = ((JsonArray)((( JsonObject )value).get(eachKey))).get(index);
                }
                else value = ((JsonObject) value).get(keyList[j]);
            }
        }
        else value = ((JsonObject)value).get(key);

        return value;
    }
    public List<Object> getAllValues() throws NullJsonKeys {
        if(jsonKeys.size() == 0)
            throw new NullJsonKeys();
        jsonValues = new ArrayList<>();
        for(String eachKey : jsonKeys) {
            jsonValues.add(getValueFromKey(eachKey));
        }
        return jsonValues;
    }
    public ParsedValue parse(String key) {
        Object value = getValueFromKey(key);

        if(value.getClass().getName().contains("JsonPrimitive")) {
            JsonPrimitive jsonPrimitive = (JsonPrimitive) value;
            if(jsonPrimitive.isBoolean())
                return new ParsedValue(jsonPrimitive.getAsBoolean(), "boolean");
            else if(jsonPrimitive.isNumber())
                return new ParsedValue(jsonPrimitive.getAsNumber(), "number");
            else if(jsonPrimitive.isString())
                return new ParsedValue(jsonPrimitive.getAsString(), "String");
            else if(jsonPrimitive.isJsonNull())
                return new ParsedValue(jsonPrimitive.getAsJsonNull(), "null");
            else return new ParsedValue(jsonPrimitive, "jsonPrimitive");
        }
        else return new ParsedValue(value, "object");
    }
    public Object parse() {
        return json;
    }
}
