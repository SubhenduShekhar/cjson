class AbsolutePathConstraintError(Exception):
    def __init__(self, message: str = "Path must be absolute"):
        super().__init__(message)

class FilePathAndCJSONCotentConflict(Exception):
    def __init__(self, message: str = "CJSON flag is true, but got file path"):
        super().__init__(message)

class UnexpectedCJSONContent(Exception):
    def __init__(self, message: str = "CJSON content is not excepted here. Try JSON content"):
        super().__init__(message)