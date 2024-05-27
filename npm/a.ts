import { Cjson } from "./src/cjson";

var p = "C:/Users/Home/OneDrive/Desktop/TestDataFiles/config.cjson";

var a = new Cjson(p, false);

console.log(a.deserializeAsString())