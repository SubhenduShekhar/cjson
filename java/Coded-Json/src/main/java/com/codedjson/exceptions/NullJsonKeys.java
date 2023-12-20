package com.codedjson.exceptions;

/**
 * Exception is thrown if empty JSON object is passed for <code>getAllValues()</code>
 */
public class NullJsonKeys extends Exception {
    /**
     * Default constructor.<br/>
     * Default message: <code>No json keys found. Please call getAllKeys() before</code>
     */
    public NullJsonKeys() {
        super("No json keys found. Please call getAllKeys() before");
    }
}
