package com.codedjson;

import com.codedjson.utils.Base;

import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

public class Main {
    public static void main(String[] args) throws Exception {
        CJson<String> cJson = new CJson<>(Paths.get("C:\\Users\\Home\\OneDrive\\Desktop\\projects\\cjson\\tests\\test-files\\target.cjson"));
        cJson.deserialize(String.class);
        /*List<String> li = new ArrayList<>();
        li.add("$.source.quiz.sport.q1");
        li.add("$.source.quiz.sport.q2");
        String s1 = cJson.remove(li);
        System.out.println(s1);*/
        //cJson.insert("$.source.quiz.sport.q1.default", "my answer");
    }
}
