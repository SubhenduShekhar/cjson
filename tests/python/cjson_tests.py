import unittest
from os import path
from cjson import Cjson, content_json_check
import json
from enum import Enum

def get_file_path(file_name: str):
    return path.abspath(path.join("..", "test-files", file_name))

cjson_file_path = get_file_path("target.cjson")
json_file_path = get_file_path("source.json")
pure_json_file_path = get_file_path("pure.json")
relative_target_cjson = get_file_path("targetRelativeCalls.cjson")
variable_injection = get_file_path("VariableInjection.cjson")

class Result(Enum):
    Pass = "Pass"
    Fail = "Fail"
    
def add_resut(result: Result, message: str):
    print(result, ":", message)

class CjsonTests(unittest.TestCase):
    def test1(self):
        cjson = Cjson(pure_json_file_path)
        pure_json_content = cjson.deserialize()
        
        file = open(pure_json_file_path)
        
        actual = json.loads(file.read())
        file.close()

        self.assertEqual(pure_json_content, actual)
        add_resut(Result.Pass, "I should be able to import pure JSON files")
    
    def test2(self):
        cjson = Cjson(json_file_path)
        cjson.deserialize()
        add_resut(Result.Pass, "I should be able to deserialize comments from json files")

    def test3(self):
        cjson = Cjson(cjson_file_path)
        decoded_json = cjson.deserialize()

        self.assertNotEqual(decoded_json, json.loads("{}"))
        add_resut(Result.Pass, "I should be able to deserialize imports and comments")
    
    def test4(self):
        cjson = Cjson(relative_target_cjson)

        decoded_json = cjson.deserialize()

        print(decoded_json)

        self.assertEqual(decoded_json["target"]["digitCheck"], cjson.json.parse("target.digitCheck"))
        self.assertEqual(decoded_json["target"]["digitImport"], cjson.json.parse("target.digitImport"))
        self.assertEqual(decoded_json["relativeCalls"]["quiz"]["sport"]["q1"]["question"], cjson.json.parse("relativeCalls.quiz.sport.q2.question"))
        
        digit_array_import = cjson.json.parse("target.digitArrayImport")

        for i in range(0, len(digit_array_import)):
            self.assertEqual(digit_array_import[i], cjson.json.parse("target.digitArrayImport")[i])
        
        add_resut(Result.Pass, "I should be able to deserialize relative path to local variable")
    
    def test5(self):
        cjson = Cjson(variable_injection)

        injec_data = {
            "fruit": "apple",
            "quantity": 1,
            "jsonTypeData": {
                "secondaryData": {
                    "type": "fruit",
                    "seeds": "yes"
                }
            }
        }

        data = cjson.inject(injecting_obj=injec_data)
        
        self.assertEqual(cjson.json.parse("target.fruit"), injec_data["fruit"])
        self.assertEqual(cjson.json.parse("target.quantity"), injec_data["quantity"])
        self.assertEqual(cjson.json.parse("jsonInjection.secondaryData.type"), injec_data["jsonTypeData"]["secondaryData"]["type"])

        add_resut(Result.Pass, "I should be able to inject data using inject()")

class JSONTests(unittest.TestCase):
    def test1(self):
        result = content_json_check(content=pure_json_file_path, is_file_path=True)
        self.assertEqual(result, True)
        add_resut(Result.Pass, "I should be able to use isContentJson()")
    
    def test2(self):
        cjson = Cjson(cjson_file_path)
        cjson.deserialize()
        value = cjson.json.parse("source.pure.quiz.sport.q1.question")
        self.assertEqual(value, "Which one is correct team name in NBA?")
        add_resut(Result.Pass, "I should be able to parse jpath using `obj< Cjson >.json.parse(\"Valid.JPATH\")`")
    
    def test3(self):
        cjson = Cjson(cjson_file_path)
        cjson.deserialize()
        value = cjson.json.parse()
        self.assertEqual(value, cjson.deserialize())

if __name__ == '__main__':
    unittest.main()