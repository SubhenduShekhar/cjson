using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace CJson.Utils
{
    class Keywords
    {
        internal static string importKeyRegex { get; } = "\\s\\$import [\\\"\\']+.*[\\\"\\']";
        internal static string singleLineComment { get; } = "//";
        internal static string relativeJPath { get; } = "$.";
        internal static string relativeJPathRegex { get; } = @"[$][.][.A-Za-z0-9]*";
        internal static string modifiedRelativeJPathRegex { get; } = "[\"][<][$][.][.A-Za-z0-9]*[>][\"]";
        internal static string runtimeVals { get; } = @"[<][^-].*[^-][>]";
        internal static List<string> Match(String content, String regex)
        {
            MatchCollection match = Regex.Matches(content, regex, RegexOptions.IgnoreCase);
            List<string> matches = new List<string>();
            for(int i = 0; i < match.Count; i ++)
                matches.Add(match[i].Value);
            return matches;
        }
        internal static string importKey = "$import";
        private static List<String> RemoveWithPreComma(String key, String value, String content)
        {
            String regex = "\\s*,+\\s*\"" + key.Split("\\.")[key.Split("\\.").Length - 1] + "\"\\s*:\"?\\s*" + value + "\"?\\s*";
            return Match(content, regex);
        }
        private static List<String> RemoveWithSucComma(String key, String value, String content)
        {
            String regex = "\\s*\"" + key.Split("\\.")[key.Split("\\.").Length - 1] + "\"\\s*:\\s*\"?" + value + "\"?\\s*,+\\s*";
            return Match(content, regex);
        }
        internal static List<String> KeyValueSet(String key, String value, String content)
        {
            value = value.Replace("\\.", "\\\\.")
                .Replace("\\[", "\\\\[")
                .Replace("\\?", "\\\\?")
                .Replace("\\*", "\\\\*")
                .Replace("\\+", "\\\\+")
                .Replace("\\{", "\\\\{")
                .Replace("\\$", "\\\\$")
                .Replace("\\^", "\\\\^");
            List<String> matches = RemoveWithSucComma(key, value, content);
            if (matches.Count != 0) return matches;
            else return RemoveWithPreComma(key, value, content);
        }
    }
}
