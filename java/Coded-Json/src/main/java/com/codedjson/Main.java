package com.codedjson;

import com.codedjson.utils.Base;

import java.nio.file.Paths;

public class Main {
    public static void main(String[] args) throws Exception {
        CJson<String> cJson = new CJson<>(Paths.get("C:\\Users\\Home\\OneDrive\\Desktop\\projects\\cjson\\tests\\test-files\\source.json"));
        String s = cJson.deserialize(String.class);
        cJson.remove("$.quiz.sport.q1");
        System.out.println(cJson);
        String s1 = s.trim().replaceAll(" +", " ");
        /*String s = "{\"asdas\"}";
        System.out.println(s.replace("{\"a", ""));*/
    }
}
