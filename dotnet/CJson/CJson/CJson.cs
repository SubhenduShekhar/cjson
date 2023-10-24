using CJson.Utils;
using System.Collections.Generic;
using System.Text.Json;

namespace CJson
{
    public sealed class CJson<Type> : Decode
    {
        private Type? type;
        public CJson(string content) : base(content)
        {
            this.Parse();
        }
        public CJson(Path filePath) : base(filePath)
        {
            this.Parse();
        }
        private CJson<Type> Parse()
        {
            content = DecodeKeywords;

            this.json = ParseJson(this.content);

            return this;
        }
        public Type? Inject(String key, dynamic value)
        {
            InjectUsingKeyValuePair(key, value);

            type = this.Deserialize();
            return type;
        }
        public Type? Inject(Dictionary<String, dynamic> injectingValues)
        {
            foreach(KeyValuePair<String, dynamic> eachKeyValuePair in injectingValues)
                InjectUsingKeyValuePair(eachKeyValuePair.Key, eachKeyValuePair.Value);

            type = this.Deserialize();
            return type;
        }

        private void InjectUsingKeyValuePair(String key, dynamic value)
        {
            this.content = DecodeKeywords;

            this.content = InjectData(key, value);

            this.json = ParseJson(this.content);
        }
        public Type? Deserialize()
        {
            return JsonSerializer.Deserialize<Type>(content);
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
