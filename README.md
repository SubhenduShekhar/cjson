<center>
    <h1 style="color: rebeccapurple;"> { CJSON } </h1>
    <h4> Coded Javascript Object Notation </h4>
</center>

![NPM Package](https://github.com/SubhenduShekhar/cjson/actions/workflows/npm-publish.yml/badge.svg)

Why static JSON if you can utilize CJSON

<br>

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

For multi line comments, use `/*` to start, `*/` to end