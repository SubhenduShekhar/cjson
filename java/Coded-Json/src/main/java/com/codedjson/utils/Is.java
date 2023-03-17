package com.codedjson.utils;

public class Is extends Decode {
    protected boolean isImport(String lineItem) {
        if(lineItem.contains("$import \""))
            return true;
        else
            return false;
    }
}
