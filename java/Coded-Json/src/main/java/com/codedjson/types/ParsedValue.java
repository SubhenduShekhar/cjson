package com.codedjson.types;

public class ParsedValue {
    public Object value;
    public String type;
    public ParsedValue(Object value, String type) {
        this.value = value;
        this.type = type;
    }
}
