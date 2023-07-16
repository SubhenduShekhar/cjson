package com.codedjson.exceptions;

public class IllegalValueType extends Exception {
    public IllegalValueType(String message) {
        super(message);
    }
    public IllegalValueType() {
        super("Undefined value type detected");
    }
}
