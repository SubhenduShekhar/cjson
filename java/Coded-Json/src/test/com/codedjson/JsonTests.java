package com.codedjson;

import com.codedjson.exceptions.*;
import com.codedjson.templates.Pure;
import com.codedjson.templates.Target;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import java.io.FileNotFoundException;

public class JsonTests extends Base {
    @Test
    public void iShouldBeAbleToUseIsContentJson() throws FileNotFoundException, IllegalJsonType, AbsolutePathConstraintError {
        CJson<Pure> cJson = new CJson<>(pureJsonfilePath);
        Assertions.assertTrue(cJson.isContentJson(), "IsContentJson check in cjson.content");
        Assertions.assertTrue(CJson.isContentJson(pureJsonfilePath), "Static IsContentJson check for file");
        Assertions.assertTrue(CJson.isContentJson(com.codedjson.utils.Base.read(pureJsonfilePath.toString())), "IsContentJson check for string content");
    }
    @Test
    public void iShouldBeAbleToParseJpath() throws FileNotFoundException, IllegalJsonType, AbsolutePathConstraintError, InvalidJPathError, UndeserializedCJSON, VariableInjectionException {
        CJson<Target> cJson = new CJson<>(cjsonfilePath);
        cJson.deserialize(Target.class);
        String value = cJson.parse("$.source.pure.quiz.sport.q1.question").toString();
        Assertions.assertEquals(value, "Which one is correct team name in NBA?", "Parse function value check");
    }
    @Test
    public void iShouldNotBeAbleToParseWithInvalidJpath() throws FileNotFoundException, IllegalJsonType, AbsolutePathConstraintError, UndeserializedCJSON, VariableInjectionException {
        CJson<Target> cJson = new CJson<>(cjsonfilePath);
        cJson.deserialize(Target.class);
        Assertions.assertThrows(InvalidJPathError.class, () ->
            cJson.parse("source.quiz.sport.q1.question").toString()
        );
    }
    @Test
    public void iShouldBeAbleToUseParseWithoutParams() throws FileNotFoundException, IllegalJsonType, AbsolutePathConstraintError, UndeserializedCJSON, VariableInjectionException {
        CJson<Target> cJson = new CJson<>(cjsonfilePath);
        cJson.deserialize(Target.class);
        String value = cJson.parse().toString();
        System.out.println(value);
        Assertions.assertNotNull(value);
    }
}
