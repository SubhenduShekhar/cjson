package com.codedjson.utils;

import java.io.FileNotFoundException;
import java.nio.file.Paths;

public class Decode extends Base {
    public String decodeImport(String lineItem) throws FileNotFoundException {
        this.importFilePath = lineItem.split("\\" + Keywords.importCheck)[1].split("\"")[0];
        String parentPath = this.baseFileObj.getParent();
        this.importFileFullPath = Paths.get(parentPath, this.importFilePath).toString();
        return read(this.importFileFullPath);
    }
}