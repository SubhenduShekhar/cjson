package com.codedjson;

import com.codedjson.utils.Decode;
import java.io.File;
import java.io.FileNotFoundException;
import java.lang.reflect.Field;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

public class CJson<T> extends Decode {
    private T t;

    /**
     * @param filePath
     * @throws Exception
     */
    public CJson(String filePath) throws Exception {
        super(filePath, true);
        this.t = null;
        this.filePath = filePath;
        this.baseFileObj = new File(filePath);
    }
    /**
     * Call this method to deserialize <code>cjson</code> files.
     * @param classType
     * @return
     * @throws Exception
     */
    public T deserialize(Class<T> classType) throws Exception {
        decodeKeywords();
        json = parseJson(content);
        if(classType.equals(String.class)) return (T) content;

        return gson.fromJson(content, classType);
    }
    public <InjectingClass> T inject(Class<T> classType, InjectingClass injectingObj) throws Exception {
        decodeKeywords();
        content = replaceContent(content, injectingObj);

        return gson.fromJson(content, classType);
    }

    /*public static void main(String[] args) throws Exception {
        Sample sample = new Sample();
        sample.fruit = "Apple";
        sample.types = new ArrayList<>();
        sample.types.add("fruits");
        sample.types.add("vegetables");

        CJson<String> cJson = new CJson<>("C:\\Users\\Home\\OneDrive\\Desktop\\projects\\cjson\\tests\\test-files\\VariableInjection.cjson");
        String t = cJson.inject(String.class, sample);
        //String target = cJson.deserialize(String.class);
    }*/
}
