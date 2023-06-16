from utils.file import read
from utils._is import Is
from utils.keywords import Keywords
from utils._json import Json, is_content_json as content_json_check
from os import path
import json, re

def is_content_json(content: str, is_file_path: bool = False):
        ''' Checks if the parsed content is JSON
        '''
        return content_json_check(content, is_file_path=is_file_path)

class Cjson(Is):
    __obj:any
    __file_path: str
    __content: str = ""
    json: Json | None = None

    def __init__(self, file_path: str):
        ''' Initializes and decodes `CJSON` files.

            This can also be used for parsing JSON files in `CJSON` way.
            Parsing in CJSON way unlocks many functions. For more details, see function documentation.
        '''
        super().__init__()
        self.__obj = None
        self.__file_path = file_path
        self.__content = read(self.__file_path)
        self.__decode_keywords()
        '''Call this object to unlock native JSON functions
        '''
        self.json = Json(self.__obj)
        self.__decode_relative_paths(self.__content)
    
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
        if content != None:
            self.__content = content
        
        self.json = Json(self.__content, False)
        self.__obj = json.loads(self.__content)

    def __decode_relative_paths(self, content: str):
        path_keys: list[str] = re.findall(Keywords.relative_jpath_regex, content)
        unique_keys: list[str] = []

        for each_key in path_keys:
            if each_key not in unique_keys:
                unique_keys.append(each_key)

        for each_key in unique_keys:
            content = content.replace(each_key, "\"<" + each_key + ">\"")

        self.__refine_obj(content=content)
    
        for each_key in unique_keys:
            key_regex: str = "<" + each_key + ">"
            
            parsed_val: str = self.json.parse(each_key.split(Keywords.relative_jpath)[1])

            while(str(parsed_val).startswith("<" + Keywords.relative_jpath)):
                self.__refine_obj(content=content)
                parsed_val: str = self.json.parse(each_key.split(Keywords.relative_jpath)[1])
            
            if type(parsed_val) != str:
                content = content.replace("\"" + key_regex + "\"", str(parsed_val))
            else:
                content = content.replace(key_regex, parsed_val)

        self.__refine_obj(content=content)
    
    def deserialize(self):
        ''' Returns the JSON compiled object for the given `CJSON` file. '''
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
