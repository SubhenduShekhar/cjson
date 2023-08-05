package com.codedjson;

import com.codedjson.exceptions.AbsolutePathConstraintError;
import com.codedjson.exceptions.IllegalJsonType;
import com.codedjson.exceptions.IllegalValueType;
import com.codedjson.exceptions.UndeserializedCJSON;
import com.codedjson.templates.*;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;

public class CjsonTests extends Base {
    @Test
    public void iShouldBeAbleToImportPureJSONFiles() throws FileNotFoundException, IllegalJsonType, AbsolutePathConstraintError {
        CJson<Pure> cJson = new CJson<>(pureJsonfilePath);
        Pure pure = cJson.deserialize(Pure.class);

        Assertions.assertNotEquals(pure.quiz.keySet().size(), 0, "Pure JSON files deserialized successfully");
    }
    @Test
    public void iShouldBeAbleToDeserializeCommentsFromjsonFiles() throws FileNotFoundException, IllegalJsonType, AbsolutePathConstraintError {
        CJson<Pure> cJson = new CJson<>(jsonfilePath);
        Pure cjsonObject = cJson.deserialize(Pure.class);

        Assertions.assertNotEquals(cjsonObject.quiz.get("sport").get("q1").question, null);
        Assertions.assertEquals(cjsonObject.quiz.get("sport").get("q2"), null);
    }
    @Test
    public void iShouldBeAbleToDeserializeImportsAndComments() throws FileNotFoundException, IllegalJsonType, AbsolutePathConstraintError {
        CJson<Target> cJson = new CJson<>(cjsonfilePath);
        Target decodedJson = cJson.deserialize(Target.class);
        Assertions.assertNotEquals(decodedJson.source.quiz, null, "Value check in source");
        Assertions.assertNotEquals(decodedJson.target.color, null, "Value check in target.color");
    }
    @Test
    public void iShouldBeAbleToDeserializeRelativePathToLocalVariable() throws FileNotFoundException, IllegalJsonType, AbsolutePathConstraintError, IllegalValueType {
        CJson<TargetRelativeCalls> cJson = new CJson<TargetRelativeCalls>(relativeTargetCjson);

        TargetRelativeCalls targetRelativeCalls = cJson.deserialize(TargetRelativeCalls.class);
        Assertions.assertEquals(targetRelativeCalls.target.digitCheck, cJson.parse("$.target.digitCheck"));
    }
    @Test
    public void iShouldBeAbleToDeserializeCJSONString() throws FileNotFoundException, IllegalJsonType, AbsolutePathConstraintError {
        String cjsonCotent = "{\n" +
                "    \"source\": $import \"" + pureJsonfilePath.toString() + "\",\n" +
                "    \"target\": {\n" +
                "        \"fruit\": \"Apple\",\n" +
                "        \"size\": \"Large\",\n" +
                "        \"color\": \"Red\"\n" +
                "    }\n" +
                "}";
        CJson<Target> cJson = new CJson<>(cjsonCotent);
        Target target = cJson.deserialize(Target.class);
        Assertions.assertNotNull(target.source.quiz.get("sport").get("q1").question);
    }
    @Test
    public void iShouldNotBeAbleToDeserializeIfImportStatementIsRelativePath() {
        String cjsonCotent = "{\n" +
                "    \"source\": $import \"\\test-files\\source.json\",\n" +
                "    \"target\": {\n" +
                "        \"fruit\": \"Apple\",\n" +
                "        \"size\": \"Large\",\n" +
                "        \"color\": \"Red\"\n" +
                "    }\n" +
                "}";
        CJson<Target> cJson = new CJson<>(cjsonCotent);

        Assertions.assertThrows(AbsolutePathConstraintError.class, () -> {
            cJson.deserialize(Target.class);
        });
    }
    @Test
    public void iShouldBeAbleToInjectRuntimeValuesUsingKeyValue() throws FileNotFoundException, IllegalJsonType, AbsolutePathConstraintError {
        CJson<TargetObj> cJson = new CJson<>("{\n" +
                "        \"types\": \"asd\",\n" +
                "        \"fruit\": <fruit>" +
                "}");
        TargetObj targetObj = cJson.inject(TargetObj.class, "fruit", "apple");

        Assertions.assertEquals(targetObj.fruit, "apple");
    }
    @Test
    public void iShouldBeAbleToInjectRuntimeValuesUsingHashMap() throws FileNotFoundException, IllegalJsonType, AbsolutePathConstraintError {
        CJson<VariableInjection> cJson = new CJson<>(variableInjectionCjson);
        HashMap<String, Object> values = new HashMap<>();
        values.put("jsonTypeData", "placeholder");

        values.put("fruit", "apple");
        values.put("quantity", 1);
        VariableInjection variableInjection = cJson.inject(VariableInjection.class, values);

        Assertions.assertEquals(variableInjection.jsonInjection, values.get("jsonTypeData"));
        Assertions.assertEquals(variableInjection.target.fruit, "apple");
    }
    @Test
    public void isShouldBeAbleToDeserializeAndFetchAsString() throws FileNotFoundException, IllegalJsonType, AbsolutePathConstraintError {
        CJson<TargetRelativeCalls> cJson = new CJson<>(relativeTargetCjson);

        String targetRelativeCallsString = cJson.deserializeAsString();
        cJson = new CJson<>(targetRelativeCallsString);

        TargetRelativeCalls targetRelativeCalls = cJson.deserialize(TargetRelativeCalls.class);
        Assertions.assertEquals(targetRelativeCalls.source.quiz.get("sport").get("q1").question, "Which one is correct team name in NBA?");
    }
}
