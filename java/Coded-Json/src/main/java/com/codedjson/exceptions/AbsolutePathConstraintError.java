package com.codedjson.exceptions;

public class AbsolutePathConstraintError extends Exception {
    public AbsolutePathConstraintError(String message) {
        super(message);
    }
    public AbsolutePathConstraintError() {
        super("Expected absolute path in import statement but got relative");
    }
}
