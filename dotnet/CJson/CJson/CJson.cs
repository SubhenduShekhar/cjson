using CJson.Utils;
using System.Text.Json;

namespace CJson
{
    public class CJson<Type> : Decode
    {
        private Type type;
        public CJson(string content) : base(content) => this.type = default;
        public CJson(Path filePath) : base(filePath.FilePath, true) => this.type = default;
        public Type deserialize()
        {
            content = DecodeKeywords;
            type = JsonSerializer.Deserialize<Type>(content);
            return type;
        }
    }
}
