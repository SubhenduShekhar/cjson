from utils.file import read, is_path_absolute
from utils._is import Is
from utils.keywords import Keywords
from utils._json import Json, is_content_json as content_json_check
from os import path
import json, re
from utils._exceptions import AbsolutePathConstraintError, FilePathAndCJSONCotentConflict, UnexpectedCJSONContent

def is_content_json(content: str, is_file_path: bool = False):
        ''' Checks if the parsed content is JSON
        '''
        return content_json_check(content, is_file_path=is_file_path)

class Cjson(Is):
    __file_path: str
    __is_content_cjson: bool = False
    json: Json | None = None

    def __init__(self, content: str, is_content_cjson: bool = False):
        ''' Initializes and decodes `CJSON` files.

            This can also be used for parsing JSON files in `CJSON` way.

            `content` can be file path and cjson/json type string.

            Parsing in CJSON way unlocks many functions. For more details, see function documentation.

            Set `is_content_cjson` as `True` if `content` is raw CJSON content instead of file path
        '''
        super().__init__()
        self._obj = None

        if(is_path_absolute(content) and is_content_cjson):
            raise FilePathAndCJSONCotentConflict()
        elif is_content_cjson == True:
            self.__is_content_cjson = is_content_cjson
            self._content = content
            self.__file_path = None
        else:
            self.__file_path = content
            self._content = read(self.__file_path)
    
    def __decode_keywords(self):
        is_changed: bool = False
        while(True):
            is_changed = False

            if self._is_import(self._content):
                self._content = self.__decode_import(self._content)
                is_changed = True
            
            if self.is_single_line_comments(self._content):
                self.__decode_single_line_comment(self._content)
                is_changed = True
            
            if not is_changed:
                break
    
    def __refine_obj(self, content: str = None):
        if content != None:
            self._content = content
        
        self.json = Json(self._content, False)
        self._obj = json.loads(self._content)

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
        ''' Deserializes CJSON context and returns dictionary object in JSON context.

            Please Note, if any key is detected for runtime variable injections is
            replaced with `<-tag->`. No error/warning is thrown.

            To inject runtime variables, use `inject` function
        '''
        self.__decode_keywords()

        runtime_keys: list[str] = re.findall(Keywords.runtime_vals_regex, self._content)
        '''Call this object to unlock native JSON functions
        '''
        self._content = self.__refine_runtime_vals(self._content, runtime_keys=runtime_keys)
        self.json = Json(self._obj)
        
        self.__decode_relative_paths(self._content)

        ''' Returns the JSON compiled object for the given `CJSON` file. '''
        return self._obj
    
    def deserializeAsString(self):
        ''' Deserializes `CJSON` content and returns content as string.

            Content will be of pure JSON content and can be parsed as `JSON`
        '''
        if self._obj == None:
            self.deserialize()

        return self._content

    def __get_file_path(self, line_item: str):
        return line_item.split(Keywords.import_key)[1].split("\"")[0]

    def __decode_import(self, content: str, cur_path: str = None):
        global import_file_path
        file_path: str = self.__get_file_path(line_item=content)
        file_name: str = file_path.split("/")[len(file_path.split("/")) - 1]

        if(is_path_absolute(file_path=file_path)):
            import_file_path = file_path

        elif(not is_path_absolute(file_path=file_path) and self.__is_content_cjson):
            raise AbsolutePathConstraintError("Only absolute path is supported in import statements")
        else:
            dir_name: str = path.join(path.dirname(self.__file_path), path.dirname(file_path))

            if(cur_path != None):
                dir_name = path.join(cur_path, path.dirname(file_path))

            import_file_path = path.join(dir_name, file_name)
        
        content = content.replace(Keywords.import_key + file_path + "\"", read(import_file_path))

        if(self._is_import(content)):
            return self.__decode_import(content=content, cur_path=path.dirname(import_file_path))
        else:
            return content

    def __decode_single_line_comment(self, line_item: str):
        line_split: list[str] = line_item.split("\n")
        for i in range(0, len(line_split)):
            if line_split[i].strip() != "" and line_split[i].strip().startswith(Keywords.single_line_comment):
                self._content = self._content.replace(line_split[i], "")
    
    def __refine_runtime_vals(self, content: str, runtime_keys: list[str]):
        unique_keys: list[str] = []

        for each_runtime_keys in runtime_keys:
            if(each_runtime_keys not in unique_keys):
                unique_keys.append(each_runtime_keys)
        
        for each_runtime_keys in unique_keys:
            content = content.replace(each_runtime_keys, "\"<-" + each_runtime_keys.split("<")[1].split(">")[0] + "->\"")
        
        return content

    def __inject_with_content(self, content: str, key: str, value: any):
        if type(value) != str:
            content = content.replace("\"<-" + key + "->\"", json.dumps(value))
        else:
            content = content.replace("<-" + key + "->", str(value))
        return content

    def inject_with_key_value(self, key: str, value: str):
        content = self._content
        self.__decode_keywords()

        runtime_keys: list[str] = re.findall(Keywords.runtime_vals_regex, self._content)
        self._content = self.__refine_runtime_vals(content=self._content, runtime_keys=runtime_keys)

        '''Call this object to unlock native JSON functions
        '''
        self.json = Json(self._obj)
        self.__decode_relative_paths(self._content)

        content = self.__inject_with_content(content=content, key=key, value=value)

        return content

    def inject(self, injecting_obj: dict):
        self.__decode_keywords()

        runtime_keys: list[str] = re.findall(Keywords.runtime_vals_regex, self._content)
        
        self._content = self.__refine_runtime_vals(content=self._content, runtime_keys=runtime_keys)
        '''Call this object to unlock native JSON functions
        '''
        self.json = Json(self._obj)
        self.__decode_relative_paths(self._content)
        
        for each_key in injecting_obj.keys():
            self._content = self.__inject_with_content(self._content, key=each_key, value=injecting_obj[each_key])
        
        self.__refine_obj(self._content)

        return self._obj

    def __get_as_string(obj: any) -> str:
        if(obj == None):
            return "null"
        elif((type(obj) is int) or (type(obj) is float) or (type(obj) is bool)):
            return str(obj)
        elif(type(obj) is str):
            return "\"" + str(obj) + "\""
        elif(type(obj) is list):
            li: list = obj
            values: str = "["
            for objs in li:
                if(type(objs) is str):
                    values += "\"" + objs + "\","
                else:
                    values += Cjson.__get_as_string(obj=objs) + ","
            values = values[-1]
            return values + "]"
        elif(type(obj) is dict):
            values = "{"
            hashObj: dict = obj
            for key in hashObj.keys():
                if hashObj[key] != None:
                    if type(hashObj[key]) is str:
                        values += "\"" + key + "\":\"" + hashObj[key] + "\","
                    else:
                        values += "\"" + key + "\":" + Cjson.__get_as_string(hashObj[key]) + ","
                else:
                    return None
            return values[-1] + "}"
        else:
            values: str = "{"
            for key in obj.keys():
                if type(obj[key]) is str:
                    values += "\"" + key + "\":\"" + obj[key] + "\""
                else:
                    values += "\"" + key + "\":" + Cjson.__get_as_string(obj[key])
            values += "}"
            return values

    def to_string(obj: any) -> str:
        if(type(obj) is dict and type(obj) is list):
            raise UnexpectedCJSONContent()
        if obj == "":
            return "{}"
        return Cjson.__get_as_string(obj=obj)

    def remove(self, key: str):
        self.deserialize()
        self.json = self.json._remove_with_key(key, self._content)

        self._obj = self.json._obj
        self._content = self.json._content
        return self

    def replace(self, jpath: str, value: str):
        self.deserialize()
        if jpath.startswith("$."):
            jpath = jpath.replace("$.", "", 1)

        self._obj = self.json.replace(jpath=jpath, value=value, obj=self._obj)
        self._content = self.json._content
        return self
    
    def get_obj(self):
        return self._obj
    
    def get_string(self):
        return self._content
