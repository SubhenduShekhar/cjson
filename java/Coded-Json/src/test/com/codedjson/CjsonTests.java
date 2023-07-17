package com.codedjson;

import com.codedjson.templates.Pure;
import com.codedjson.templates.Target;
import com.codedjson.templates.TargetRelativeCalls;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

public class CjsonTests extends Base {
    @Test
    public void iShouldBeAbleToImportPureJSONFiles() throws Exception {
        CJson<Pure> cJson = new CJson<>(pureJsonfilePath);
        Pure pure = cJson.deserialize(Pure.class);

        Assertions.assertNotEquals(pure.quiz.keySet().size(), 0, "Pure JSON files deserialized successfully");
    }
    @Test
    public void iShouldBeAbleToDeserializeCommentsFromjsonFiles() throws Exception {
        CJson<Pure> cJson = new CJson<>(jsonfilePath);
        Pure cjsonObject = cJson.deserialize(Pure.class);

        Assertions.assertNotEquals(cjsonObject.quiz.get("sport").get("q1").question, null);
        Assertions.assertEquals(cjsonObject.quiz.get("sport").get("q2"), null);
    }
    @Test
    public void iShouldBeAbleToDeserializeImportsAndComments() throws Exception {
        CJson<Target> cJson = new CJson<>(cjsonfilePath);
        Target decodedJson = cJson.deserialize(Target.class);
        Assertions.assertNotEquals(decodedJson.source.quiz, null, "Value check in source");
        Assertions.assertNotEquals(decodedJson.target.color, null, "Value check in target.color");
    }
    @Test
    public void iShouldBeAbleToDeserializeRelativePathToLocalVariable() throws Exception {
        CJson<TargetRelativeCalls> cJson = new CJson<TargetRelativeCalls>(relativeTargetCjson);

        TargetRelativeCalls targetRelativeCalls = cJson.deserialize(TargetRelativeCalls.class);
        Assertions.assertEquals(targetRelativeCalls.target.digitCheck, cJson.parse("$.target.digitCheck"));
    }
}