package com.codedjson;

import com.codedjson.utils.Decode;
import com.codedjson.utils.Is;
import com.codedjson.utils.Keywords;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.Scanner;

public class CJson<T> extends Is {
    private T t;

    public CJson(String filePath) {
        this.t = null;
        this.filePath = filePath;
        this.baseFileObj = new File(filePath);
    }

    private void decode() throws FileNotFoundException {
        read();
        for (String eachLine : commaSeparated) {
            if(isImport(eachLine)) {
                String decodedString = decodeImport(eachLine);
                this.content = this.content.replace(Keywords.importCheck + this.importFilePath + "\"", decodedString);
            }
        }
    }

    public T deserialize() {
        try {
            this.decode();
            return (T)this.content;
        } catch (FileNotFoundException e) {
            e.printStackTrace();
            System.exit(1);
            return null;
        }
    }
}
