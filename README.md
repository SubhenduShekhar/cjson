<center>
    <h1 style="color: rebeccapurple;"> { CJSON } </h1>
    <h4> Coded Javascript Object Notation </h4>
</center>

Why static JSON if you can utilize CJSON

<br>

![NPM Package](https://github.com/SubhenduShekhar/cjson/actions/workflows/npm-publish.yml/badge.svg)


<br/>

# Syntax

## NodeJS

### Steps

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

## Features

- [Import multiple JSON files](#Import-multiple-JSON-files)
- [Single/ Multiple line comments](#Single-Multiple-line-comments)
- [Calling relative keys using JPATH](#Calling-relative-keys-using-JPATH)

## Import multiple JSON files

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

## Single/ Multiple line comments

For single line comments, use `//`

For multi line comments, use like below:
```
// This is first line comment
// This is the second one

```

## Calling relative keys using JPATH

You can also refer to other variables using `$.` followed by jpath.
<br/>
<b>Please note, the current version is only decoding using top to down approach</b>