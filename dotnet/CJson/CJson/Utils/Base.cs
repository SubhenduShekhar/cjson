using CJson.Exceptions;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CJson.Utils
{
    internal class Base
    {
        protected string filePath;
        protected string content;
        protected string[] commaSeparatedLines;
        protected bool isFilePath;
        protected List<string> commentedLines;

        public Base(string filePath, bool isFilePath)
        {
            this.filePath = filePath;
            this.content = Read(this.filePath);
            this.isFilePath = isFilePath;
        }
        public static string Read(String filePath)
        {
            return File.ReadAllText(filePath);
        }
        protected static Object ParseJson(String jsonString)
        {
            try
            {
                return JObject.Parse(jsonString);
            }
            catch(Exception jobjectException)
            {
                try
                {
                    return JArray.Parse(jsonString);
                }
                catch(Exception jarrayException)
                {
                    throw new JsonSyntaxException();
                }
            }
        }
    }
}
