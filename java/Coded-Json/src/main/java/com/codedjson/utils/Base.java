package com.codedjson.utils;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.Scanner;

public class Base {
    protected String filePath;
    protected String content;
    protected String[] commaSeparated;
    protected String importFilePath;
    protected String importFileFullPath;
    protected File baseFileObj;

    private String fileReader(String filePath) throws FileNotFoundException {
        File file = new File(filePath);
        String data = "";
        Scanner scanner = new Scanner(file);
        while(scanner.hasNextLine()) {
            String lineData = scanner.nextLine();
            data += lineData;
        }
        scanner.close();
        return data;
    }

    public void read() throws FileNotFoundException {
        this.content = fileReader(this.filePath);
        this.commaSeparated = this.content.split(",");
    }

    public String read(String filePath) throws FileNotFoundException {
        return fileReader(filePath);
    }
}
