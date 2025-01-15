package com.codedjson.objectparser;

import java.util.HashMap;
import java.util.List;

public class CJSONObject {
    public boolean isJsonObject;
    public String key;
    public String value;
    public HashMap<String, CJSONObject> values;
    public CJSONObject child;
    public List<CJSONObject> children;

    public CJSONObject getChild(String key) {
        return this.child;
    }
    public List<CJSONObject> getChildren(String key) {
        return this.children;
    }
}
