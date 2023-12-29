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
    print()
    print(result, ":", message)

class CjsonTests(unittest.TestCase):
    def setUp(self) -> None:
        super().setUp()
        print("Executing test : ", self._testMethodName)
    
    def tearDown(self) -> None:
        super().tearDown()
        print("----------Finished executing test---------")

    def test_I_should_be_able_to_import_pure_JSON_files(self):
        cjson = Cjson(pure_json_file_path)
        pure_json_content = cjson.deserialize()
        
        file = open(pure_json_file_path)
        
        actual = json.loads(file.read())
        file.close()

        self.assertEqual(pure_json_content, actual)
        add_resut(Result.Pass, "I should be able to import pure JSON files")
    
    def test_I_should_be_able_to_import_nested_CJSON_files_and_parse_value_from_cjson(self):
        cjson = Cjson(cjson_file_path)
        cjson.deserialize()
        self.assertEqual(cjson.parse("$.source.pure.quiz.sport.q1.answer"), "Huston Rocket")
        add_resut(Result.Pass, "I should be able to import nested CJSON files")
        add_resut(Result.Pass, "I should be able to parse with valid jpath")
    
    def test_I_should_be_able_to_deserialize_comments_from_json_files(self):
        cjson = Cjson(json_file_path)
        cjson.deserialize()
        add_resut(Result.Pass, "I should be able to deserialize comments from json files")

    def test_I_should_be_able_to_deserialize_imports_and_comments(self):
        cjson = Cjson(cjson_file_path)
        decoded_json = cjson.deserialize()

        self.assertNotEqual(decoded_json, json.loads("{}"))
        add_resut(Result.Pass, "I should be able to deserialize imports and comments")
    
    def test_I_should_be_able_to_deserialize_relative_path_to_local_variable(self):
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
    
    def test_I_should_be_able_to_inject_data_using_inject(self):
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

    def test_I_should_be_able_to_deserialize_content_and_get_string_value(self):
        cjson = Cjson(relative_target_cjson)
        self.assertIsNotNone(cjson.deserializeAsString())
        add_resut(Result.Pass, "I should be able to deserialize content and get string value")
    
    def test_I_should_be_able_to_use_to_string_function(self):
        obj: dict = {
            "name": "Ramesh Duggal",
            "nickNames": ["Ramy", "Ram", "duggal"],
            "phones": 9090909090,
            "address": {
                "flat": 13,
                "street": "1st Cross, Marks Avenue, Gandhinagar",
                "pin": 382010
            }
        }
        self.assertIsNotNone(Cjson.to_string(obj=obj))
        add_resut(Result.Pass, "I should be able to use to_string()")
    
    def test_I_should_be_able_to_remove_using_key(self):
        cjson = Cjson(json_file_path)
        cjson.deserialize()

        cjson = cjson.remove("$.quiz.sport.q1.question")
        try:
            cjson.parse("$.quiz.sport.q1.question")
            self.assertEqual("Removed but still present", "")
        except KeyError:
            add_resut(Result.Pass, "String value is removed successfully")
        
        cjson = cjson.remove("$.quiz.sport.q1.options")
        try:
            cjson.parse("$.quiz.sport.q1.options")
            self.assertEqual("Removed but still present", "")
        except KeyError:
            add_resut(Result.Pass, "Array value is removed successfully")
        
        try:
            cjson.parse("$.quiz.sport.q1.question")
            self.assertEqual("Removed but still present", "")
        except KeyError:
            add_resut(Result.Pass, "Previously removed key is not present")
            
        cjson = cjson.remove("$.quiz.sport.q2")
        try:
            cjson.parse("$.quiz.sport.q2")
            self.assertEqual("Removed but still present", "")
        except KeyError:
            add_resut(Result.Pass, "Null valued keys are removed successfully")
    
    def test_I_should_be_able_to_replace_using_key_and_value(self):
        cjson = Cjson(pure_json_file_path)
        cjson.replace("$.quiz.sport.q1.question", "New question")

        self.assertEqual(cjson.parse("$.quiz.sport.q1.question"), "New question")
        add_resut(Result.Pass, "I should be able to replace using key and value")


class JSONTests(unittest.TestCase):
    def setUp(self) -> None:
        super().setUp()
        print("Executing test : ", self._testMethodName)
    
    def tearDown(self) -> None:
        super().tearDown()
        print("----------Finished executing test---------")

    def test_I_should_be_able_to_use_isContentJson(self):
        result = content_json_check(content=pure_json_file_path, is_file_path=True)
        self.assertEqual(result, True)
        add_resut(Result.Pass, "I should be able to use isContentJson()")
    
    def test_I_should_be_able_to_parse_jpath_using_parse_with_jpath(self):
        cjson = Cjson(cjson_file_path)
        cjson.deserialize()
        value = cjson.json.parse("source.pure.quiz.sport.q1.question")
        self.assertEqual(value, "Which one is correct team name in NBA?")
        add_resut(Result.Pass, "I should be able to parse jpath using `obj< Cjson >.json.parse(\"Valid.JPATH\")`")
    
    def test_parse_function_should_return_full_json_content(self):
        cjson = Cjson(cjson_file_path)
        cjson.deserialize()
        value = cjson.json.parse()
        self.assertEqual(value, cjson.deserialize())
        add_resut(Result.Pass, "parse() should return full json content")
    
    def test_I_should_be_able_to_get_all_possible_json_paths(self):
        cjson = Cjson(cjson_file_path)
        cjson.deserialize()

        self.assertNotEqual(cjson.json.get_all_keys(), 0)

    def test_I_should_be_able_to_get_all_possible_values(self):
        cjson = Cjson(pure_json_file_path)
        cjson.deserialize()
        keys: list[str] = cjson.json.get_all_keys()
        values: list[str] = cjson.json.get_all_values()

        self.assertEqual(len(keys), len(values))

        for x in range(0, len(keys)):
            self.assertEqual(cjson.parse(keys[x]), values[x])

if __name__ == '__main__':
    unittest.main()