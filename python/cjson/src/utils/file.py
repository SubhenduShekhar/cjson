import os

def read(filePath: str):
    if os.path.isabs(filePath):
        f = open(file=filePath)
        return f.read()
    else:
        raise FileNotFoundError("Please specify absolute path")