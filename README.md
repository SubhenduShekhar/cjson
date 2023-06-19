<center>
    <img src="https://github.com/SubhenduShekhar/cjson/blob/main/docs/logo.png?raw=true" />
    <br/>
    <br/>
    <h3> Coded Javascript Object Notation </h3>
    <br/>
    <h4> Why static JSON if you can utilize CJSON </h4>
    <br/>
    <br/>
    <img src="https://github.com/SubhenduShekhar/cjson/actions/workflows/tests.yml/badge.svg"/>
</center>

<br/>

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