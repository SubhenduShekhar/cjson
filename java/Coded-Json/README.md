<div align="center">
    <img src="https://github.com/SubhenduShekhar/cjson/blob/main/docs/logo.png?raw=true" width="200" alt="CJSON Logo"/>
    <h2>Coded Javascript Object Notation</h2><br/>
    <h2>For NodeJS</h2><br/>
    <h3>
        CJSON is a data file format(inspired from JSON), but supports logical expressions too. Having extended language support to NodeJS, Python and Java, users has experienced data reusability. For features and examples, please refer to this documentation as base document.
    </h3>
    <br/>
    <div>
        <img src="https://img.shields.io/badge/java-blue" alt="Java Tag">
    </div>
    <div>
        <img src="https://github.com/SubhenduShekhar/cjson/actions/workflows/tests.yml/badge.svg" alt="Test Status"/>
    </div>
</div>

<br/>

## Dependency

```
<!-- https://mvnrepository.com/artifact/io.github.subhendushekhar.cjson/cjson -->
<dependency>
    <groupId>io.github.subhendushekhar.cjson</groupId>
    <artifactId>cjson</artifactId>
    <version>x.x.x</version>
</dependency>

```


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
    import com.codedjson.CJson;

    public class Main {
        public static void main(String[] args) throws Exception {
            
            CJson<SerializableClass> cJson = new CJson<>("file/path/to/file.cjson");
            SerializableClass target = cJson.deserialize(SerializableClass.class);
        }
    }
```

#### Output: 

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
    import com.codedjson.CJson;

    public class Main {
        public static void main(String[] args) throws Exception {
            
            CJson<SerializableClass> cJson = new CJson<>("file/path/to/file.cjson");
            SerializableClass target = cJson.deserialize(SerializableClass.class);
        }
    }
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

### Variable Injection

#### file.cjson

```
{
    "target": {
        "fruit": "Orange",
        "size": "Medium",
        "color": "Orangle",
        "sellerId": <id>
    }
}
```

#### Code

```
    import com.codedjson.CJson;
    import java.util.HashMap;

    public class Main {
        public static void main(String[] args) throws Exception {
            
            HashMap<String, String> data = new HashMap<String, String>();
            data.put("id", "ID01");

            CJson<SerializableClass> cJson = new CJson<>("file/path/to/file.cjson");
            SerializableClass target = cJson.inject(SerializableClass.class, data);

        }
    }
```

#### `target` value

```
{
    "target": {
        "fruit": "Orange",
        "size": "Medium",
        "color": "Orangle",
        "sellerId": "ID01"
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