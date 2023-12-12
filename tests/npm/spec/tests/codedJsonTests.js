const Cjson = require('coded-json').Cjson;
const assert = require('assert');
const fs = require('fs');
const path = require('path');

/** Path to target.cjson */
const cjsonfilePath = path.join(__dirname, "..", "..", "..", "\\test-files\\target.cjson");
/** Path to source.json */
const jsonfilePath = path.join(__dirname, "..", "..", "..", "\\test-files\\source.json");
/** Path to pure.json */
const pureJsonfilePath = path.join(__dirname, "..", "..", "..", "\\test-files\\pure.json");
/** Path to relativeTargetCjson.json */
const relativeTargetCjson = path.join(__dirname, "..", "..", "..", "\\test-files\\targetRelativeCalls.cjson");
/** Path to relativeTargetCjson.json */
const VariableInjection = path.join(__dirname, "..", "..", "..", "\\test-files\\VariableInjection.cjson");

/**
 * Tests related to CJSON files 
 */
describe("CJSON Test 1", () => {

    it("I should be able to import pure JSON files", () => {
        var cjson = new Cjson(pureJsonfilePath);
        var pureJSONContent = cjson.deserialize();

        var jsonStringFromPure = JSON.parse(fs.readFileSync(pureJsonfilePath).toString());
        assert.equal(JSON.stringify(pureJSONContent), JSON.stringify(jsonStringFromPure));
    });

    it("I should be able to deserialize comments from json files", () => {
        var cjson = new Cjson(jsonfilePath);
        cjson.deserialize();
    });

    it("I should be able to deserialize imports and comments", () => {
        var cjson = new Cjson(cjsonfilePath);

        var decodedJSON = cjson.deserialize();

        assert.notEqual(decodedJSON, JSON.parse("{}"))
    });

    it("I should be able to deserialize relative path to local variable", () => {
        var cjson = new Cjson(relativeTargetCjson);

        var decodedJSON = cjson.deserialize();

        console.log(decodedJSON);
        
        assert.equal(decodedJSON.target.digitCheck, cjson.json.parse("target.digitCheck"));
        assert.equal(decodedJSON.target.digitImport, cjson.json.parse("target.digitImport"));
        assert.equal(decodedJSON.relativeCalls.quiz.sport.q1.question, decodedJSON.relativeCalls.quiz.sport.q2.question)
        var digitArrayImport = decodedJSON.target.digitArrayImport;
        for(let i = 0; i < digitArrayImport.length; i ++)
            assert.equal(digitArrayImport[i], cjson.json.parse("target.digitArrayImport")[i]);
    });

    it("I should be able to inject values", () => {
        var cjson = new Cjson(VariableInjection);
        var injectObj = {
            fruit: "apple",
            quantity: 1,
            jsonTypeData: {
                injectedData: "jsonInjectionValue"
            }
        };
        var deserializedVal = cjson.inject(injectObj);
        
        console.log(deserializedVal);
        assert.equal(deserializedVal.target.fruit, injectObj.fruit);
        assert.equal(JSON.stringify(deserializedVal.jsonInjection), JSON.stringify(injectObj.jsonTypeData))
    });

    it("I should be able to use toString function", () => {
        assert.equal(Cjson.toString(null), "{}", "Null test passed");

        var cjson = new Cjson(pureJsonfilePath);
        var obj = cjson.deserialize();
        
        var parsedObj = JSON.parse(fs.readFileSync(pureJsonfilePath).toString());
        parsedObj = JSON.stringify(parsedObj);
        assert.equal(Cjson.toString(obj), parsedObj, "Pure JSON file is verified with toString");
    });

    it("I should be able to deserialize CJSON and return JSON string using deserializeAsString()", () => {
        var cjson = new Cjson(relativeTargetCjson);
        var stringObj = cjson.deserializeAsString();
        stringObj = JSON.stringify(JSON.parse(stringObj));
        
        var parsedObj = JSON.stringify(cjson.deserialize());
        assert.equal(stringObj, parsedObj, "Testing deserializeAsString()");
    });

    it("I should be able to deserialize CJSON as JSON string content", () => {
        var cjson = new Cjson(relativeTargetCjson);
        var stringContent = cjson.deserializeAsString();
        assert.equal(JSON.stringify(cjson.deserialize()), JSON.stringify(JSON.parse(stringContent)))
    });

    it("I should be able to remove a key using remove function", () => {
        var cjson = new Cjson(pureJsonfilePath);
        cjson = cjson.remove("$.quiz.sport.q1.answer");
        assert.equal(cjson.deserialize().quiz.sport.q1.answer, undefined);
    });

    it("I should be able to stringify JSON object using toString function", ()=> {
        var fileContent = fs.readFileSync(pureJsonfilePath).toJSON();
        var stringContent = Cjson.toString(fileContent);
        assert.equal(JSON.stringify(fileContent), stringContent);
    });
});

/**
 * Tests related to native JSON files
 */
// describe("JSON Test 2", () => {

//     it("I should be able to use isContentJson()", () => {
//         var cjson = new Cjson(pureJsonfilePath);
//         assert.equal(cjson.isContentJson(), true);
//     });

//     it("I should be able to parse jpath using `obj< Cjson >.json.parse(\"Valid.JPATH\")`", () => {
//         var cjson = new Cjson(cjsonfilePath);
//         cjson.deserialize();
        
//         var value = cjson.json.parse("source.quiz.sport.q1.question");
//         assert.equal(value, "Which one is correct team name in NBA?");
//     });

//     it("I should be able to parse full json using `obj< Cjson >.json.parse()`", () => {
//         var cjson = new Cjson(cjsonfilePath);
//         cjson.deserialize();

//         var value = JSON.stringify(cjson.json.parse());
//         assert.equal(value, JSON.stringify(cjson.deserialize()));
//     });
// });