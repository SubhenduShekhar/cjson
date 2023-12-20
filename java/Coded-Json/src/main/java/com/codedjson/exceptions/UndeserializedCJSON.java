package com.codedjson.exceptions;

/**
 * Exception is thrown when any function requires <code>deserialize()</code> call before.
 */
public class UndeserializedCJSON extends Exception {
    /**
     * Custom error message constructor
     * @param message Error message in <code>String</code> format.
     */
    public UndeserializedCJSON(String message) {
        super(message);
    }
    /**
     * Default constructor.<br/>
     * Default message: <code>Undeserialized CJSON content detected. Use deserialize() before this operation</code>
     */
    public UndeserializedCJSON() {
        super("Undeserialized CJSON content detected. Use deserialize() before this operation");
    }
}
