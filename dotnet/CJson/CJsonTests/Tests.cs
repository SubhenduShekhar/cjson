using CJson;
using CJson.Exceptions;
using CJsonTests.models;
using NUnit.Framework;
using Path = CJson.Path;

namespace CJsonTests
{
    internal class CJsonTests : Base
    {
        CJson<Pure> cJsonPure;
        CJson<Target> cJsonTarget;
        CJson<TargetRelativeCalls> cJsonTargetRelCalls;
        CJson<TargetObj> cJsonTargetObj;
        CJson<VariableInjection> cJsonVariableInjection;
        CJson<CJsonContentTarget> cJsonContentTarget;

        [Test, Description("I Should Be Able To Import Pure JSON Files")]
        public void IShouldBeAbleToImportPureJSONFiles()
        {
            cJsonPure = new CJson<Pure>(pureJsonfilePath);
            Pure pure = cJsonPure.Deserialize();

            Assert.That(pure.quiz.Keys.Count, Is.Not.EqualTo(0), "Pure JSON files deserialized successfully");
        }

        [Test, Description("I Should Be Able To Deserialize Comments From Json Files")]
        public void IShouldBeAbleToDeserializeCommentsFromjsonFiles()
        {
            cJsonPure = new CJson<Pure>(jsonfilePath);
            Pure cjsonObject = cJsonPure.Deserialize();

            Assert.That(cjsonObject.quiz["sport"]["q1"].question, Is.Not.Null, "JSON file with comments deserialized successfully");
            Assert.That(cjsonObject.quiz["sport"]["q2"], Is.Null, "JSON file with comments deserialized successfully");
        }

        [Test, Description("I Should Be Able To Deserialize Imports And Comments")]
        public void IShouldBeAbleToDeserializeImportsAndComments()
        {
            cJsonTarget = new CJson<Target>(cjsonFilePath);
            Target target = cJsonTarget.Deserialize();

            Assert.That(target.source.pure.quiz, Is.Not.Null, "Value check in source");
            Assert.That(target.target.color, Is.Not.Null, "Value chcek in target.color");
            Assert.That(target.target.quantity, Is.TypeOf(typeof(Int32)), "Type check passed for target.target.quantity");
        }

        [Test, Description("I Should Be Able To Deserialize Relative Path To Local Variable")]
        public void IShouldBeAbleToDeserializeRelativePathToLocalVariable()
        {
            cJsonTargetRelCalls = new CJson<TargetRelativeCalls>(relativeTargetCjson);
            TargetRelativeCalls targetRelativeCalls = cJsonTargetRelCalls.Deserialize();

            Assert.That(targetRelativeCalls.target.digitCheck, Is.EqualTo(cJsonTargetRelCalls.Parse("$.target.digitCheck")), "Digit check passed");
            Assert.That(targetRelativeCalls.target.colorList.Count, Is.Not.Zero, "Relative variables mapped successfully");
        }

        [Test, Description("I Should Be Able To Deserialize CJSON String")]
        public void IShouldBeAbleToDeserializeCJSONString()
        {
            String cjsonContent = "{\n" +
                "    \"source\": $import \"" + pureJsonfilePath.ToString + "\",\n" +
                "    \"target\": {\n" +
                "        \"fruit\": \"Apple\",\n" +
                "        \"size\": \"Large\",\n" +
                "        \"color\": \"Red\"\n" +
                "    }\n" +
                "}";
            cJsonContentTarget = new CJson<CJsonContentTarget>(cjsonContent);
            CJsonContentTarget target = cJsonContentTarget.Deserialize();

            Assert.That(target.source.quiz["sport"]["q1"].question, Is.Not.Null, "CJSON string with import statement is deserialized successfully");
        }

