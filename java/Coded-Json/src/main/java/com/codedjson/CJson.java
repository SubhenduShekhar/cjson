package com.codedjson;

import com.codedjson.exceptions.IllegalJsonType;
import com.codedjson.types.ParsedValue;
import com.codedjson.utils.Decode;
import com.codedjson.utils.Keywords;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParseException;

import java.io.File;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class CJson<T> extends Decode {
    private T t;
    private Class<T> classType;

    /**
     * Parser for <code>CJSON</code> files.<br/>
     * Inspired from JSON capabilities with extended features.
     * @param filePath
     * @throws Exception
     */
    public CJson(Path filePath) throws Exception {
        super(filePath.toString(), true);
        this.t = null;
        this.filePath = filePath.toString();
        this.baseFileObj = new File(this.filePath);
    }
    /**
     * Parser for <code>CJSON</code> files.<br/>
     * Inspired from JSON capabilities with extended features.
     * @deprecated will be deprecated from later versions. Use <code>CJson(Path filePath)</code> instead
     * @param content CJSON/JSON content in string
     * @throws Exception
     */
    public CJson(String content) {
        super(content);
        this.t = null;
        this.filePath = null;
        this.baseFileObj = null;
    }
    /**
     * Call this method to deserialize <code>cjson</code> files.
     * @param classType
     * @return
     * @throws Exception
     */
    public T deserialize(Class<T> classType) throws Exception {
        this.classType = classType;

        decodeKeywords();

        content = parse().toString();
        json = parseJson(content);
        if(classType.equals(String.class))
            t = (T) content;
        else
            t = gson.fromJson(content, classType);
        return t;
    }
    /**
     * Inject a hashmap to a json object. Uses tag <code>&lt;variable&gt;</code><br/>
     * JSONArrays and JSONObjects cannot be injected<br/>
     *
     * For more details on usage, click <a href="#">here</a>
     * @param classType generic class type
     * @param injectingObj
     * @return
     * @throws Exception
     */
    public T inject(Class<T> classType, HashMap<String, Object> injectingObj) throws Exception {
        this.classType = classType;

        decodeKeywords();
        content = replaceContent(content, injectingObj);//.replace("\n", "").replace("\r", "");
        content = parse().toString();

        if(classType.equals(String.class))
            t = (T) content;
        else
            t = gson.fromJson(content, classType);
        return t;
    }
    /**
     * Deserializes <code>CJSON</code> content and returns as string.
     * @return String value of parsed <code>cjson</code>
     * @throws Exception
     */
    public String deserializeAsString() throws Exception {
        decodeKeywords();
        json = parseJson(content);
        return content;
    }
    public void remove(String key) {
        if(key.startsWith(Keywords.relativeJPath))
            key = key.replace(Keywords.relativeJPath, "");
        String value = parseValue(key).value.toString();
        String s = content.replace(value, "null");

    }
    public void remove(List<String> keyList) {
        throw new UnsupportedOperationException();
    }
}
