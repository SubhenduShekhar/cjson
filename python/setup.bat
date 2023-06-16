@ECHO OFF

set runCommand=%1

IF %runCommand% == build (
    python setup.py sdist
) ELSE IF %runCommand% == publish (
    py -m twine upload --repository-url https://upload.pypi.org/legacy/  dist/*
) ELSE ( ECHO Unknown command %runCommand%)