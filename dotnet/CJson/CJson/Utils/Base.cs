using CJson.Exceptions;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;

namespace CJson.Utils
{
    public class Base
    {
        protected string filePath;
        protected string content;
        protected string[] commaSeparatedLines;
        protected bool isFilePath;

        public Base(string filePath, bool isFilePath)
        {
            this.filePath = filePath;
            this.content = Read(this.filePath);
            this.isFilePath = isFilePath;
        }
        public Base(String content)
        {
            this.content = content;
            this.filePath = null;
            this.isFilePath = false;
        }
        public static string Read(String filePath)
        {
            return File.ReadAllText(filePath);
        }
        protected static dynamic ParseJson(String jsonString)
        {
            try
            {
                return JObject.Parse(jsonString);
            }
            catch
            {
                try
                {
                    return JArray.Parse(jsonString);
                }
                catch (Exception)
                {
                    throw new JsonSyntaxException();
                }
            }
        }
        protected static String GetType(dynamic testVar)
        {
            try
            {
                Int32 intVar = Convert.ToInt32(testVar);
                return "int";
            }
            catch(Exception)
            {
                try
                {
                    Double doubleVar = Convert.ToDouble(testVar);
                    return "double";
                }
                catch(Exception)
                {
                    try
                    {
                        Boolean stringVar = Convert.ToBoolean(testVar);
                        return "boolean";
                    }
                    catch(Exception)
                    {
                        return "string";
                    }
                }
            }
        }
    }
}
