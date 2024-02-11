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
    protected boolean isFilePath;
    protected boolean isInjectDone;
    protected boolean isInjectExist;

    protected List<String> commentedLines;
    public Base(String filePath, boolean isFilePath) throws FileNotFoundException {
        this.filePath = filePath;
        this.content = read(this.filePath);
        this.isFilePath = isFilePath;
    }
    public Base(String content) {
        this.filePath = null;
        this.content = content;
        this.isFilePath = false;
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

    protected static Object parseJson(String jsonString) throws IllegalJsonType {
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
                    boolean obj = (boolean) var;
                    return "boolean";
                }
                catch (Exception boolEx) {
                    return "string";
                }
            }
        }
    }
    protected boolean isAbsolutePath(String filePath) {
        if(filePath.startsWith("\\"))
            filePath = filePath.substring(2);

        return new File(filePath).isAbsolute();
    }
    protected String getDirectory(String absFilePath) {
        absFilePath = Paths.get(absFilePath).toString();
        String fileName = Paths.get(absFilePath).getFileName().toString();
        return Paths.get(absFilePath.replace(fileName, "")).toString();
    }
}