        [Test, Description("I Should Not Be Able To Deserialize If Import Statement Is Relative Path")]
        public void IShouldNotBeAbleToDeserializeIfImportStatementIsRelativePath()
        {
            String cjsonContent = "{\n" +
                "    \"source\": $import \"\\test-files\\source.json\",\n" +
                "    \"target\": {\n" +
                "        \"fruit\": \"Apple\",\n" +
                "        \"size\": \"Large\",\n" +
                "        \"color\": \"Red\"\n" +
                "    }\n" +
                "}";
            AbsolutePathConstraintError exception = Assert.Throws<AbsolutePathConstraintError>(() => new CJson<Target>(cjsonContent));
            
            Assert.That(exception.Message, Is.EqualTo("Expected absolute path in import statement but got relative"));
        }

        [Test, Description("I Should Be Able To Inject Runtime Values Using Key Value")]
        public void IShouldBeAbleToInjectRuntimeValuesUsingKeyValue()
        {
            cJsonTargetObj = new CJson<TargetObj>("{\n" +
                "        \"types\": \"asd\",\n" +
                "        \"fruit\": <fruit>" +
                "}");

            TargetObj? targetObj = cJsonTargetObj.Inject("fruit", "apple");

            Assert.That(targetObj?.fruit, Is.EqualTo("apple"));
        }

        [Test, Description("I Should Be Able To Inject Runtime Values Using HashMap")]
        public void IShouldBeAbleToInjectRuntimeValuesUsingHashMap()
        {
            cJsonVariableInjection = new CJson<VariableInjection>(variableInjectionCjson);

            Dictionary<String, dynamic> values = new Dictionary<string, dynamic>();
            values.Add("jsonTypeData", "placeholder");
            values.Add("fruit", "apple");
            values.Add("quantity", 1);

            VariableInjection? variableInjection = cJsonVariableInjection.Inject(values);

            Assert.That(variableInjection?.jsonInjection, Is.EqualTo(values["jsonTypeData"]));
            Assert.That(variableInjection.target.fruit, Is.EqualTo(values["fruit"]));
        }

        [Test, Description("I Should Be Able To Deserialize And Fetch As String")]
        public void IShouldBeAbleToDeserializeAndFetchAsString()
        {
            cJsonTargetRelCalls = new CJson<TargetRelativeCalls>(relativeTargetCjson);
            String targetRelCalsString = cJsonTargetRelCalls.DeserializeAsString();
            TargetRelativeCalls? targetRelativeCalls = cJsonTargetRelCalls.Deserialize();

            Assert.That(targetRelativeCalls.source.quiz["sport"]["q1"].question, Is.EqualTo("Which one is correct team name in NBA?"));
        }

        [Test, Description("I Should Be Able To Get Json String From Class Object")]
        public void IShouldBeAbleToGetJsonStringFromClassObject()
        {
            cJsonTargetRelCalls = new CJson<TargetRelativeCalls>(relativeTargetCjson);
            String targetRelCalsString = cJsonTargetRelCalls.DeserializeAsString();
            TargetRelativeCalls? targetRelativeCalls = cJsonTargetRelCalls.Deserialize();

             String str = CJson.CJson<Object>.ToString(targetRelativeCalls);
            TargetRelativeCalls? targetRelativeCallsParsed = new CJson<TargetRelativeCalls>(str).Deserialize();

            Assert.That(targetRelativeCalls.target.digitCheck, Is.EqualTo(targetRelativeCallsParsed?.target.digitCheck));
        }
        [Test, Description("I Should Be Able To Remove Using Key")]
        public void IShouldBeAbleToRemoveUsingKey()
        {
            cJsonTarget = new CJson<Target>(cjsonFilePath);

            Target target = cJsonTarget.Remove("$.target.fruit").Deserialize();
            Assert.Null(target.target.fruit);

            target = cJsonTarget.Remove("$.target").Deserialize();
            Assert.Null(target.target);
        }
        [Test, Description("I Should Be Able To Convert Empty Array Object To String")]
        public void iShouldBeAbleToConvertEmptyArrayObjectToString()
        {
            List<String> li = new List<String>();
            Assert.That("[]", Is.EqualTo(CJson<object>.ToString(li)));
        }

        [TearDown]
        public void AfterTest()
        {
            cJsonPure = default;
            cJsonTarget = default;
            cJsonTargetRelCalls = default;
            cJsonTargetObj = default;
            cJsonVariableInjection = default;
        }
    }
}