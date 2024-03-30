package com.codedjson;

import com.codedjson.exceptions.*;
import com.codedjson.templates.Target;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.List;

public class CjsonRemoveTests extends Base {
    @Test
    public void iShouldBeAbleToRemoveAStringKeyValue() throws FileNotFoundException, IllegalJsonType, AbsolutePathConstraintError, UndeserializedCJSON, InvalidJPathError, VariableInjectionException {
        CJson<Target> cJson = new CJson<>(cjsonfilePath);
        cJson.deserialize(Target.class);
        Target target = cJson.remove("$.target.fruit");
        Assertions.assertNull(target.target.fruit);
        target = cJson.remove("$.source.pure.quiz.sport.q1.options");
        Assertions.assertNull(target.source.pure.quiz.get("sport").get("q1").options);

        target = cJson.remove("$.target.quantity");
        Assertions.assertEquals(target.target.quantity, 0);
    }
    @Test
    public void iShouldBeAbleToReceiveUndeserializedCJSONExceptionIRemoveWithoutDeserialize() throws FileNotFoundException, IllegalJsonType, AbsolutePathConstraintError {
        CJson<Target> cJson = new CJson<>(cjsonfilePath);

        Assertions.assertThrows(UndeserializedCJSON.class, () -> {
            cJson.remove("$.target.fruit");
        });
    }
    @Test
    public void iShouldBeAbleToRemoveUsingListOfKeys() throws FileNotFoundException, IllegalJsonType, AbsolutePathConstraintError, UndeserializedCJSON, VariableInjectionException {
        CJson<Target> cJson = new CJson<>(cjsonfilePath);
        cJson.deserialize(Target.class);

        List<String> li = new ArrayList<>();
        li.add("$.target.fruit");
        li.add("$.source.pure.quiz.sport.q1.options");
        li.add("$.target.quantity");

        Target target = cJson.remove(li);

        Assertions.assertNull(target.target.fruit);
        Assertions.assertNull(target.source.pure.quiz.get("sport").get("q1").options);

        Assertions.assertEquals(target.target.quantity, 0);
    }
    @Test
    public void iShouldBeAbleToReceiveUndeserializedCJSONExceptionIRemoveWithoutDeserializeInListOfKeys() throws FileNotFoundException, IllegalJsonType, AbsolutePathConstraintError {
        CJson<Target> cJson = new CJson<>(cjsonfilePath);
        List<String> li = new ArrayList<>();
        li.add("$.target.fruit");
        li.add("$.source.pure.quiz.sport.q1.options");
        li.add("$.target.quantity");

        Assertions.assertThrows(UndeserializedCJSON.class, () -> {
            cJson.remove(li);
        });
    }
}
