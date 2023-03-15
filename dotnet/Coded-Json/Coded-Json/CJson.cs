using Coded_Json.Support;
using Newtonsoft.Json;

namespace Coded_Json
{
    public sealed class CJson<T> : Is
    {
        private T t;
        private String[] commaSeparated;
        private String content;

        public CJson(string filePath)
        {
            this.filePath = filePath;
            decode();
        }

        private void read(String filePath)
        {
            this.content = File.ReadAllText(filePath);
            this.commaSeparated = this.content.Split(",");
        }

        private void decode()
        {
            read(this.filePath);
            for (Int32 i = 0; i < commaSeparated.Length; i++)
            {
                if (isImport(commaSeparated[i]))
                {
                    String[] res = import(commaSeparated[i]);
                    this.content = this.content.Replace("$import \"" + res[0] + "\"", res[1]);
                }
            }
        }

        public T deserialize()
        {
            return JsonConvert.DeserializeObject<T>(this.content);
        }
    }
}
