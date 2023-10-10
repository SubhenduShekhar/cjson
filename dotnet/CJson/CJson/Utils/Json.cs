using CJson.Types;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Remoting;
using System.Text;
using System.Text.Json.Nodes;
using System.Threading.Tasks;

namespace CJson.Utils
{
    public class Json : Is
    {
        protected dynamic json;
        public Json(String content) : base(content) { }
        public Json(Path filePath) : base(filePath.FilePath, true) { }

        public ParsedValue ParseValue(String key)
        {
            dynamic value = this.GetValueFromKey(key);

            if(((Type) value.GetType()).Name.Contains("JValue"))
            {
                JValue jValue = (JValue)value;

                if (Try.TryNull(jValue)) return new ParsedValue((String)jValue, "null");
                else if (Try.TryDouble(jValue)) return new ParsedValue((Double)jValue, "double");
                else if (Try.TryInt32(jValue)) return new ParsedValue((Int32)jValue, "int");
                else if (Try.TryBoolean(jValue)) return new ParsedValue((Boolean)jValue, "boolean");
                else if (Try.TryString(jValue)) return new ParsedValue((String)jValue, "string");
                else return new ParsedValue((String)jValue, "string");
            }
            else return new ParsedValue(value, "JValue");
        }
        private dynamic GetValueFromKey(String key)
        {
            if (this.json == null) throw new NullReferenceException("json object is null");

            dynamic value = this.json;

            if(key.Contains("."))
            {
                String[] keyList = key.Split(".");
                for(Int32 i = 0; i < keyList.Length; i ++)
                {
                    if (keyList[i].Equals("$")) continue;
                    if (keyList[i].Contains("[") && keyList[i].Contains("]"))
                    {
                        String eachKey = keyList[i].Split("\\[")[0];
                        Int32 index = Convert.ToInt32(keyList[i].Split("[")[1].Split("]")[0]);
                        value = (JArray)((JObject)value).GetValue(eachKey)[index];
                    }
                    else 
                        value = ((JObject)value).GetValue(keyList[i]);
                }
            }
            else value = ((JObject)value).GetValue(key);

            return value;
        }
        protected void RedefineJson(String content)
        {
            this.json = ParseJson(content);
        }
    }
}
