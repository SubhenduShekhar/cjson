<center>
    <h1 style="color: rebeccapurple;"> { CJSON } </h1>
    <h4> Coded Javascript Object Notation </h4>
</center>

Why static JSON if you can utilize CJSON

<br>

![NPM Package](https://github.com/SubhenduShekhar/cjson/actions/workflows/npm-publish.yml/badge.svg)


<br/>

# NODEJS

## Steps

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

## Import multiple JSON files

You can use `$import` keyword for importing

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