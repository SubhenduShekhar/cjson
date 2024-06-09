const assert = require('assert');
const fs = require('fs');
const path = require('path');
const Cjson = require("../../out/cjson").Cjson;
const jasmine = require("jasmine");

const basePath = path.join(__dirname, "..", "..", "..", "tests", "test-files");
/** Path to target.cjson */
const cjsonfilePath = path.join(basePath, "target.cjson");
/** Path to source.json */
const jsonfilePath = path.join(basePath, "source.json");
/** Path to pure.json */
const pureJsonfilePath = path.join(basePath, "pure.json");
/** Path to relativeTargetCjson.json */
const relativeTargetCjson = path.join(basePath, "targetRelativeCalls.cjson");
/** Path to relativeTargetCjson.json */
const VariableInjection = path.join(basePath, "VariableInjection.cjson");

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

    it("I should be able to import nested CJSON files", () => {
        var cjson = new Cjson(cjsonfilePath);
        var pureJSONContent = cjson.deserialize();
        assert.equal(cjson.json.parse("$.source.pure.quiz.sport.q1.question"), "Which one is correct team name in NBA?");
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
        var deserializedVal = cjson.inject(injectObj).deserialize();
        
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
        cjson = cjson.remove("$.quiz.sport.q1.question");
        assert.equal(cjson.deserialize().quiz.sport.q1.question, undefined);
        cjson = cjson.remove("$.quiz.sport.q1.options");
        assert.equal(cjson.deserialize().quiz.sport.q1.options, undefined);
        cjson = cjson.remove("$.quiz.sport.q1");
        assert.equal(cjson.deserialize().quiz.sport.q1, undefined);
    });

    it("I should be able to stringify JSON object using toString()", ()=> {
        var fileContent = fs.readFileSync(pureJsonfilePath).toJSON();
        var stringContent = Cjson.toString(fileContent);
        assert.equal(JSON.stringify(fileContent), stringContent);
    });

    it("I should be able to replace a value in JSON context using replace()", () => {
        var cjson = new Cjson(cjsonfilePath);
        cjson = cjson.replace("$.source.pure.quiz.sport.q1.answer", "Los Angeles Kings");

        assert.equal(cjson.json.parse("$.source.pure.quiz.sport.q1.answer"), "Los Angeles Kings");
    });

    it("I should be able to inject null value during runtime", () => {
        var cjson = new Cjson(VariableInjection);
        cjson = cjson.inject({
            "fruit": null
        });
        assert.equal(cjson.deserialize().target.fruit, null, "Null value injection is successfull");
    });

    it("I should be able to inject array", () => {
        var cjson = new Cjson(VariableInjection);
        cjson = cjson.inject({
            "fruit": ["Orange", "Apple", "Banana"]
        });
        assert.equal(cjson.deserialize().target.fruit.length, 3, "Null value injection is successfull");
    });
});