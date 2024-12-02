package com.codedjson;

import com.codedjson.exceptions.*;
import com.codedjson.utils.Checks;
import com.codedjson.utils.Decode;
import com.google.gson.JsonSyntaxException;

import java.io.File;
import java.io.FileNotFoundException;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.List;

/**
 * Coded JSON is an extended format of JSON formatted data storage, which gives
 * you more previledge to organize data into more structured format.
 *
 * Here is an example for `CJSON` format:
 *
 *
 * <pre>
 {
 "source": $import "./source.json",
 "target": {
 "fruit": "Apple",
 "size": "Large",
 "color": "Red",
 "secColor": $.target.color,
 "colorList": [ $.target.color, $.target.secColor ],
 // You can add comments like this
 "digitCheck": 1.5,
 "digitImport": $.target.digitCheck,
 "digitArrayImport": [ $.target.digitCheck, $.target.digitImport ]
 }
 }
 </pre>
 *
 *
 * The above <code>CJSON</code> snipped will be deserialized in JSON format and can be used
 * as same as other JSON files.
 *
 * For other details, please refer to <a href="https://subhendushekhar.github.io/cjson/">Official Page</a>
 */
public class CJson<T> extends Decode {
    private T t;
    private Class<T> classType;
    private Checks checks = new Checks();

    /**
     * CJson parser using file path.
     * @param filePath
     * @throws IllegalJsonType
     * @throws AbsolutePathConstraintError
     * @throws FileNotFoundException
     */
    public CJson(Path filePath) throws FileNotFoundException, IllegalJsonType, AbsolutePathConstraintError, UnsupportedDatatypeForImport {
        super(filePath.toString(), true);
        this.t = null;
        this.filePath = filePath.toString();
        this.baseFileObj = new File(this.filePath);
        contextConverter();
    }
    /**
     * Parser for <code>CJSON</code> content.
     * You can directly parse a <code>CJSON</code> string content.<br/>
     * <b>Import statements must have paths absolute. Otherwise it throws absolute path constraint error while deserialization</b>
     * @param content CJSON/JSON content in string
     * @throws IllegalJsonType
     * @throws AbsolutePathConstraintError
     * @throws FileNotFoundException
     */
    public CJson(String content) throws IllegalJsonType, AbsolutePathConstraintError, FileNotFoundException, UnsupportedDatatypeForImport {
        super(content);
        this.t = null;
        this.filePath = null;
        this.baseFileObj = null;
        contextConverter();
    }

