<div align="center">
    <img src="https://github.com/SubhenduShekhar/cjson/blob/main/docs/logo.png?raw=true" width="200" alt="CJSON Logo"/>
    <h2>Coded Javascript Object Notation</h2><br/>
    <h2>For C#</h2><br/>
    <h3>
        CJSON is a data file format(inspired from JSON), but supports logical expressions too. Having extended language support to NodeJS, Python, Java and DotNet, users has experienced data reusability. For features and examples, please refer to this documentation as base document.
    </h3>
    <br/>
    <div>
        <img src="https://img.shields.io/badge/dotnet-blue" alt="CSharp Tag">
    </div>
    <!-- <div>
        <img src="https://github.com/SubhenduShekhar/cjson/actions/workflows/java-tests.yml/badge.svg" alt="Test Status"/>
    </div> -->
</div>

<br/>

**PLEASE NOTE, ONLY DOTNET V6.0 IS SUPPORTED**

## Dependency

### .NET CLI

```console
    dotnet add package CJson --version 1.0.0
```

### Package Manager

```console
    NuGet\Install-Package CJson -Version 1.0.0
```

### PackageReference

```console
    <PackageReference Include="CJson" Version="1.0.0" />
```

### Paket CLI

```console
    paket add CJson --version 1.0.0
```

### Script & Interactive

```console
    #r "nuget: CJson, 1.0.0"
```

### Cake

```console
    // Install CJson as a Cake Addin
    #addin nuget:?package=CJson&version=1.0.0

    // Install CJson as a Cake Tool
    #tool nuget:?package=CJson&version=1.0.0
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

```csharp
    using CJson;

    namespace CJsonImpl {
        public class Main {
            public static void Main(String[] args) {
                CJson.Path cjsonFilePath = new CJson.Path(GetCurrentDirectory, "file.cjson")
                CJson<SerializableClass> cJson = new CJson<SerializableClass>(cjsonFilePath);
                SerializableClass classObj = cJson.Deserialize();
            }
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

```csharp
    using CJson;

    namespace CJsonImpl {
        public class Main {
            public static void Main(String[] args) {
                CJson.Path cjsonFilePath = new CJson.Path(GetCurrentDirectory, "file.cjson")
                CJson<SerializableClass> cJson = new CJson<SerializableClass>(cjsonFilePath);
                SerializableClass classObj = cJson.Deserialize();
            }
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

```csharp
    using CJson;

    namespace CJsonImpl {
        public class Main {
            public static void Main(String[] args) {
                Dictionary<String, String> data = new Dictionary<String, String>();
                data.Add("id", "ID01");

                CJson<SerializableClass> cJson = new CJson<SerializableClass>(new Path("file/path/to/file.cjson"));
                SerializableClass target = cJson.Inject(data);
            }
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

### Deserializing CJSON string content

**Any import path used must be absolute. Otherwise, you will receive `AbsolutePathConstraintError` exception**

#### Code

```csharp
    using CJson;
    
    namespace CJsonImpl {
        public class Main {
            public static void Main(String[] args) {
                String cjsonContent = "{\n" +
                    "    \"source\": $import \"" + pureJsonfilePath.ToString + "\",\n" +
                    "    \"target\": {\n" +
                    "        \"fruit\": \"Apple\",\n" +
                    "        \"size\": \"Large\",\n" +
                    "        \"color\": \"Red\"\n" +
                    "    }\n" +
                    "}";
                CJson<SerializableClass> cJson = new CJson<SerializableClass>(cjsonContent);
                SerializableClass target = cJson.Deserialize();
            }
        }
    }
```

### Convert `Class Object` to `JSON String`

#### Code

```csharp
    using CJson;
    
    namespace CJsonImpl {
        public class Main {
            public static void Main(String[] args) {
                Target target = new Target();
                target.source = new Pure();
                target.source.quiz = new HashMap<>();

                Dictionary<String, Questions> questionsHashMap = new Dictionary<String, Questions>();
                Questions questions = new Questions();
                questions.question = "Which one is correct team name in NBA?";
                questions.options = Arrays.asList("New York Bulls",
                        "Los Angeles Kings",
                        "Golden State Warriros",
                        "Huston Rocket");
                questions.answer = "Huston Rocket";

                questionsHashMap.put("q1", questions);
                target.source.quiz.put("sport", questionsHashMap);

                String targetString = CJson<Object>.ToString(target);
            }
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