ECHO OFF

@REM Cleaning all old files

ECHO ============================== Cleaning old docs ==============================
cd docs
echo Y | rmdir npm /s
echo Y | rmdir python /s
echo Y | rmdir java /s
cd ..

ECHO ============================== Cleaning completed =============================

ECHO =============================== Documenting NPM ===============================
@REM Generate JSDoc
cd npm
call npm i
call npm run document

cd ..

ECHO =================================== Completed =================================

ECHO ================================ Documenting JAVA =============================
@REM Generate JavaDoc
call mvn -B package --file ./java/Coded-Json/pom.xml
call mvn -f java/Coded-Json/pom.xml javadoc:javadoc

ECHO =================================== Completed =================================

ECHO ============================== Documenting Python ============================
@REM Generate PythonDoc for python repository
call pip install pycco

cd python/cjson
@REM echo Y | rmdir codedjson.egg-info /s
@REM cd utils
@REM echo Y | rmdir __pycache__ /s
call make html
move _build/html ../../docs
cd ../../docs
rename html python

call pycco python/cjson/src -d docs/python

ECHO =================================== Completed =================================

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