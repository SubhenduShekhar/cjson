package com.codedjson.exceptions;

public class UnsupportedDatatypeForImport extends Exception {
    public UnsupportedDatatypeForImport(String dataType) {
        super("Only string is supported for import statements, but provided " + dataType);
    }
}
