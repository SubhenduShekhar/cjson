using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace CJson.Utils
{
    public class Is : Base
    {
        internal List<String> commentedLines;

        public static Func<string, string, List<string>> MatchAndConfirm = (testContent, regex) => 
        {
            return Keywords.Match(testContent, regex);
        };
        public Is(string filePath, bool isFilePath) : base(filePath, isFilePath)
        {
            scan();
        }
        public Is(String content) : base(content)
        {
            scan();
        }
        private void scan()
        {
            commentedLines = MatchAndConfirm(content, Keywords.singleLineComment);
        }
    }
}
