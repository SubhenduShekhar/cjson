package com.codedjson;

import com.codedjson.exceptions.*;
import com.codedjson.templates.*;
import com.sun.org.glassfish.gmbal.Description;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.function.Executable;

import java.io.FileNotFoundException;
import java.util.HashMap;

public class CjsonTests extends Base {
    @Test
    public void iShouldBeAbleToImportPureJSONFiles() throws FileNotFoundException, IllegalJsonType, AbsolutePathConstraintError, UndeserializedCJSON, VariableInjectionException {
        CJson<Pure> cJson = new CJson<>(pureJsonfilePath);
        Pure pure = cJson.deserialize(Pure.class);

        Assertions.assertNotEquals(pure.quiz.keySet().size(), 0, "Pure JSON files deserialized successfully");
    }

    @Test
    public void iShouldBeAbleToImportNestedCJSONFiles() throws FileNotFoundException, IllegalJsonType, AbsolutePathConstraintError, UndeserializedCJSON, VariableInjectionException {
        CJson<Target> cJson = new CJson<>(cjsonfilePath);
        Target target = cJson.deserialize(Target.class);

        Assertions.assertEquals(target.source.pure.quiz.get("sport").get("q1").question, "Which one is correct team name in NBA?", "Nested CJSON imports passed.");
    }
    @Test
    public void iShouldBeAbleToDeserializeCommentsFromjsonFiles() throws FileNotFoundException, IllegalJsonType, AbsolutePathConstraintError, UndeserializedCJSON, VariableInjectionException {
        CJson<Pure> cJson = new CJson<>(jsonfilePath);
        Pure cjsonObject = cJson.deserialize(Pure.class);

        Assertions.assertNotEquals(cjsonObject.quiz.get("sport").get("q1").question, null);
        Assertions.assertEquals(cjsonObject.quiz.get("sport").get("q2"), null);
    }
    @Test
    public void iShouldBeAbleToDeserializeImportsAndComments() throws FileNotFoundException, IllegalJsonType, AbsolutePathConstraintError, UndeserializedCJSON, VariableInjectionException {
        CJson<Target> cJson = new CJson<>(cjsonfilePath);
        Target decodedJson = cJson.deserialize(Target.class);
        Assertions.assertNotEquals(decodedJson.source.pure.quiz, null, "Value check in source");
        Assertions.assertNotEquals(decodedJson.target.color, null, "Value check in target.color");
    }
    @Test
    public void iShouldBeAbleToDeserializeRelativePathToLocalVariable() throws FileNotFoundException, IllegalJsonType, AbsolutePathConstraintError, UndeserializedCJSON, IllegalValueType, InvalidJPathError, VariableInjectionException {
        CJson<TargetRelativeCalls> cJson = new CJson<TargetRelativeCalls>(relativeTargetCjson);
        HashMap<String, Object> toBeInjected = new HashMap<>();
        toBeInjected.put("fruit", "Orange");
        toBeInjected.put("quantity", 10);
        toBeInjected.put("jsonTypeData", "{" +
                "\"Hello\": \"World\"" +
                "}");
        cJson.inject(TargetRelativeCalls.class, toBeInjected);
        TargetRelativeCalls targetRelativeCalls = cJson.deserialize(TargetRelativeCalls.class);
        Assertions.assertEquals(targetRelativeCalls.target.digitCheck, cJson.parse("$.target.digitCheck"));
    }
    @Test
    public void iShouldBeAbleToDeserializeCJSONString() throws FileNotFoundException, IllegalJsonType, AbsolutePathConstraintError, UndeserializedCJSON, VariableInjectionException {
        String cjsonCotent = "{\n" +
                "    \"source\": $import \"" + pureJsonfilePath.toString() + "\",\n" +
                "    \"target\": {\n" +
                "        \"fruit\": \"Apple\",\n" +
                "        \"size\": \"Large\",\n" +
                "        \"color\": \"Red\"\n" +
                "    }\n" +
                "}";
        CJson<RawTarget> cJson = new CJson<>(cjsonCotent);
        RawTarget target = cJson.deserialize(RawTarget.class);
        Assertions.assertNotNull(target.source.quiz.get("sport").get("q1").question);
    }
    @Test
    public void iShouldNotBeAbleToDeserializeIfImportStatementIsRelativePath() {
        String cjsonContent = "{\n" +
                "    \"source\": $import \"\\test-files\\source.json\",\n" +
                "    \"target\": {\n" +
                "        \"fruit\": \"Apple\",\n" +
                "        \"size\": \"Large\",\n" +
                "        \"color\": \"Red\"\n" +
                "    }\n" +
                "}";

        Assertions.assertThrows(AbsolutePathConstraintError.class, () -> new CJson<>(cjsonContent) );
    }
    @Test
    public void iShouldBeAbleToInjectRuntimeValuesUsingKeyValue() throws FileNotFoundException, IllegalJsonType, AbsolutePathConstraintError, UndeserializedCJSON, VariableInjectionException {
        CJson<TargetObj> cJson = new CJson<>("{\n" +
                "        \"types\": \"asd\",\n" +
                "        \"fruit\": <fruit>" +
                "}");
        TargetObj targetObj = cJson.inject(TargetObj.class, "fruit", "apple");

        Assertions.assertEquals(targetObj.fruit, "apple");
    }
    @Test
    public void iShouldBeAbleToInjectRuntimeValuesUsingHashMap() throws FileNotFoundException, IllegalJsonType, AbsolutePathConstraintError, UndeserializedCJSON, VariableInjectionException {
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
    public void iShouldBeAbleToDeserializeAndFetchAsString() throws FileNotFoundException, IllegalJsonType, AbsolutePathConstraintError, UndeserializedCJSON, VariableInjectionException {
        CJson<Target> cJson = new CJson<>(cjsonfilePath);

        String targetRelativeCallsString = cJson.deserializeAsString();
        cJson = new CJson<>(targetRelativeCallsString);

        Target target = cJson.deserialize(Target.class);
        Assertions.assertEquals(target.source.pure.quiz.get("sport").get("q1").question, "Which one is correct team name in NBA?");
    }
    @Test
    public void iShouldBeAbleToInjectNull() throws FileNotFoundException, IllegalJsonType, AbsolutePathConstraintError, UndeserializedCJSON, VariableInjectionException {
        CJson<TargetObj> cJson = new CJson<>("{\n" +
                "        \"types\": \"asd\",\n" +
                "        \"fruit\": <fruit>" +
                "}");
        TargetObj targetObj = cJson.inject(TargetObj.class, "fruit", null);

        Assertions.assertNull(targetObj.fruit);
    }
    @Test
    public void iShouldBeAbleToReferInjectedVariable() throws IllegalJsonType, AbsolutePathConstraintError, FileNotFoundException, UndeserializedCJSON, VariableInjectionException {
        CJson<ReferInjectedVariable> cJson = new CJson<>(referInjectedVariable);
        ReferInjectedVariable referInjectedVariable = cJson.inject(ReferInjectedVariable.class, new HashMap<String, Object>() {
            {
                put("fruit", "Apple");
                put("quantity", 100);
            }
        });
        Assertions.assertEquals(referInjectedVariable.target.fruit, "Apple");
        Assertions.assertEquals(referInjectedVariable.variableInjection.target.fruit, "Apple");
        Assertions.assertEquals(referInjectedVariable.variableInjection.target.quantity, 100);
    }
    @Test
    public void iShouldBeAbleToInjectValuesForKeysWithSpecialCharacters() throws IllegalJsonType, AbsolutePathConstraintError, FileNotFoundException, UndeserializedCJSON, InvalidJPathError, VariableInjectionException {
        CJson<TargetObj> cJson = new CJson<>("{\n" +
                "        \"types\": \"asd\",\n" +
                "        \"fruit\": <fruit!@#$%^&*()>" +
                "}");
        cJson.inject(TargetObj.class, "fruit!@#$%^&*()", "apple");
        Assertions.assertEquals(cJson.parse("$.fruit"), "apple");
    }
    @Test
    public void iShouldBeAbleToInjectSpecialCharacters() throws IllegalJsonType, AbsolutePathConstraintError, FileNotFoundException, InvalidJPathError, VariableInjectionException {
        CJson<TargetObj> cJson = new CJson<>("{\n" +
                "        \"types\": \"asd\",\n" +
                "        \"fruit\": <fruit!:@#$%^&*()>" +
                "}");
        cJson.inject(TargetObj.class, "fruit!:@#$%^&*()", null);
        Assertions.assertEquals(cJson.parse("$.fruit"), null);
    }
    @Test
    @Description("I Should Be Able To Deserialize Raw Data In Injection Quotes")
    public void iShouldBeAbleToDeserializeRawDataInInjectionQuotes() throws IllegalJsonType, AbsolutePathConstraintError, FileNotFoundException, VariableInjectionException {
        CJson<VariableInjection> cJson = new CJson<>(variableInjectionCjson);
        Assertions.assertThrows(VariableInjectionException.class, () -> {
            cJson.deserialize(VariableInjection.class);
        });
    }
}
