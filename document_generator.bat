ECHO OFF

@REM Cleaning all old files

@REM ECHO ============================== Cleaning old docs ==============================
@REM cd docs
@REM echo Y | rmdir npm /s
@REM echo Y | rmdir python /s
@REM echo Y | rmdir java /s
@REM cd ..

@REM ECHO ============================== Cleaning completed =============================

@REM ECHO =============================== Documenting NPM ===============================
@REM @REM Generate JSDoc
@REM cd npm
@REM call npm i
@REM call npm run document

@REM cd ..

@REM ECHO =================================== Completed =================================

@REM ECHO ================================ Documenting  JAVA ============================
@REM @REM Generate JavaDoc
@REM call mvn -B package --file ./java/Coded-Json/pom.xml
@REM call mvn -f java/Coded-Json/pom.xml javadoc:javadoc

@REM ECHO =================================== Completed =================================

@REM ECHO ============================== Documenting Python ============================
@REM @REM Generate PythonDoc for python repository
@REM call pip install pycco

@REM cd python/cjson/src
@REM echo Y | rmdir codedjson.egg-info /s
@REM cd utils
@REM echo Y | rmdir __pycache__ /s
@REM cd ../../../..

@REM call pycco python/cjson/src -d docs/python

@REM ECHO =================================== Completed =================================

ECHO ================================== Documenting DotNet ==============================

cd dotnet/CJson
call dotnet build
call dotnet tool update -g docfx
call docfx CJson/docfx.json

cd ../../docs
mkdir dotnet
cd ../dotnet/CJson
copy "./CJson/_site" "../../docs/dotnet" 

ECHO =================================== Completed =================================

cd docs
dir

cd ..

ECHO ================================ Task completed ================================