package com.codedjson.exceptions;

/**
 * Puts a check on JSON type context after deserialization of CJSON.
 */
public class IllegalJsonType extends Exception {
    /**
     * Default constructor.<br/>
     * Called with message: <code>Object is neither JsonObject nor a JsonArray</code>
     */
    public IllegalJsonType() {
        super("Object is neither JsonObject nor a JsonArray");
    }
}
