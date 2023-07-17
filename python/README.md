<div align="center">
    <img src="https://github.com/SubhenduShekhar/cjson/blob/main/docs/logo.png?raw=true" width="200" alt="CJSON Logo"/>
    <h2>Coded Javascript Object Notation</h2><br/>
    <h2>For Python</h2><br/>
    <h3>
        CJSON is a data file format(inspired from JSON), but supports logical expressions too. Having extended language support to NodeJS, Python and Java, users has experienced data reusability. For features and examples, please refer to this documentation as base document.
    </h3>
    <br/>
    <div>
        <img src="https://img.shields.io/badge/Python-pypi-purple" alt="Python Tag">
    </div>
    <div>
        <img src="https://github.com/SubhenduShekhar/cjson/actions/workflows/python-tests.yml/badge.svg" alt="Test Status"/>
    </div>
</div>

<br/><br/>

<br/>

## Installation

`pip install codedjson`

## Examples

### Importing a JSON file in CJSON file

#### file.cjson

```
{
    "source": $import "path/to/source.json",
    "target": {
        "fruit": "Apple",
        "size": "Large",
        "color": "Red"
    }
}
```

#### Code

```
    from cjson import Cjson
    cjson = Cjson(file/path/to/file.cjson);
    var b = cjson.deserialize();
```

#### Output

```
{
    "source": {
        // source.json content
    },
    "target": {
        "fruit": "Apple",
        "size": "Large",
        "color": "Red"
    }
}
```

### Calling relative keys using JPATH

Below example shows `color` variable is calling data from `fruit` variable

#### file.cjson
```
{
    "target": {
        "fruit": "Orange",
        "size": "Medium",
        "color": $.target.fruit
    }
}
```

#### Code

```
    from cjson import Cjson
    cjson = Cjson(file/path/to/file.cjson);
    var b = cjson.deserialize();
```

#### Output

```
{
    "target": {
        "fruit": "Orange",
        "size": "Medium",
        "color": "Orange"
    }
}
```

### Single/ Multiple line comments


For single line comments, use `//`

For multi line comments, use like below:
```
// This is first line comment
// This is the second one

{
    "name": "Amrut" // This is not allowed
}
```