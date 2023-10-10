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
        internal static string singleLineComment { get; } = "//.*";
        internal static string relativeJPath { get; } = "$.";
        internal static string relativeJPathRegex { get; } = @"[$][.][.A-Za-z0-9]*";
        internal static string modifiedRelativeJPathRegex { get; } = "[\"][<][$][.][.A-Za-z0-9]*[>][\"]";
        internal static string runtimeVals { get; } = @"[<][A-Za-z0-9]*[>]";
        internal static List<string> Match(String content, String regex)
        {
            MatchCollection match = Regex.Matches(content, regex, RegexOptions.IgnoreCase);
            List<string> matches = new List<string>();
            for(int i = 0; i < match.Count; i ++)
                matches.Add(match[i].Value);
            return matches;
        }
        internal static string importKey = "$import";
    }
}
