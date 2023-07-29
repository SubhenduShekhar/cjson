package com.codedjson;

import java.nio.file.Paths;

public class Main {
    public static void main(String[] args) throws Exception {
        CJson<String> cJson = new CJson<>(Paths.get("C:\\Users\\632400\\Desktop\\projects\\cjson\\tests\\test-files\\source.json"));
        cJson.deserialize(String.class);
        cJson = cJson.remove("$.type");
        System.out.println(cJson);
    }
}
