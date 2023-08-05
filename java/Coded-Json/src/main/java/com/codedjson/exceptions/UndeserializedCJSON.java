package com.codedjson.exceptions;

public class UndeserializedCJSON extends Exception {
    public UndeserializedCJSON(String message) {
        super(message);
    }
    public UndeserializedCJSON() {
        super("Undeserialized CJSON content detected. Use deserialize() before this operation");
    }
}
