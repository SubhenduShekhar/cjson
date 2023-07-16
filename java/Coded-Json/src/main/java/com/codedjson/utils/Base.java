package com.codedjson.utils;

import com.codedjson.exceptions.IllegalJsonType;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import java.io.File;
import java.io.FileNotFoundException;
import java.nio.file.Paths;
import java.util.List;
import java.util.Scanner;

public class Base {
    protected String filePath;
    protected String content;
    protected File baseFileObj;
    protected Gson gson = new Gson();
    protected String[] commaSeparatedLines;

    protected List<String> commentedLines;
    public Base(String filePath, boolean isFilePath) throws FileNotFoundException {
        this.filePath = filePath;
        this.content = read(this.filePath);
    }
    public Base(String content) {
        this.filePath = null;
        this.content = content;
    }
    public String getFullPath() {
        return Paths.get(this.filePath).getParent().toString();
    }
    protected String appendPath(String parent, String... paths) {
        return Paths.get(parent, paths).toString();
    }
    private static String fileReader(String filePath) throws FileNotFoundException {
        File file = new File(filePath);
        String data = "";
        Scanner scanner = new Scanner(file);
        while(scanner.hasNextLine()) {
            String lineData = scanner.nextLine();
            data += lineData + "\n";
        }
        scanner.close();
        return data;
    }
    public static String read(String filePath) throws FileNotFoundException {
        return fileReader(filePath);
    }

    protected static Object parseJson(String jsonString) throws Exception {
        JsonParser jsonParser = new JsonParser();
        try {
            JsonObject jsonObject = (JsonObject) jsonParser.parse(jsonString);
            return jsonObject;
        }
        catch (Exception e) {
            try {
                JsonArray jsonArray = (JsonArray) jsonParser.parse(jsonString);
                return jsonArray;
            }
            catch (Exception er) {
                throw new IllegalJsonType();
            }
        }
    }

    protected String getType(Object var) {
        try {
            int obj = (int) var;
            return "int";
        }
        catch (Exception intEx) {
            try {
                Double obj = (Double) var;
                return "double";
            }
            catch (Exception doubleEx) {
                try {
                    String obj = (String) var;
                    return "string";
                }
                catch (Exception strEx) {
                    try {
                        boolean obj = (boolean) var;
                        return "boolean";
                    }
                    catch (Exception boolEx) {
                        return "";
                    }
                }
            }
        }
    }
}
