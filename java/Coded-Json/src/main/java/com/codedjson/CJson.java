package com.codedjson;

import com.codedjson.utils.Decode;
import java.io.File;
import java.io.FileNotFoundException;

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
    private void decode() throws FileNotFoundException {
        read();
    }

    /**
     * Call this method to deserialize <code>cjson</code> files.
     * @param classType
     * @return
     * @throws Exception
     */
    public T deserialize(Class<T> classType) throws Exception {
        this.decodeKeywords();
        json = parseJson(content);
        if(classType.equals(String.class)) return (T) content;

        return gson.fromJson(content, classType);
    }
}
