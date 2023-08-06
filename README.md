<div align="center">
    <img src="https://github.com/SubhenduShekhar/cjson/blob/main/docs/logo.png?raw=true" width="400" alt="CJSON Logo"/>
    <h2>Coded Javascript Object Notation</h2><br/>
    <h3>
        CJSON is a data file format(inspired from JSON), but supports logical expressions too. Having extended language support to NodeJS, Python and Java, users has experienced data reusability. For features and examples, please refer to this documentation as base document.
    </h3>
    <br/>
    <div>
        <img src="https://img.shields.io/badge/java-mvn-blue" alt="Java Tag">&emsp;
        <img src="https://img.shields.io/badge/NODEJS-npmjs-orange" alt="NPM Tag">&emsp;
        <img src="https://img.shields.io/badge/Python-pypi-purple" alt="Python Tag">
    </div>
    <div>
        <img src="https://github.com/SubhenduShekhar/cjson/actions/workflows/python-tests.yml/badge.svg" alt="Test Status"/>
        <img src="https://github.com/SubhenduShekhar/cjson/actions/workflows/java-tests.yml/badge.svg" alt="Test Status"/>
        <img src="https://github.com/SubhenduShekhar/cjson/actions/workflows/npm-tests.yml/badge.svg" alt="Test Status"/>
    </div>
</div>

<br/><br/><br/>

## Content

- [Import multiple JSON files](#import-multiple-json-files)
- [Deserializing CJSON/JSON string content](#deserializing-cjsonjson-string-content)
- [Calling relative keys using JPATH](#calling-relative-keys-using-jpath)
- [Dynamic variable injection](#dynamic-variable-injection)
- [Single/ Multiple line comments](#single-multiple-line-comments)
- [Removing key (JAVA only) ![Beta](https://img.shields.io/badge/Status-Beta-yellow)](#removing-key-java-only-beta)
- [Converting `JAVA object` to `JSON String`]()
- [Reference Examples](#examples)

## Features (v2.0.0 or higher)


### Import multiple JSON files

One of the strong feature which we have introduced is importing CJson/Json files in another CJson file.
It works in the similar way, how we import libraries in programming languages. All you need to import it using 
`$import "path/to/target/file"` and `deserialize` the file.

### Deserializing CJSON/JSON string content

Parsing of CJSON string content is also possible now. You can create CJSON object with a second parameter(specific to language). For language specific details, refer below.

### Calling relative keys using JPATH

Unlike XPATH for XML files, we have JPATH for JSON files. But as the drawback of plain data files, we cannot refer any variable inside a json object to another variable. This feature is useful when you have to duplicate the json key, but the value will be pulled from another variable which is already present in the json file.

You can also refer to a variable which will be loaded after importing the file.  

### Dynamic variable injection

You can inject a variable dynamically also. Instead of replacing a variable value by parsing as `gson` object, put a key in format `<keyToBeReplaced>` like below:

```
{
    "idValue": <id>
}
```
Now create a `HashMap` with key as `<id>` and store relevant value in it.
While invoking `inject` function, pass the HashMap as the second parameter. 

### Single/ Multiple line comments

CJSON also supports **commented lines** by adding `//` at the start of the line.

**Please note, inline comments are not supported. Contributers create an issue [here](https://github.com/users/SubhenduShekhar/projects/7)**

### Removing key (JAVA only) ![Beta](https://img.shields.io/badge/Status-Beta-yellow)

Any JSON key value pair can be removed by providing its JPath.
Please Note, if you use `remove` before `deserialize` you will receive `UndeserializedCJSON` exception.

This is because, unless the content is deserialized, CJSON engine has not processed the CJSON content.

[Here](https://github.com/SubhenduShekhar/cjson/blob/main/java/Coded-Json/README.md#removing-key) are the examples

### Convert `JAVA Object` to `JSON String` (JAVA only) ![Beta](https://img.shields.io/badge/Status-Beta-yellow)

Any Java object can be converted to json string by using `toString()` function.

It accepts pure java object and returns JSON in string.

[Here](https://github.com/SubhenduShekhar/cjson/blob/main/java/Coded-Json/README.md#removing-key) are the examples

### Examples

- [NPM](https://github.com/SubhenduShekhar/cjson/blob/main/npm/README.md)
- [Python](https://github.com/SubhenduShekhar/cjson/blob/main/python/README.md)
- [Java](https://github.com/SubhenduShekhar/cjson/blob/main/java/Coded-Json/README.md)

## Keywords

| Keywords      | Description   |
| ------------- | ------------- |
| `$import`     | To import other json file  |
|   `$.jpath`   |   Refer to a local variable inside JSON   |
| `Comments(Single/ Multi-line)`  | `//`  |
| `<key>`       |  Expects a dynamic variable   |