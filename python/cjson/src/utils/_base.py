from typing import Union

class Base:
    _obj: Union[any , str]
    _content: str

    def _regex_refinery(self, content: str):
        if content is None:
            return content
        content = content.replace(".", "\\.")
        content = content.replace("\'", "\\\"")
        content = content.replace("[", "\\[")
        content = content.replace("?", "\\?")
        content = content.replace("*", "\\*")
        content = content.replace("+", "\\+")
        content = content.replace("{", "\\{")
        content = content.replace("$", "\\$")
        content = content.replace("^", "\\^")

        return content