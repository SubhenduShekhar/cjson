using CJson.Utils;
using System.Collections.Generic;
using System.Text.Json;

namespace CJson
{
    public sealed class CJson<Type> : Decode
    {
        private Type type;
        public CJson(string content) : base(content) => this.type = default;
        public CJson(Path filePath) : base(filePath) => this.type = default;
        public CJson<Type> Parse()
        {
            content = DecodeKeywords;

            this.json = ParseJson(this.content);

            return this;
        }
        public CJson<Type> Inject(String key, dynamic value)
        {
            this.content = DecodeKeywords;

            this.content = InjectData(key, value);

            this.json = ParseJson(this.content);

            return this;
        }
        public CJson<Type> Inject(Dictionary<String, dynamic> injectingValues)
        {
            foreach(KeyValuePair<String, dynamic> eachKeyValuePair in injectingValues)
                Inject(eachKeyValuePair.Key, eachKeyValuePair.Value);

            return this;
        }
        public Type Deserialize()
        {
            return JsonSerializer.Deserialize<Type>(this.content);
        }
        public String DeserializeAsString()
        {
            return this.content;
        }
        public static String ToString(dynamic value)
        {
            if (value == null) return "{}";
            return GetAsString(value);
        }
    }
}
