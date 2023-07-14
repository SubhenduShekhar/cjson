<!-- <img src="https://github.com/SubhenduShekhar/cjson/blob/main/docs/logo.png?raw=true" /> -->

![img](https://github.com/SubhenduShekhar/cjson/blob/main/docs/logo.png?raw=true)

<!-- <br/>
<br/> -->
# Coded Javascript Object Notation
<br/>
<h4> CJSON is a data file format(inspired from JSON), but supports logical expressions too.
Having extended language support to NodeJS, Python and Java, users has experienced data reusability.
For features and examples, please refer to this documentation as base document. </h4>
<br/>
<br/>
<img src="https://github.com/SubhenduShekhar/cjson/actions/workflows/tests.yml/badge.svg"/>

<br/>

## Features

### Import multiple JSON files

One of the strong feature which we have introduced is importing CJson/Json files in another CJson file.
It works in the similar way, how we import libraries in programming languages. All you need to import it using 
`$import "path/to/target/file"` and `deserialize` the file.

### Calling relative keys using JPATH

Unlike XPATH for XML files, we have JPATH for JSON files. But as the drawback of plain data files, we cannot refer any variable inside a json object to another variable. This feature is useful when you have to duplicate the json key, but the value will be pulled from another variable which is already present in the json file.

You can also refer to a variable which will be loaded after importing the file.  

### Dynamic variable injection <b> (JAVA Only) </b>

***This feature is only available in JAVA and for pure values***

You can inject a variable dynamically also. Instead of replacing a variable value by parsing as `gson` object, put a key in format `<keyToBeReplaced>` like below:

```
{
    "idValue": <id>
}
```
Now create a `HashMap` with key as `<id>` and store relevant value in it.
While invoking `inject` function, pass the HashMap as the second parameter. 

# Single/ Multiple line comments

CJSON also supports **commented lines** by adding `//` at the start of the line.

***Please ***

## NodeJS

### Your first CJSON code

- Create file with `.cjson` extension
- Write below code to decode the json:

```
    import { Cjson } from 'coded-json'; 
    var cjson = new Cjson(file/path/to/file.cjson);
    var b = cjson.deserialize();
```

#### Output: 

```
{
    "source": {
        // Source JSON content
    },
    "target": {
        "fruit": "Apple",
        "size": "Large",
        "color": "Red"
    }
}
```

### Features



#### Import multiple JSON files

You can use `$import` keyword for importing other JSON files.
<br/>
You can also import multiple JSON files.

```
{
    "source": $import "./source.json",
    "target": {
        "fruit": "Apple",
        "size": "Large",
        "color": "Red"
    }
}
```

#### Single/ Multiple line comments

For single line comments, use `//`

For multi line comments, use like below:
```
// This is first line comment
// This is the second one

```

#### Calling relative keys using JPATH

You can also refer to other variables using `$.` followed by jpath.
<br/>

**Please note, the current version is only decoding using top to down approach**

<br>

## Python

<br>

### Your first CJSON code

- Create file with `.cjson` extension
- Write below code to decode the json:

```
    from cjson import Cjson
    cjson = Cjson(file/path/to/file.cjson);
    var b = cjson.deserialize();
```

#### Output: 

```
{
    "source": {
        // Source JSON content
    },
    "target": {
        "fruit": "Apple",
        "size": "Large",
        "color": "Red"
    }
}
```

### Features

- [Import multiple JSON files](#Import-multiple-JSON-files)
- [Single/ Multiple line comments](#Single-Multiple-line-comments)
- [Calling relative keys using JPATH](#Calling-relative-keys-using-JPATH)

#### Import multiple JSON files

You can use `$import` keyword for importing other JSON files.
<br/>
You can also import multiple JSON files.

```
{
    "source": $import "./source.json",
    "target": {
        "fruit": "Apple",
        "size": "Large",
        "color": "Red"
    }
}
```

#### Single/ Multiple line comments

For single line comments, use `//`

For multi line comments, use like below:
```
// This is first line comment
// This is the second one

```

#### Calling relative keys using JPATH

You can also refer to other variables using `$.` followed by jpath.
<br/>

**Please note, the current version is only decoding using top to down approach**

## Keywords

| Keywords      | Description   |
| ------------- | ------------- |
| `$import`     | To import other json file  |
| `Comments(Single/ Multi-line)`  | `//`  |
|   `$.jpath`   |   Refer to a local variable inside JSON   |