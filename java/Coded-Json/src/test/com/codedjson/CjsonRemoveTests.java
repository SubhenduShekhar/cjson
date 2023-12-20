package com.codedjson;

import com.codedjson.exceptions.AbsolutePathConstraintError;
import com.codedjson.exceptions.IllegalJsonType;
import com.codedjson.exceptions.InvalidJPathError;
import com.codedjson.exceptions.UndeserializedCJSON;
import com.codedjson.templates.Target;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.List;

public class CjsonRemoveTests extends Base {
    @Test
    public void iShouldBeAbleToRemoveAStringKeyValue() throws FileNotFoundException, IllegalJsonType, AbsolutePathConstraintError, UndeserializedCJSON, InvalidJPathError {
        CJson<Target> cJson = new CJson<>(cjsonfilePath);
        cJson.deserialize(Target.class);
        Target target = cJson.remove("$.target.fruit");
        Assertions.assertNull(target.target.fruit);

        target = cJson.remove("$.source.quiz.sport.q1.options");
        Assertions.assertNull(target.source.quiz.get("sport").get("q1").options);

        target = cJson.remove("$.target.quantity");
        Assertions.assertNull(target.target.quantity);
    }
    @Test
    public void iShouldBeAbleToReceiveUndeserializedCJSONExceptionIRemoveWithoutDeserialize() throws FileNotFoundException {
        CJson<Target> cJson = new CJson<>(cjsonfilePath);

        Assertions.assertThrows(UndeserializedCJSON.class, () -> {
            cJson.remove("$.target.fruit");
        });
    }
    @Test
    public void iShouldBeAbleToRemoveUsingListOfKeys()  throws FileNotFoundException, IllegalJsonType, AbsolutePathConstraintError, UndeserializedCJSON {
        CJson<Target> cJson = new CJson<>(cjsonfilePath);
        cJson.deserialize(Target.class);

        List<String> li = new ArrayList<>();
        li.add("$.target.fruit");
        li.add("$.source.quiz.sport.q1.options");
        li.add("$.target.quantity");

        Target target = cJson.remove(li);

        Assertions.assertNull(target.target.fruit);
        Assertions.assertNull(target.source.quiz.get("sport").get("q1").options);

        Assertions.assertNull(target.target.quantity);
    }
    @Test
    public void iShouldBeAbleToReceiveUndeserializedCJSONExceptionIRemoveWithoutDeserializeInListOfKeys()  throws FileNotFoundException {
        CJson<Target> cJson = new CJson<>(cjsonfilePath);
        List<String> li = new ArrayList<>();
        li.add("$.target.fruit");
        li.add("$.source.quiz.sport.q1.options");
        li.add("$.target.quantity");

        Assertions.assertThrows(UndeserializedCJSON.class, () -> {
            cJson.remove(li);
        });
    }
}
