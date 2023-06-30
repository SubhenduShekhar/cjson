package com.codedjson.exceptions;

public class IllegalJsonType extends Exception {
    public IllegalJsonType() {
        super("Object is neither JsonObject nor a JsonArray");
    }
}
