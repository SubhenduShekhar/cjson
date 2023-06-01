const Cjson = require('coded-json').Cjson;
const path = require('path');

const filePath = path.join(__dirname, "..", "..", "..", "\\test-files\\target.cjson");

describe("CJSON Test 1", () => {
    it("I should be able to deserialize imports and comments", () => {
        var cjson = new Cjson(filePath);

        var b = cjson.deserialize();
        console.log(b);
    });
});