package com.codedjson;

import com.codedjson.exceptions.AbsolutePathConstraintError;
import com.codedjson.exceptions.IllegalJsonType;
import com.codedjson.exceptions.UnsupportedDatatypeForImport;

import java.io.FileNotFoundException;
import java.nio.file.Paths;

public class Main {
    public static void main(String[] args) throws IllegalJsonType, AbsolutePathConstraintError, FileNotFoundException, UnsupportedDatatypeForImport {
        String str = CJson.read("C:\\Users\\Home\\OneDrive\\Desktop\\projects\\cjson\\tests\\test-files\\pure.json");
    }
}
