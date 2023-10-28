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
call npm run document

cd ..

ECHO =================================== Completed =================================

ECHO ================================ Documenting  JAVA ============================
@REM Generate JavaDoc
call mvn -f java\Coded-Json\pom.xml javadoc:javadoc

ECHO =================================== Completed =================================

ECHO ============================== Documenting Python ============================
@REM Generate PythonDoc for python repository
cd python/cjson/src
echo Y | rmdir codedjson.egg-info /s
cd utils
echo Y | rmdir __pycache__ /s
cd ../../../..

call pycco python/cjson/src -d docs/python

ECHO =================================== Completed =================================

cd docs
dir

cd ..

ECHO ================================ Task completed ================================