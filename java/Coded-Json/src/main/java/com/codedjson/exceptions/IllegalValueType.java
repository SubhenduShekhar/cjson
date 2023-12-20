package com.codedjson.exceptions;

/**
 * If a new data type is encountered during parsing a value from JSON using JPath, this exception is thrown.
 * Log an issue <a href="https://subhendushekhar.github.io/cjson/">here</a> if you want to use custom types as parser(TnC apply).<br/>
 */
public class IllegalValueType extends Exception {
    /**
     * Java data type errors are caught with custom error message.
     * @param message Error message in <code>String</code> format
     */
    public IllegalValueType(String message) {
        super(message);
    }
    /**
     * Default constructor.<br/>
     * Called with message: <code>Undefined value type detected</code>
     */
    public IllegalValueType() {
        super("Undefined value type detected");
    }
}
