<div align="center">
    <img src="https://github.com/SubhenduShekhar/cjson/blob/main/docs/logo.png?raw=true" width="200" alt="CJSON Logo"/>
    <h2>Coded Javascript Object Notation</h2><br/>
    <h2>For JAVA</h2><br/>
    <h3>
        CJSON is a data file format(inspired from JSON), but supports logical expressions too. Having extended language support to NodeJS, Python and Java, users has experienced data reusability. For features and examples, please refer to this documentation as base document.
    </h3>
    <br/>
    <div>
        <img src="https://img.shields.io/badge/java-blue" alt="Java Tag">
    </div>
    <div>
        <img src="https://github.com/SubhenduShekhar/cjson/actions/workflows/java-tests.yml/badge.svg" alt="Test Status"/>
    </div>
</div>

<br/>

## Dependency

```xml
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

```json
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

```java
    import com.codedjson.CJson;
    import java.nio.file.Paths;

    public class Main {
        public static void main(String[] args) throws Exception {
            
            CJson<SerializableClass> cJson = new CJson<>(new Paths("file/path/to/file.cjson"));
            SerializableClass target = cJson.deserialize(SerializableClass.class);
        }
    }
```

#### Output: 

```json
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
```json
{
    "target": {
        "fruit": "Orange",
        "size": "Medium",
        "color": $.target.fruit
    }
}
```

#### Code

```java
    import com.codedjson.CJson;
    import java.nio.file.Paths;

    public class Main {
        public static void main(String[] args) throws Exception {
            
            CJson<SerializableClass> cJson = new CJson<>(new Paths("file/path/to/file.cjson"));
            SerializableClass target = cJson.deserialize(SerializableClass.class);
        }
    }
```

#### Output

```json
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

```json
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

```java
    import com.codedjson.CJson;
    import java.util.HashMap;
    import java.nio.file.Paths;

    public class Main {
        public static void main(String[] args) throws Exception {
            
            HashMap<String, String> data = new HashMap<String, String>();
            data.put("id", "ID01");

            CJson<SerializableClass> cJson = new CJson<>(new Paths("file/path/to/file.cjson"));
            SerializableClass target = cJson.inject(SerializableClass.class, data);

        }
    }
```

#### `target` value

```json
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
```json
// This is first line comment
// This is the second one

{
    "name": "Amrut" // This is not allowed
}
```

### Removing key

#### Removing using jpath key pair

##### file.cjson

```json
{
    "target": {
        "fruit": "Orange",
        "size": "Medium",
        "color": "Orangle"
    }
}
```

##### Code

```java
    import com.codedjson.CJson;
    import java.util.HashMap;
    import java.nio.file.Paths;

    public class Main {
        public static void main(String[] args) throws Exception {
            CJson<SerializableClass> cJson = new CJson<>(new Paths("file/path/to/file.cjson"));
            cJson.deserialize(SerializableClass.class);
            SerializableClass value = cJson.remove("$.target.fruit");
        }
    }
```

##### Output 
```json
{
    "target": {
        "size": "Medium",
        "color": "Orangle"
    }
}
```

#### Removing using list of jpath keys pair

##### file.cjson

```json
{
    "target": {
        "fruit": "Orange",
        "size": "Medium",
        "color": "Orangle"
    }
}
```

##### Code

```java
    import com.codedjson.CJson;

    import java.util.Arrays;
    import java.util.HashMap;
    import java.nio.file.Paths;
    import java.util.List;
    
    public class Main {
        public static void main(String[] args) throws Exception {
            CJson<SerializableClass> cJson = new CJson<>(new Paths("file/path/to/file.cjson"));
            cJson.deserialize(SerializableClass.class);
            List<String> li = Arrays.asList("$.target.fruit", "$.target.size");
            SerializableClass value = cJson.remove(li);
        }
    }
```

##### Output
```json
{
    "target": {
        "color": "Orangle"
    }
}
```

### Deserializing CJSON string content

**Any import path used must be absolute. Otherwise, you will receive `AbsolutePathConstraintError` exception**

#### Code

```java
    import com.codedjson.CJson;

    import java.util.Arrays;
    import java.util.HashMap;
    import java.nio.file.Paths;
    import java.util.List;
    
    public class Main {
        public static void main(String[] args) throws Exception {
            String cjsonCotent = "{\n" +
                    "    \"source\": $import \"" + pureJsonfilePath.toString() + "\",\n" +
                    "    \"target\": {\n" +
                    "        \"fruit\": \"Apple\",\n" +
                    "        \"size\": \"Large\",\n" +
                    "        \"color\": \"Red\"\n" +
                    "    }\n" +
                    "}";
            CJson<SerializableClass> cJson = new CJson<>(cjsonCotent);
            SerializableClass target = cJson.deserialize(SerializableClass.class);
        }
    }
```

### Convert `JAVA Object` to `JSON String`

#### Code

```java
    import com.codedjson.CJson;

    import java.util.Arrays;
    import java.util.HashMap;
    import java.nio.file.Paths;
    import java.util.List;
    
    public class Main {
        public static void main(String[] args) throws Exception {
            Target target = new Target();
            target.source = new Pure();
            target.source.quiz = new HashMap<>();

            HashMap<String, Questions> questionsHashMap = new HashMap<>();
            Questions questions = new Questions();
            questions.question = "Which one is correct team name in NBA?";
            questions.options = Arrays.asList("New York Bulls",
                    "Los Angeles Kings",
                    "Golden State Warriros",
                    "Huston Rocket");
            questions.answer = "Huston Rocket";

            questionsHashMap.put("q1", questions);
            target.source.quiz.put("sport", questionsHashMap);

            String targetString = CJson.toString(target);
        }
    }
```

#### Output

```json
{
  "source":{
    "quiz":{
      "sport":{
        "q1":{
          "question":"Which one is correct team name in NBA?",
          "options":[
            "New York Bulls",
            "Los Angeles Kings",
            "Golden State Warriros",
            "Huston Rocket"
          ],
          "answer":"Huston Rocket"
        },
        "q2":null
      }
    }
  }
}
```