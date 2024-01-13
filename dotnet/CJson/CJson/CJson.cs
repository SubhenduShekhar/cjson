using CJson.Utils;
using System.Text.Json;

namespace CJson
{
    /// <summary>
    /// CJson entrypoint class.<br/>
    /// Object must be created for any CJson file or content for deserializing.<br/>
    /// Only class object to JSON string conversion can be done without object creation.
    /// </summary>
    /// <typeparam name="Type">Class Type should be passed. For more info, see official docs </typeparam>
    public sealed class CJson<Type> : Decode
    {
        private Type? type;
        /// <summary>
        /// Constructor for raw CJSON/ JSON content<br/>
        /// CJson content to be passed.<br/>
        /// For loading CJSON/ JSON file, please create constructor with CJson.Path class
        /// For import statements, please specify absolute path to the file to be imported.
        /// </summary>
        /// <param name="content">CJson content in string format</param>
        public CJson(string content) : base(content)
        {
            this.Parse();
        }
        /// <summary>
        /// Constructor for CJSON/ JSON file path<br/>
        /// CJson/JSON file path to be passed with CJson.Path class constructor.<br/>
        /// For loading CJSON/JSON raw content, please call CJSON(string content) contructor
        /// </summary>
        /// <param name="filePath">CJson.Path class constructor</param>
        public CJson(Path filePath) : base(filePath)
        {
            this.Parse();
        }
        /// <summary>
        /// Call this function to retrieve deserialized Newtonsoft.Json.Linq.JObject
        /// or Newtonsoft.Json.Linq.JArray.<br/>
        /// <b>This method requires deserialization.<b/>
        /// Call Deserialize() before invoking this method.
        /// </summary>
        /// <returns>Parsed JObject/JArray. A typecast will be need to respective class type</returns>
        private CJson<Type> Parse()
        {
            content = DecodeKeywords;

            this.json = ParseJson(this.content);
            return this;
        }
        /// <summary>
        /// Call this function to inject value which expects a dynamic injection.<br/>
        /// <b>Please note, inject doesnt work on inject at jpath, or inject at any json key.</b><br/><br/>
        /// 
        /// For more info, check <a href="https://subhendushekhar.github.io/cjson/">this link</a>
        /// </summary>
        /// <param name="key">Where you want to inject</param>
        /// <param name="value">Value which you want to inject at key</param>
        /// <returns>Deserialized class object of Type. Null if Type and CJSON content mismatches</returns>
        public Type? Inject(String key, dynamic value)
        {
            InjectUsingKeyValuePair(key, value);

            type = this.Deserialize();
            return type;
        }
        /// <summary>
        /// Call this function to inject value which expects a dynamic injection.<br/>
        /// You can use this function for bulk injection.<br/><br/>
        /// 
        /// For more info, check <a href="https://subhendushekhar.github.io/cjson/">this link</a>
        /// </summary>
        /// <param name="injectingValues">Dictionary whose key is location and value is data to be inject</param>
        /// <returns></returns>
        public Type? Inject(Dictionary<String, dynamic> injectingValues)
        {
            foreach(KeyValuePair<String, dynamic> eachKeyValuePair in injectingValues)
                InjectUsingKeyValuePair(eachKeyValuePair.Key, eachKeyValuePair.Value);

            type = this.Deserialize();
            return type;
        }
        /// <summary>
        /// This method can be used if single inject operation need to be performed.
        /// For bulk operations, you can store the values in a Dictionary and perform inject using Inject(Dictionary<String, dynamic> injectingValues)
        /// </summary>
        /// <param name="key">Inject key location</param>
        /// <param name="value">Value to be injected</param>
        private void InjectUsingKeyValuePair(String key, dynamic value)
        {
            this.content = DecodeKeywords;

            this.content = InjectData(key, value);

            this.json = ParseJson(this.content);
        }
        /// <summary>
        /// Call this method to deserialize CJSON content to ClassType.<br/>
        /// If any error in format of the class hierarchy exists, this function will
        /// return a null valued object to the provided ClassType
        /// </summary>
        /// <returns>Deserialized class object of Type. Null if Type and CJSON content mismatches</returns>
        public Type? Deserialize()
        {
            return JsonSerializer.Deserialize<Type>(content);
        }
        public String DeserializeAsString()
        {
            return this.content;
        }
        /// <summary>
        /// Use this function to convert a class object to a JSON string.
        /// No CJSON operation can be performed after this function.
        /// </summary>
        /// <param name="value">class object</param>
        /// <returns></returns>
        public static String ToString(dynamic value)
        {
            if (value == null) return "{}";
            return GetAsString(value);
        }
    }
}
