package com.codedjson.exceptions;

public class JsonArrayRemoveException extends Exception {
    public JsonArrayRemoveException() {
        super("Remove can not be applied to JsonArray");
    }
}
