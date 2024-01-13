package com.codedjson;

import com.codedjson.exceptions.AbsolutePathConstraintError;
import com.codedjson.exceptions.IllegalJsonType;

import java.io.FileNotFoundException;
import java.nio.file.Paths;

public class Main {
    public static void main(String[] args) throws FileNotFoundException, IllegalJsonType, AbsolutePathConstraintError {
        CJson<String> cJson = new CJson<String>(Paths.get("C:\\Users\\Home\\OneDrive\\Desktop\\TestDataFiles\\config.cjson"));
        String s = cJson.deserialize(String.class);
        s = cJson.inject(String.class,"productGroupName", "seats");
        System.out.println(s);
    }
}
