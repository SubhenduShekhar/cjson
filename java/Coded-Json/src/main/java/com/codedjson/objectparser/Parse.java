package com.codedjson.objectparser;

import java.util.HashMap;
import java.util.List;

public class Parse {
    public static Object parse(String cjsonText) {
        if(cjsonText.startsWith("{") && cjsonText.endsWith("}")) {
            return decodeCjsonObject(cjsonText);
        }
        else if(cjsonText.startsWith("[") && cjsonText.endsWith("]")) {
            return decodeCjsonArray(cjsonText);
        }
    }
    private static CJSONObject decodeCjsonObject(String cjsonText) {
        CJSONObject cjsonObject = new CJSONObject();

        cjsonText = cjsonText.split("\\{")[1].split("}")[0];
        String[] commaSeparatedText = cjsonText.split(",");

        for(String eachCommaSeparatedText : commaSeparatedText) {
            HashMap<String, CJSONObject> values = new HashMap<>();
            values.put(eachCommaSeparatedText.split(":")[0].trim(), );
        }
    }
    private static List<CJSONObject> decodeCjsonArray(String cjsonText) {
        cjsonText = cjsonText.split("\\[")[1].split("]")[0];
    }
}
