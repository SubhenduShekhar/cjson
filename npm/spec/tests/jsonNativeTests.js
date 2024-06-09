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
 * Tests related to native JSON files
 */
describe("JSON Test 2", () => {

    it("I should be able to use isContentJson()", () => {
        var cjson = new Cjson(pureJsonfilePath);
        assert.equal(cjson.isContentJson(), true);
    });

    it("I should be able to parse jpath using `obj< Cjson >.json.parse(\"Valid.JPATH\")`", () => {
        var cjson = new Cjson(cjsonfilePath);
        cjson.deserialize();
        
        var value = cjson.json.parse("$.source.pure.quiz.sport.q1.question");
        assert.equal(value, "Which one is correct team name in NBA?");
    });

    it("I should be able to parse full json using `obj< Cjson >.json.parse()`", () => {
        var cjson = new Cjson(cjsonfilePath);

        var value = JSON.stringify(cjson.json.parse());
        var actual = cjson.deserializeAsString();
        assert.equal(value, JSON.stringify(JSON.parse(actual)));
    });

    it("I should be able to replace a value using replace()", () => {
        var cjson = new Cjson(cjsonfilePath);
        cjson.deserialize();
        var jPath = "$.source.pure.quiz.sport.q1.question"
        cjson = cjson.replace(jPath, "New question");
        assert.equal(cjson.json.parse(jPath), "New question");
    });

    it("I should be able to get all keys after deserialization", () => {
        var cjson = new Cjson(VariableInjection);
        cjson.deserialize();

        assert.notEqual(cjson.json.getAllKeys().length, 0, "getAllKeys() test passed");
    })

    it("I should be able to get all values after deserialization", () => {
        var cjson = new Cjson(VariableInjection);
        cjson.deserialize();

        assert.notEqual(cjson.json.getAllValues().length, 0, "getAllValues() test passed");
    })
});