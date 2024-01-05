class Keywords:
    import_key: str = "$import \""
    single_line_comment: str = "//"
    multiLine_comment_start: str = "/*"
    multiLine_comment_end: str = "*/"
    relative_jpath: str = "$."
    relative_jpath_regex: str = "[$][.][.A-Za-z0-9]*"
    runtime_vals_regex: str = "[<][A-Za-z0-9]*[>]"

    def remove_with_suc_coma(key: str, value: str) -> str:
        return "\n*\s*\\t*\r*\"" + key.split(".")[-1] + "\":\\s*\"*" + value + "\"*,*\\s*\\t*\\r*"

    def remove_with_pre_coma(key: str, value: str) -> str:
        return ",*\n*\s*\\t*\r*\"" + key.split(".")[-1] + "\":\\s*\"*" + value + "\"*"