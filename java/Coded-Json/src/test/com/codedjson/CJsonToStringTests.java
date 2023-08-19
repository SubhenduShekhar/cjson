package com.codedjson;

import com.codedjson.exceptions.AbsolutePathConstraintError;
import com.codedjson.exceptions.IllegalJsonType;
import com.codedjson.templates.Pure;
import com.codedjson.templates.Questions;
import com.codedjson.templates.Target;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import java.io.FileNotFoundException;
import java.util.Arrays;
import java.util.HashMap;

public class CJsonToStringTests extends Base {
    @Test
    public void iShouldBeAbleToConvertJavaObjectToString() throws IllegalAccessException, IllegalJsonType, AbsolutePathConstraintError, FileNotFoundException {
        Target target = new Target();
        target.source = new Pure();
        target.source.quiz = new HashMap<>();

        HashMap<String, Questions> questionsHashMap = new HashMap<>();
        Questions questions = new Questions();
        questions.question = "Which one is correct team name in NBA?";
        questions.options = Arrays.asList("New York Bulls",
                "Los Angeles Kings",
                "Golden State Warriros",
                "Huston Rocket");
        questions.answer = "Huston Rocket";

        questionsHashMap.put("q1", questions);
        target.source.quiz.put("sport", questionsHashMap);

        String targetString = CJson.toString(target);
        Assertions.assertNotNull(targetString);

        CJson<Target> cJson = new CJson<>(targetString);
        Target deserializedObj = cJson.deserialize(Target.class);

        Assertions.assertNotNull(deserializedObj);
        Assertions.assertEquals(deserializedObj.source.quiz.get("sport").get("q1").question, "Which one is correct team name in NBA?");
        Assertions.assertEquals(deserializedObj.source.quiz.get("sport").get("q1").options.size(), 4);
        Assertions.assertEquals(deserializedObj.source.quiz.get("sport").get("q1").answer, "Huston Rocket");
    }
    @Test
    public void iShouldBeAbleToConvertJavaObjectWithNullsToString() throws IllegalAccessException, IllegalJsonType, AbsolutePathConstraintError, FileNotFoundException {
        Target target = new Target();
        target.source = new Pure();
        target.source.quiz = new HashMap<>();

        HashMap<String, Questions> questionsHashMap = new HashMap<>();

        questionsHashMap.put("q1", null);
        target.source.quiz.put("sport", questionsHashMap);

        String targetString = CJson.toString(target);
        Assertions.assertNotNull(targetString);

        CJson<Target> cJson = new CJson<>(targetString);
        Target deserializedObj = cJson.deserialize(Target.class);

        Assertions.assertNull(deserializedObj.source.quiz.get("q1"));
    }
    @Test
    public void iShouldBeAbleToConvertJavaObjectToStringUsingNullArray() throws IllegalAccessException, IllegalJsonType, AbsolutePathConstraintError, FileNotFoundException {
        Target target = new Target();
        target.source = new Pure();
        target.source.quiz = new HashMap<>();

        HashMap<String, Questions> questionsHashMap = new HashMap<>();
        Questions questions = new Questions();
        questions.question = "Which one is correct team name in NBA?";
        questions.options = null;
        questions.answer = "Huston Rocket";

        questionsHashMap.put("q1", questions);
        target.source.quiz.put("sport", questionsHashMap);

        String targetString = CJson.toString(target);
        Assertions.assertNotNull(targetString);

        CJson<Target> cJson = new CJson<>(targetString);
        Target deserializedObj = cJson.deserialize(Target.class);

        Assertions.assertNotNull(deserializedObj);
        Assertions.assertEquals(deserializedObj.source.quiz.get("sport").get("q1").question, "Which one is correct team name in NBA?");
        Assertions.assertNull(deserializedObj.source.quiz.get("sport").get("q1").options);
        Assertions.assertEquals(deserializedObj.source.quiz.get("sport").get("q1").answer, "Huston Rocket");
    }
}
