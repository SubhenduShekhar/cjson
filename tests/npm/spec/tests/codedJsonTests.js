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
});

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
        var value = cjson.json.parse("source.quiz.sport.q1.question");
        assert.equal(value, "Which one is correct team name in NBA?");
    });

    it("I should be able to parse full json using `obj< Cjson >.json.parse()`", () => {
        var cjson = new Cjson(cjsonfilePath);
        var value = cjson.json.parse();
        assert.equal(value, cjson.deserialize());
    });
});