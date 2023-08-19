using CJson.Exceptions;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;

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
            catch (Exception)
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
        protected static bool IsAbsolutePath(String filePath)
        {
            return Path.IsPathRooted(filePath);
        }
    }
}
