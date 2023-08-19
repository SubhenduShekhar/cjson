using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace CJson.Utils
{
    internal class Keywords
    {
        protected static string importKey { get; } = "$import \"";
        protected static string singleLineComment { get; } = "//";
        protected static string relativeJPath { get; } = "$.";
        protected static string relativeJPathRegex { get; } = @"[$][.][.A-Za-z0-9]*";
        protected static string runtimeVals { get; } = @"[<][A-Za-z0-9]*[>]";
        protected static List<string> Match(String content, String regex)
        {
            MatchCollection match = Regex.Matches(content, regex, RegexOptions.IgnoreCase);
            List<string> matches = new List<string>();
            for(int i = 0; i < match.Count; i ++)
                matches.Add(match[i].Value);
            return matches;
        }
    }
}