    /**
     * Deserializes CJSON content and returns Java Object equivalent to <code>classType</code>.
     * For more capabilities, refer to <a href="https://subhendushekhar.github.io/cjson/">Official Page</a>
     * @param classType Java class object equivalent to target JSON
     * @return Java Object equivalent to <code>classType</code>
     */
    public T deserialize(Class<T> classType) throws IllegalJsonType, VariableInjectionException {
        if(isInjectExist && !isInjectDone)
            System.out.println("Runtime variables detected. System may throw error.");

        content = decodeRelativePathValues(content);
        json = parseJson(content);

        this.classType = classType;
        if(classType.equals(String.class))
            t = (T) content;
        else {
            try {
                t = gson.fromJson(content, classType);
            }
            catch (JsonSyntaxException jsonSyntaxException) {
                if(jsonSyntaxException.getMessage().contains("For input string: "))
                    throw new VariableInjectionException("Variable requires injection at runtime : " +
                            jsonSyntaxException.getMessage().split("For input string: ")[1]);
            }
        }
        return t;
    }
    /**
     * Inject a hashmap to a json object. Uses tag <code>&lt;variable&gt;</code><br/>
     * JSONArrays and JSONObjects cannot be injected<br/>
     *
     * For more details on usage, click <a href="https://subhendushekhar.github.io/cjson/">here</a>
     * @param classType Java class object equivalent to target JSON
     * @param injectingObj
     * @return
     * @throws IllegalJsonType If syntax is not correct
     * @throws AbsolutePathConstraintError This is throws if CJson object is created with CJSON string.
     * This is thrown if import statements contain relative path instead of absolute path
     * @throws FileNotFoundException If the imported file is not found in the directory
     */
    public T inject(Class<T> classType, HashMap<String, Object> injectingObj) throws IllegalJsonType, AbsolutePathConstraintError, FileNotFoundException, VariableInjectionException, UnsupportedDatatypeForImport {

        if(injectingObj != null || injectingObj.keySet().size() != 0) {
            this.classType = classType;

            contextConverter();
            content = replaceContent(content, injectingObj);

            json = parseJson(content);
            content = parse().toString();

        }
        isInjectDone = true;
        if(isRuntimeKeysExist(content))
            System.out.println("All runtime values are not injected yet. Deserialization may throw exception");
        return deserialize(classType);
    }
    /**
     * Injects single key and value. Uses tag <code>&lt;variable&gt;</code><br/>
     * JSONArrays and JSONObjects cannot be injected<br/>
     *
     * For more details on usage, click <a href="https://subhendushekhar.github.io/cjson/">here</a>
     * @param classType generic class type
     * @param key Key to be replaced in string format. Please note, this is not JPath. For more details, view <a href="https://github.com/SubhenduShekhar/cjson?tab=readme-ov-file#dynamic-variable-injection">this page</a>
     * @param value Value to be replaced
     * @return
     * @throws IllegalJsonType If syntax is not correct
     * @throws AbsolutePathConstraintError This is throws if CJson object is created with CJSON string.
     * This is thrown if import statements contain relative path instead of absolute path
     * @throws FileNotFoundException If the imported file is not found in the directory
     */
    public T inject(Class<T> classType, String key, Object value) throws IllegalJsonType, AbsolutePathConstraintError, FileNotFoundException, VariableInjectionException, UnsupportedDatatypeForImport {
        this.classType = classType;

        contextConverter();
        content = replaceContent(content, key, value);
        content = decodeRelativePathValues(content);

        json = parseJson(content);
        content = parse().toString();

        isInjectDone = true;
        return deserialize(classType);
    }
    /**
     * Deserializes <code>CJSON</code> content and returns as string.<br/>
     * No need to explicitly deserialize CJSON contexts and call this method to get the deserialized <code>String</code>.
     * This method wraps all the steps.
     * @return String value of parsed <code>cjson</code>
     * @throws IllegalJsonType If syntax is not correct
     * @throws AbsolutePathConstraintError This is throws if CJson object is created with CJSON string.
     * This is thrown if import statements contain relative path instead of absolute path
     * @throws FileNotFoundException If the imported file is not found in the directory
     */
    public String deserializeAsString() throws IllegalJsonType, AbsolutePathConstraintError, FileNotFoundException, UnsupportedDatatypeForImport {
        contextConverter();
        json = parseJson(content);
        return content;
    }
    /**
     * Removes a key value set from deserialized JSON.<br/>
     * Takes json path as input and returns updated Serialized class.
     * @param key JPath starting with "$."
     * @return Updated Class&lt;T&gt;
     * @throws IllegalJsonType Throws if any of the path is incorrect
     * @throws UndeserializedCJSON Throws if the CJSON/JSON is not deserialized. Call deserialize before remove
     * @throws InvalidJPathError If the JPath format is invalid
     */
    public T remove(String key) throws IllegalJsonType, UndeserializedCJSON, InvalidJPathError {
        if(!key.startsWith("$.")) throw new InvalidJPathError();
        if(classType == null) throw new UndeserializedCJSON("Undeserialized CJSON content detected. Use deseralize() before remove()");

        removeWithKey(key);

        json = parseJson(content);
        if(classType.equals(String.class))
            t = (T) content;
        else
            t = gson.fromJson(content, classType);
        return t;
    }
    /**
     * Removes a key value set from deserialized JSON.<br/>
     * Takes list of json paths as input and returns updated Serialized class.
     * @param keyList JPath list starting with "$."
     * @return Updated Class&lt;T&gt;
     * @throws IllegalJsonType Throws if any of the path is incorrect
     * @throws UndeserializedCJSON Throws if the CJSON/JSON is not deserialized. Call deserialize before remove
     */
    public T remove(List<String> keyList) throws IllegalJsonType, UndeserializedCJSON {
        if(classType == null) throw new UndeserializedCJSON("Undeserialized CJSON content detected. Use deseralize() before remove()");
        for(String key: keyList)
            removeWithKey(key);

        json = parseJson(content);
        if(classType.equals(String.class))
            t = (T) content;
        else
            t = gson.fromJson(content, classType);
        return t;
    }
    /**
     * Converts JAVA object to JSON string. <br/>
     * If null value is passed, it returns empty JSON - {}
     * @param object Any JAVA object
     * @return
     * @throws IllegalAccessException
     */
    public static String toString(Object object) throws IllegalAccessException {
        if(object == null)
            return "{}";
        return getAsString(object);
    }
    private void contextConverter() throws IllegalJsonType, AbsolutePathConstraintError, FileNotFoundException, UnsupportedDatatypeForImport {
        if (!isContextConverted) {
            if (checks.runtimeKeys(content))
                System.out.println("Warning: Runtime variables detected. To inject data, use inject() instead");

            decodeKeywords();
            json = parseJson(content);
            content = parse().toString();
            isContextConverted = true;
        }
    }
}

