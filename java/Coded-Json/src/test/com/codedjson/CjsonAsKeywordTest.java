package com.codedjson;

import com.codedjson.exceptions.AbsolutePathConstraintError;
import com.codedjson.exceptions.IllegalJsonType;
import com.codedjson.exceptions.UnsupportedDatatypeForImport;
import com.codedjson.exceptions.VariableInjectionException;
import com.codedjson.templates.Source;
import com.codedjson.templates.SourceStr;
import com.codedjson.templates.Target;
import com.codedjson.templates.TargetRelativeCalls;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

import java.io.FileNotFoundException;
import java.util.HashMap;
import java.util.Map;

public class CjsonAsKeywordTest extends Base {
    @Test
    public void iShouldBeAbleToDeserializeImportWithAsStringKeywords() throws IllegalJsonType, AbsolutePathConstraintError, UnsupportedDatatypeForImport, FileNotFoundException, VariableInjectionException {
        CJson<SourceStr> cJson = new CJson<>(asStringWithImport);
        SourceStr sourceStr = cJson.deserialize(SourceStr.class);
        System.out.println(cJson.deserializeAsString());
        assertNotNull(sourceStr.sourceStr);
        assertEquals(sourceStr.sourceStr.getClass(), String.class);
    }
    @Test
    public void iShouldBeAbleToDeserializeImportWithAsJSONKeywords() throws IllegalJsonType, AbsolutePathConstraintError, UnsupportedDatatypeForImport, FileNotFoundException, VariableInjectionException {
        CJson<Target> cJson = new CJson<>(asJsonWithImport);
        Target target = cJson.deserialize(Target.class);
        System.out.println(cJson.deserializeAsString());
        assertNotNull(target.source);
        assertEquals(target.source.getClass(), Source.class);
    }
}
