package com.codedjson;

import com.codedjson.exceptions.IllegalJsonType;
import com.codedjson.exceptions.UndeserializedCJSON;
import com.codedjson.utils.Checks;
import com.codedjson.utils.Decode;

import java.io.File;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.List;

public class CJson<T> extends Decode {
    private T t;
    private Class<T> classType;
    private Checks checks = new Checks();

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

        if(checks.runtimeKeys(content))
            System.out.println("Warning: Runtime variables detected. To inject data, use inject() instead");

        decodeKeywords();

        json = parseJson(content);

        content = parse().toString();
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
        content = replaceContent(content, injectingObj);
        content = parse().toString();

        if(classType.equals(String.class))
            t = (T) content;
        else
            t = gson.fromJson(content, classType);
        return t;
    }
    /**
     * Injects single key and value. Uses tag <code>&lt;variable&gt;</code><br/>
     * JSONArrays and JSONObjects cannot be injected<br/>
     *
     * For more details on usage, click <a href="#">here</a>
     * @param classType generic class type
     * @param key
     * @param value
     * @return
     * @throws Exception
     */
    public T inject(Class<T> classType, String key, Object value) throws Exception {
        this.classType = classType;

        decodeKeywords();
        content = replaceContent(content, key, value);
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
    public T remove(String key) throws IllegalJsonType {
        removeWithKey(key);

        json = parseJson(content);
        if(classType.equals(String.class))
            t = (T) content;
        else
            t = gson.fromJson(content, classType);
        return t;
    }
    public T remove(List<String> keyList) throws IllegalJsonType, UndeserializedCJSON {
        if(json == null) throw new UndeserializedCJSON("Undeserialized CJSON content detected. Use deseralize() before remove()");
        for(String key: keyList)
            removeWithKey(key);

        json = parseJson(content);
        if(classType.equals(String.class))
            t = (T) content;
        else
            t = gson.fromJson(content, classType);
        return t;
    }
    /*public void insert(String jsonPath, Object value) {
        //String pathToConstruct =
                findPathToConstruct(jsonPath, value);
    }*/
}
