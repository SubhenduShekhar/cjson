<img src="https://github.com/SubhenduShekhar/cjson/blob/main/docs/logo.png?raw=true" />
<br/>
<br/>
<h3> Coded Javascript Object Notation </h3>
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

# Calling relative keys using JPATH

Unlike XPATH for XML files, we have JPATH for JSON files. But as the drawback of plain data files, we cannot refer any variable inside a json object to another variable. This feature is useful when you have to duplicate the json key, but the value will be pulled from another variable which is already present in the json file.

You can also refer to a variable which will be loaded after importing the file.  

# Dynamic variable injection <b> (JAVA Only) </b>

You can inject a variable dynamically also. Instead

# Single/ Multiple line comments


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
<b>Please note, the current version is only decoding using top to down approach</b>

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
<b>Please note, the current version is only decoding using top to down approach</b>

## Keywords

<table>
    <thead>
        <tr>
            <td width=5%>Keyword</td>
            <td width=35%>Description</td>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td width=40%> $import </td>
            <td width=60%> To import other json file </td>
        </tr>
        <tr>
            <td width=40%> Comments(Single/ Multi-line) </td>
            <td width=60%> // </td>
        </tr>
        <tr>
            <td width=40%> $.jpath </td>
            <td width=60%> Refer to a local variable inside JSON </td>
        </tr>
    </tbody>
</table>