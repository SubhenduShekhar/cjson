from utils.file import read
from utils._is import Is
from utils.keywords import Keywords
from utils._json import Json, is_content_json as content_json_check, separate_by_comma
from os import path
import json, re

class Cjson(Is):
    __obj:any
    __file_path: str
    __content: str = ""
    __comma_separated: list[str] = []
    __json: Json | None = None
    
    
    

    def is_content_json(self, is_file_path: bool):
        return content_json_check(self.__content, is_file_path=is_file_path)

    def __init__(self, file_path: str):
        super().__init__()
        self.__obj = None
        self.__file_path = file_path
        self.__content = read(self.__file_path)
        self.__comma_separated = self.__content.split(",")
        self.__decode_keywords()
        self.__json = Json(self.__obj)
        self.__decode_relative_paths()
    
    def __decode_keywords(self):
        is_changed: bool = False
        while(True):
            is_changed = False

            if self._is_import(self.__content):
                self.__decode_import(self.__content)
                is_changed = True
            
            if self.is_single_line_comments(self.__content):
                self.__decode_single_line_comment(self.__content)
                is_changed = True
            
            if not is_changed:
                break
    
    def __refine_obj(self, content: str = None):
        if self.__content != None:
            self.__content = content
        
        self.__json = Json(self.__content, False)
        self.__obj = json.loads(self.__content)

    def __decode_relative_paths(self, content: str):
        unique_keys: list[str] = re.search(Keywords.relative_jpath_regex, content)

        for each_key in unique_keys:
            key_regex: str = each_key.replace("$", "\\$")
            content = content.replace(key_regex, "\"<" + each_key + ">\"")

        self.__refine_obj(content=content)

        for each_key in unique_keys:
            key_regex: str = "\\<" + each_key.replace("$", "\\$") + "\\>"

            while(self.__json.parse(each_key.split(Keywords.relative_jpath)[1]))

        # self.__content = str(self.__obj)
        # self.__comma_separated = self.__content.split(",")

        # for i in range(0, len(self.__comma_separated)):
        #     each_path: list[str] = self.__comma_separated[i].split(":")
        #     for j in range(0, len(each_path)):
        #         if each_path[j].strip().startswith("\"" + Keywords.relative_jpath):
        #             exact_key: str = each_path[j].strip().split("\"" + Keywords.relative_jpath)[1].split("\"")[0]
        #             value: str = self.__json.parse(exact_key)
        #             if type(value) == str:
        #                 value = "\"" + value + "\""
        #                 self.__content = self.__content.replace("\"" + Keywords.relative_jpath + exact_key + "\"", value)

    def deserialize(self):
        return self.__obj
    
    def __get_file_path(self, line_item: str):
        return line_item.split(Keywords.import_key)[1].split("\"")[0]

    def __decode_import(self, line_item: str):
        file_path: str = self.__get_file_path(line_item=line_item)
        dir_name: str = path.dirname(path.abspath(self.__file_path))
        import_file_path: str = path.join(dir_name, file_path)
        self.__content = self.__content.replace(Keywords.import_key + file_path + "\"", read(import_file_path))

    def __decode_single_line_comment(self, line_item: str):
        line_split: list[str] = line_item.split("\n")
        for i in range(0, len(line_split)):
            if line_split[i].strip() != "" and line_split[i].strip().startswith(Keywords.single_line_comment):
                self.__content = self.__content.replace(line_split[i], "")

a = Cjson(r"C:\Users\632400\Desktop\projects\cjson\tests\test-files\targetRelativeCalls.cjson")
print(a.deserialize())