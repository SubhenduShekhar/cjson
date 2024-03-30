package com.codedjson;

import com.google.gson.Gson;

import java.nio.file.Path;
import java.nio.file.Paths;

public class Base {
    protected String testDataDir = Paths.get(System.getProperty("user.dir"), "..", "..", "tests", "test-files").toString();
    protected Path cjsonfilePath = Paths.get(testDataDir, "target.cjson");
    protected Path jsonfilePath = Paths.get(testDataDir, "source.json");
    protected Path pureJsonfilePath = Paths.get(testDataDir, "pure.json");
    protected Path invalidJsonFilePath = Paths.get(testDataDir, "invalid.json");
    protected Path simpleJsonFilePath = Paths.get(testDataDir, "simple.json");
    protected Path relativeTargetCjson = Paths.get(testDataDir, "targetRelativeCalls.cjson");
    protected Path variableInjectionCjson = Paths.get(testDataDir, "VariableInjection.cjson");
    protected Path referInjectedVariable = Paths.get(testDataDir, "referInjectedVariable.cjson");
    protected final Gson gson;

    public Base(){
        gson = new Gson();
    }
}
