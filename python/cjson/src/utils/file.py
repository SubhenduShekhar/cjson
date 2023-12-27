import os

def read(filePath: str):
    if os.path.isabs(filePath):
        f = open(file=filePath)
        content: str = f.read()
        f.close()
        return content
    else:
        raise FileNotFoundError("Please specify absolute path")

def is_path_absolute(file_path: str):
    if file_path.startswith("\\"):
        file_path = file_path[1:]
    
    return os.path.isabs(file_path)