package com.codedjson.exceptions;

public class NullJsonKeys extends Exception {
    public NullJsonKeys() {
        super("No json keys found. Please call getAllKeys() before");
    }
}
