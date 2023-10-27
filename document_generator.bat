ECHO OFF

@REM Cleaning all old files
cd docs
echo Y | rmdir npm /s
echo Y | rmdir python /s
echo Y | rmdir java /s
cd ..

@REM @REM Generate JSDoc
@REM cd npm
@REM npm run document

@REM @REM Generate JavaDoc
mvn -f java\Coded-Json\pom.xml javadoc:javadoc

@REM @REM Generate PythonDoc for python repository
@REM pycco python/cjson/src -d docs/python

cd ../docs
dir

cd 
cd ..