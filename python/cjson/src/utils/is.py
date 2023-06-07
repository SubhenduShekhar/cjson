from keywords import Keywords

class Is:
    def _is_import(self, line_item: str):
        return Keywords.import_key in line_item
    
    def is_single_line_comments(self, line_item: str):
        return Keywords.single_line_comment in line_item
    
    def is_relative_jpath(self, line_item: str):
        split_by_colon: list[str] = line_item.split(":")
        relative_jpath_keys: list[str] = []
        for i in range(0, len(split_by_colon)):
            if split_by_colon[i].strip().startswith(Keywords.relative_jpath):
                relative_jpath_keys.append(split_by_colon[i].strip())
        if len(relative_jpath_keys) == 0:
            return {
                "Result": False,
                "Keys": relative_jpath_keys
            }
        else:
            return {
                "Result": True,
                "Keys": relative_jpath_keys
            }