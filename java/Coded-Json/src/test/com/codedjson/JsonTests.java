package com.codedjson;

import com.codedjson.exceptions.*;
import com.codedjson.templates.Pure;
import com.codedjson.templates.Questions;
import com.codedjson.templates.SimpleJson;
import com.codedjson.templates.Target;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import java.io.FileNotFoundException;
import java.util.List;
import java.util.ArrayList;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;


public class JsonTests extends Base {
    @Test
    public void iShouldBeAbleToUseIsContentJson() throws FileNotFoundException, IllegalJsonType, AbsolutePathConstraintError {
        CJson<Pure> cJson = new CJson<>(pureJsonfilePath);
        Assertions.assertEquals(cJson.isContentJson(), true, "IsContentJson check in cjson.content");
        Assertions.assertEquals(CJson.isContentJson(pureJsonfilePath), true, "Static IsContentJson check for file");
        Assertions.assertEquals(CJson.isContentJson(com.codedjson.utils.Base.read(pureJsonfilePath.toString())), true, "IsContentJson check for string content");
    }

    @Test
    public void iShouldBeAbleToUseIsContentJsonOnString() throws IllegalJsonType, AbsolutePathConstraintError, FileNotFoundException {
        CJson<Pure> cJson = new CJson<>("{\n" +
                "        \"types\": \"asd\",\n" +
                "        \"fruit\": <fruit>" +
                "}");

        Assertions.assertTrue(cJson.isContentJson(), "String content parsed to CJson");
    }

    @Test
    public void iShouldBeAbleToSeeIllegalJsonTypeException() throws IllegalJsonType, AbsolutePathConstraintError, FileNotFoundException {
        String jsonString = "\n" +
                "        \"types\": \"asd\",\n" +
                "        \"fruit\": <fruit>" +
                "}";

        assertThrows(IllegalJsonType.class, ()-> new CJson<>(jsonString), "CJson initialisation check for invalid string content");
    }

    @Test
    public void iShouldReceiveFalseFromIsContentJsonStaticMethod(){
        assertFalse(CJson.isContentJson(invalidJsonFilePath));
    }

    @Test
    public void iShouldBeAbleToParseJpath() throws FileNotFoundException, IllegalJsonType, AbsolutePathConstraintError, InvalidJPathError, UndeserializedCJSON {
        CJson<Target> cJson = new CJson<>(cjsonfilePath);
        cJson.deserialize(Target.class);
        String value = cJson.parse("$.source.pure.quiz.sport.q1.question").toString();
        Assertions.assertEquals(value, "Which one is correct team name in NBA?", "Parse function value check");
    }
    @Test
    public void iShouldNotBeAbleToParseWithInvalidJpath() throws FileNotFoundException, IllegalJsonType, AbsolutePathConstraintError, UndeserializedCJSON {
        CJson<Target> cJson = new CJson<>(cjsonfilePath);
        cJson.deserialize(Target.class);
        assertThrows(InvalidJPathError.class, () -> {
            String value = cJson.parse("source.quiz.sport.q1.question").toString();
        });
    }
    @Test
    public void iShouldBeAbleToUseParseWithoutParams() throws FileNotFoundException, IllegalJsonType, AbsolutePathConstraintError, UndeserializedCJSON {
        CJson<Target> cJson = new CJson<>(cjsonfilePath);
        cJson.deserialize(Target.class);
        String value = cJson.parse().toString();
        System.out.println(value);
        Assertions.assertNotNull(value);
    }

    @Test
    public void iShouldBeAbleToRetrieveAllTheKeys() throws IllegalJsonType, AbsolutePathConstraintError, FileNotFoundException, UndeserializedCJSON {
        CJson<SimpleJson> cjson = new CJson<>(simpleJsonFilePath);
        List<String> keys = cjson.getAllKeys();
        assertNotNull(keys);
        assertEquals(13, keys.size());
    }

    @Test
    public void iShouldBeAbleToRetrieveValueForTheKey() throws IllegalJsonType, AbsolutePathConstraintError, FileNotFoundException, UndeserializedCJSON {
        CJson<Pure> cjson = new CJson<>(pureJsonfilePath);
        Pure pure = cjson.deserialize(Pure.class);

        JsonObject value = (JsonObject) cjson.getValueFromKey("quiz");

        assertNotNull(value);
        assertEquals(pure.quiz.size(),value.size());

        List<Questions> questions = new ArrayList<>();

        pure.quiz.keySet().stream().forEach(key->
           questions.add(gson.fromJson(value.get(key).getAsJsonObject().get("q1"), Questions.class)));

        assertEquals(pure.quiz.get("maths").get("q1").question, questions.get(0).question);
        assertEquals(pure.quiz.get("maths").get("q1").options, questions.get(0).options);
        assertEquals(pure.quiz.get("maths").get("q1").answer, questions.get(0).answer);
        assertEquals(pure.quiz.get("sport").get("q1").question, questions.get(1).question);
        assertEquals(pure.quiz.get("sport").get("q1").options, questions.get(1).options);
        assertEquals(pure.quiz.get("sport").get("q1").answer, questions.get(1).answer);
    }

    @Test
    public void iShouldBeAbleToRetrieveValueForKeyFromCJson() throws IllegalJsonType, AbsolutePathConstraintError, FileNotFoundException, UndeserializedCJSON, NullJsonKeys {
        CJson<SimpleJson> simple = new CJson<>(simpleJsonFilePath);

        JsonArray jsArray = new JsonArray();
        jsArray.add("10");
        jsArray.add("11");
        jsArray.add("12");
        jsArray.add("13");

        Object value = simple.getValueFromKey("quiz.maths.q1.options");

        assertNotNull(value);
        assertEquals(jsArray, value);
    }

    @Test
    public void iShouldGetEmptyJsonString() throws IllegalAccessException {
        assertEquals("{}", CJson.toString(null));
    }

    @Test
    public void iShouldGetNullJsonKeys() throws IllegalJsonType, AbsolutePathConstraintError, FileNotFoundException {
        CJson<Pure> pure = new CJson<>("{}");
        pure.getAllKeys();
        assertThrows(NullJsonKeys.class, pure::getAllValues);
    }
}
