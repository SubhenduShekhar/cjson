package com.codedjson.exceptions;

/**
 * Exception class, thrown when <code>CJson(String)</code> object contains relative paths in import statement instead of absolute paths.
 */
public class AbsolutePathConstraintError extends Exception {
    /**
     * Absolute/Relative path errors are caught with custom error message.
     * @param message Error message in <code>String</code> format
     */
    public AbsolutePathConstraintError(String message) {
        super(message);
    }
    /**
     * Default constructor.<br/>
     * Default message: <code>Expected absolute path in import statement but got relative</code>
     */
    public AbsolutePathConstraintError() {
        super("Expected absolute path in import statement but got relative");
    }
}
