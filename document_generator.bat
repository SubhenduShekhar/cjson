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
call pip install sphinx sphinx_rtd_theme

cd python/cjson
call make html
move _build/html ../../docs
cd ../../docs
rename html python
cd ../

ECHO =================================== Completed =================================

ECHO ================================== Documenting DotNet ==============================

cd dotnet/CJson
call dotnet build
call dotnet tool update -g docfx
call docfx docfx.json

move _site ../../docs
cd ../../docs
rename _site dotnet

ECHO =================================== Completed =================================

cd docs
dir

cd ..

ECHO ================================ Task completed ================================