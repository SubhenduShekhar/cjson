class AbsolutePathConstraintError(Exception):
    def __init__(self, message: str = "Path must be absolute"):
        super().__init__(message)

class FilePathAndCJSONCotentConflict(Exception):
    def __init__(self, message: str = "CJSON flag is true, but got file path"):
        super().__init__(message)