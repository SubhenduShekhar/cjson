﻿using CJson.Exceptions;
using Newtonsoft.Json.Linq;

namespace CJson.Types
{
    public class Try
    {
        public static Boolean TryInt32(JValue jValue)
        {
            try
            {
                jValue.ToObject<Int32>();
                return true;
            }
            catch
            {
                return false;
            }
        }
        public static Boolean TryDouble(JValue jValue)
        {
            try
            {
                if(jValue.ToObject<Double>() != jValue.ToObject<Int32>())
                    return true;
                else
                    return false;
            }
            catch
            {
                return false;
            }
        }
        public static Boolean TryBoolean(JValue jValue)
        {
            try
            {
                jValue.ToObject<Boolean>();
                return true;
            }
            catch
            {
                return false;
            }
        }
        public static Boolean TryString(JValue jValue)
        {
            try
            {
                jValue.ToObject<String>();
                return true;
            }
            catch
            {
                return false;
            }
        }
        public static Boolean TryNull(JValue jValue)
        {
            try
            {
                if(jValue == null)
                    return true;

                return false;
            }
            catch
            {
                return false;
            }
        }
        public static String GetType(dynamic value)
        {
            String type = value.GetType().Name.ToLower();

            if (type.Contains("int")) return "int";
            else if (type.Contains("string")) return "string";
            else if (type.Contains("double")) return "double";
            else if (type.Contains("bool")) return "bool";
            else throw new UnrecognizedTypeException(type + " is not recognized");
        }
    }
}
