package com.codedjson;

import com.codedjson.exceptions.AbsolutePathConstraintError;
import com.codedjson.exceptions.IllegalJsonType;
import com.codedjson.exceptions.IllegalValueType;
import com.codedjson.templates.Pure;
import com.codedjson.templates.Target;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import java.io.FileNotFoundException;

public class JsonTests extends Base {
    @Test
    public void iShouldBeAbleToUseIsContentJson()  throws FileNotFoundException {
        CJson<Pure> cJson = new CJson<>(pureJsonfilePath);
        Assertions.assertEquals(cJson.isContentJson(), true, "IsContentJson check in cjson.content");
        Assertions.assertEquals(CJson.isContentJson(pureJsonfilePath), true, "Static IsContentJson check for file");
        Assertions.assertEquals(CJson.isContentJson(com.codedjson.utils.Base.read(pureJsonfilePath.toString())), true, "IsContentJson check for string content");
    }
    @Test
    public void iShouldBeAbleToParseJpath() throws FileNotFoundException, IllegalJsonType, AbsolutePathConstraintError, IllegalValueType {
        CJson<Target> cJson = new CJson<>(cjsonfilePath);
        cJson.deserialize(Target.class);
        String value = cJson.parse("source.quiz.sport.q1.question").toString();
        Assertions.assertEquals(value, "Which one is correct team name in NBA?", "Parse function value check");
    }
    @Test
    public void iShouldBeAbleToUseParseWithoutParams() throws FileNotFoundException, IllegalJsonType, AbsolutePathConstraintError {
        CJson<Target> cJson = new CJson<>(cjsonfilePath);
        cJson.deserialize(Target.class);
        String value = cJson.parse().toString();
        System.out.println(value);
        Assertions.assertNotNull(value);
    }
}
