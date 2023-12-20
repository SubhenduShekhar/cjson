package com.codedjson.exceptions;

public class InvalidJPathError extends Exception {
    public InvalidJPathError() {
        super("JPath should be in valid format. Check and try again");
    }
}
