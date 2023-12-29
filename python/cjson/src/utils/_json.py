from utils import file
from utils.keywords import Keywords
import json
from typing import Union
from types import NoneType
from utils._base import Base
import re

def is_content_json(content: str, is_file_path: bool = False):
    if is_file_path:
        content = file.read(content)
    
    try:
        json.loads(content)
        return True

    except:
        return False

class Json(Base):
    __json_keys: list[str] = []
    __json_values: list[str] = []
    __file_path: Union[str , None]
    __data_types: list[type] = [ str, int, bool ]

    def __init__(self, obj: Union[any , str], is_file_path: bool = False):
        if type(obj) is str and is_file_path:
            self.__file_path = obj
            file = open(self.__file_path)
            self._obj = json.load(file)
        elif type(obj) == str and not is_file_path:
            self._obj = json.loads(obj)
        else:
            self._obj = obj
            self.__file_path = None
    
    def parse(self, key: Union[ str, None ] = None ):
        ''' Run any `JPath` query in parsed `CJSON`/ `JSON`.

            Returns full `JSON` if `key` is not provided
        '''
        if key is not None and key.startswith("$."):
            key = key.replace("$.", "", 1)

        if key is None:
            return self._obj
        else:
            return self.__get_value_from_key(key)

    def get_all_keys(self):
        ''' Returns all possible `JSON` keys in parsed `JSON`
        '''
        self.__json_keys = []
        self.__get_keys(json_data=self._obj)
        return self.__json_keys

    def get_all_values(self):
        ''' Returns all possible `JSON` values in parsed `JSON`
        '''
        self.__json_values = []
        if len(self.__json_keys) == 0:
            self.get_all_keys()
        
        for i in range(0, len(self.__json_keys)):
            value: str = self.__get_value_from_key(self.__json_keys[i])
            self.__json_values.append(value)
        
        return self.__json_values

    def __push_key(self, cur_key: str, prev_key: str):
        if(prev_key == ""):
            self.__json_keys.append(cur_key)
        else:
            self.__json_keys.append(prev_key + "." + cur_key)

    def __get_keys(self, json_data: any, prev_key: str = ""):
        if(type(json_data) == dict):
            for each_key in json_data.keys():
                if(type(json_data[each_key]) in self.__data_types):
                    self.__push_key(each_key, prev_key)

                elif(type(json_data[each_key]) == dict):
                    if(prev_key != ""):
                        self.__get_keys(json_data[each_key], prev_key + "." + each_key)
                    else:
                        self.__get_keys(json_data[each_key], each_key)

                elif(type(json_data[each_key]) == list):
                    all_raw: bool = True

                    for each_in_elif in json_data[each_key]:
                        index = str(json_data[each_key].index(each_in_elif))

                        if(type(each_in_elif) in self.__data_types):
                            continue
                        else:
                            all_raw = False
                            
                            if(prev_key != ""):
                                self.__get_keys(each_in_elif, prev_key=prev_key + "." + each_key + "[" + index + "]")
                            else:
                                self.__get_keys(each_in_elif, prev_key=each_key + "[" + index + "]")
                    if(all_raw and len(json_data[each_key]) != 0):
                        self.__push_key(each_key, prev_key)

                elif(type(json_data[each_key]) == NoneType):
                    self.__push_key(each_key, prev_key)

        elif(type(json_data) == list):
            for each_in_elif in json_data:
                self.__get_keys(each_in_elif)
    
    def __get_value_from_key(self, key: str):
        ''' Returns all possible json keys in `CJSON` object
        '''
        value = self._obj
        if "." in key:
            key_list: list[str] = key.split(".")
            for i in range(0, len(key_list)):
                if "[" in key_list[i] and "]" in key_list[i]:
                    key_name: str = key_list[i].split("[")[0]
                    index: int = int(key_list[i].split("[")[1].split("]")[0])
                    value = value[key_name][index]
                else:
                    value = value[key_list[i]]
        else:
            value = value[key]
        return value

    def __remove_with_pre_comma(self, key: str, value: any, content: str):
        items: list[str] = re.findall(Keywords.remove_with_pre_coma(key=key, value=self._regex_refinery(str(value))), content)
        
        if len(items) != 0:
            items = list(set(items))
            for each_item in items:
                content = content.replace(each_item, "")
        return content
    
    def __remove_with_suc_comma(self, key: str, value: any, content: str):
        items: list[str] = re.findall(Keywords.remove_with_suc_coma(key=key, value=self._regex_refinery(str(value))), content)
        
        if len(items) != 0:
            items = list(set(items))
            for each_item in items:
                content = content.replace(each_item, "")
        return content
    
    def __remove_recursively(self, key: str, obj: any) -> str:
        if len(key.split(".")) == 1:
            string_obj: str = json.dumps(obj)
            # None value to be replaced with null
            if obj[key] is None:
                con = self.__remove_with_suc_comma(key, "null", string_obj)

                if not is_content_json(content=con):
                    con = self.__remove_with_pre_comma(key, "null", string_obj)
                    con = self.__remove_with_suc_comma(key, "null", con)

            else:
                con = self.__remove_with_suc_comma(key, obj[key], string_obj)

                if not is_content_json(content=con):
                    con = self.__remove_with_pre_comma(key, obj[key], string_obj)
                    con = self.__remove_with_suc_comma(key, obj[key], con)
            
            return con
        else:
            cur_key: str = key.split(".")[0]
            a: str = self.__remove_recursively(key.replace(cur_key + ".", ""), obj[cur_key])

            if a is not None:
                obj[cur_key] = json.loads(a)
            else:
                obj[cur_key] = a
            return json.dumps(obj=obj)
    
    def __replace_recursively(self, key: str, value: any, obj: any):
        if len(key.split(".")) == 1:
            obj[key] = value
        else:
            cur_key: str = key.split(".")[0]
            obj[cur_key] = self.__replace_recursively(key.replace(cur_key + ".", "", 1), value=value, obj=obj[cur_key])
            
        return obj
    
    def _remove_with_key(self, key: str, content: str):
        if(key.startswith(Keywords.relative_jpath)):
            key = key.replace(Keywords.relative_jpath, "")
        
        value = self.parse(key=key)

        if type(value) is not list or type(value) is not dict:
            self._obj = json.loads(self.__remove_recursively(key=key, obj=json.loads(content)))
        else:
            nulled_obj: any = self.__replace_recursively(key=key, value=None, obj=json.loads(content))
            # Updating JSON object
            self._obj = json.loads(self.__remove_recursively(key=key, obj=nulled_obj))
        # Updating JSON string variable
        self._content = json.dumps(self._obj)
            
        return self
    
    def replace(self, jpath: str, value: str, obj: any):
        self._obj = self.__replace_recursively(key=jpath, value=value, obj=obj)
        # Updating JSON string variable
        self._content = json.dumps(self._obj)
        return self._obj