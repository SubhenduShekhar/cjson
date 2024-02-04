<div align="center">
    <img src="https://github.com/SubhenduShekhar/cjson/blob/main/docs/logo.png?raw=true" width="400" alt="CJSON Logo"/>
    <h2>Coded Javascript Object Notation</h2><br/>
    <h3>
        CJSON is a data file format(inspired from JSON), but supports logical expressions too. Having extended language support to NodeJS, Python, Java and DotNet, users has experienced data reusability. For features and examples, please refer to this documentation as base document.
    </h3>
    <br/>
    <div>
        <img src="https://img.shields.io/badge/java-mvn-blue" alt="Java Tag">&emsp;
        <img src="https://img.shields.io/badge/dotnet-nuget-pink" alt="DotNet Tag">&emsp;
        <img src="https://img.shields.io/badge/NODEJS-npmjs-orange" alt="NPM Tag">&emsp;
        <img src="https://img.shields.io/badge/Python-pypi-purple" alt="Python Tag">
    </div>
    <div>
        <img src="https://github.com/SubhenduShekhar/cjson/actions/workflows/python-tests.yml/badge.svg" alt="Python Status"/>
        <img src="https://github.com/SubhenduShekhar/cjson/actions/workflows/java-tests.yml/badge.svg" alt="Java Status"/>
        <img src="https://github.com/SubhenduShekhar/cjson/actions/workflows/npm-tests.yml/badge.svg" alt="NPM Status"/>
        <img src="https://github.com/SubhenduShekhar/cjson/actions/workflows/dotnet-tests.yml/badge.svg" alt="DotNet Status"/>
    </div>
</div>

<br/><br/><br/>

<center style="color:red">
<p style="font-size:20px">We are restricting NPM and Python packages to 2.0.0<br/>
Further versions will only be provided for dotnet and java</p>
</center>

<br/><br/><br/>

# Content

- [CJSON format Features](#cjson-format-features)
    - [Import CJSON/JSON files](#import-multiple-json-files)
    - [Referencing another key](#referencing-another-key)
    - [Dynamic variable injection](#dynamic-variable-injection)
        - [Single injection](#single-injection)
        - [Bulk injection](#bulk-injection)
    - [Single/ Multiple line comments](#single-multiple-line-comments)
- [CJSON Utility Features](#cjson-utility-features)
    - [Deserializing CJSON/JSON string content](#deserializing-cjsonjson-string-content)
        - [Deserialize as class object](#deserialize-as-class-object)
        - [Deserialize as string](#deserialize-as-string)
    - [Remove](#removing-key)
        - [Single removal](#single-removal)
        - [Bulk removal](#bulk-removal)
    - [Converting `Class object` to `JSON String`](#convert-class-object-to-json-string)
    - [Parse data](#parse-data)
        - [Parse](#parse)
        - [Get all possible keys](#get-all-possible-keys)
        - [Get all possible values](#get-all-possible-values)
    - [Validate JSON](#validate-json)
- [Reference Examples](#examples)

<br/>

# Features (v2.0.0 or higher)

## CJSON format Features

### Import multiple JSON files

One of the strong feature which we have introduced is importing CJson/Json files in another CJson file.
It works in the similar way, how we import libraries in programming languages. All you need to import it using 
`$import "path/to/target/file"` and `deserialize` the file.

### Referencing another key

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

Injection can be performed single or bulk. Lets look at each one below:

#### Single injection

Single injection can be performed by providing key and value to the `inject()`.

`inject(String key, Object value)`

This function returns `deserialized` class object.

#### Bulk injection

Bulk injection can be performed by storing the injection data in `Dictionary` or `HashMap`
where key is the `key` where injection need to be performed and `value` is the value.

`inject(HashMap<String, Object>)`

This function returns `deserialized` class object.

### Single/ Multiple line comments

CJSON also supports **commented lines** by adding `//` at the start of the line.

**Please note, inline comments are not supported. Contributers create an issue [here](https://github.com/users/SubhenduShekhar/projects/7)**

## CJSON Utility Features

### Deserializing CJSON/JSON string content

Parsing of CJSON string content is also possible now. You can create CJSON object with a second parameter(specific to language). For language specific details, refer below.

#### Deserialize as class object

`deserialize` is a function where CJSON content is compiled and converted into equivalent JSON content.
Now, users can consume this content as a deserailized class object like any other parser works.

Refer to [example](#examples) for language specific syntax.

#### Deserialize as string

User can consume converted JSON content to `String` content too. Every language has a function `deserializeAsString()`
which converts compiles and converts CJSON to JSON content and returns JSON content in string format

### Removing key

Any JSON key value pair can be removed by providing its JPath.
Please Note, if you use `remove` before `deserialize` you will receive `UndeserializedCJSON` exception.

This is because, unless the content is deserialized, CJSON engine has not processed the CJSON content.

This function returns deserialized class object post removal.

[Here](https://github.com/SubhenduShekhar/cjson/blob/main/java/Coded-Json/README.md#removing-key) are the examples

#### Single removal

Single removal can be performed by simply providing the JPath as parameters.

#### Bulk removal

Bulk removal accepts `List<String> JPaths` to perform removal.

### Convert `Class Object` to `JSON String`

Any Java object can be converted to json string by using `toString()` function.

It accepts pure java object and returns JSON in string.

[Here](https://github.com/SubhenduShekhar/cjson/blob/main/java/Coded-Json/README.md#removing-key) are the examples

### Parse data

#### Parse

This function finds the value of the provided JPath as parameter. This function returns `Object` type data.
So a type cast will be required to unlock native functions.

#### Get all possible keys

Returns all possible `JPaths` inside JSON.

#### Get all possible values

Returns all values to all possible `JPaths` inside JSON. Before executing this function, you need call for getting all possible keys function.

### Validate JSON

This function validates whether the provided string is JSON content or not.

### Examples

- [NPM](https://github.com/SubhenduShekhar/cjson/blob/main/npm/README.md)
- [Python](https://github.com/SubhenduShekhar/cjson/blob/main/python/README.md)
- [Java](https://github.com/SubhenduShekhar/cjson/blob/main/java/Coded-Json/README.md)
- [DotNet](https://github.com/SubhenduShekhar/cjson/blob/main/dotnet/CJson/README.md)

## Keywords

| Keywords      | Description   |
| ------------- | ------------- |
| `$import`     | To import other json file  |
|   `$.jpath`   |   Refer to a local variable inside JSON   |
| `Comments(Single/ Multi-line)`  | `//`  |
| `<key>`       |  Expects a dynamic variable   |