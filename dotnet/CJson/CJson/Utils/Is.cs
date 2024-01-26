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
            Scan();
        }
        public Is(String content) : base(content)
        {
            Scan();
        }
        protected void Scan()
        {
            commentedLines = new List<String>();

            foreach (String splitLines in this.content.Split("\r\n"))
            {
                //String[] splitByNewLines = splitLines.Split("\\\r\\\n");
                /*foreach(String line in splitLines)
                {*/
                    if(splitLines.Trim().StartsWith(Keywords.singleLineComment))
                        commentedLines.Add(splitLines);
                /*}*/
            }
        }
    }
}
