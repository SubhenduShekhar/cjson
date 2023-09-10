using CJson.Exceptions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CJson.Utils
{
    public class Decode : Is
    {
        public Decode(string filePath, bool isFilePath) : base(filePath, isFilePath)
        {
        }
        public Decode(string content) : base(content)
        {

        }
        private String GetCurrentFilePath(String importVal)
        {
            if (importVal.Split(Keywords.importKey)[1].Trim().StartsWith("\'")) 
                throw new IllegalImportStatement("Syntax Error : Import statement should use \" instead of \' in " + importVal);

            String path = importVal.Split(Keywords.importKey)[1].Trim();
            path = path.Split("\"")[1].Split("\"")[0];

            if (path.EndsWith(".json") || path.EndsWith(".cjson")) ;
            else throw new UnsupportedFileExtension("Only .cjson and .json formats are supported");

            return path;
        }
        /// <summary>
        /// Decodes import statements in CJSON context
        /// </summary>
        /// <param name="content"></param>
        /// <param name="curFile"></param>
        /// <returns></returns>
        private String DecodeImport(String content, String curFile)
        {
            List<String> importVals = MatchAndConfirm(content, Keywords.importKeyRegex);

            if (importVals.Count == 0) return content;

            else
            {
                foreach (String eachImportVals in importVals)
                {
                    String importFilePath = GetCurrentFilePath(eachImportVals);
                    curFile = System.IO.Path.Combine(System.IO.Path.GetDirectoryName(curFile), importFilePath);

                    content = content.Replace(eachImportVals, DecodeByDepth(File.ReadAllText(curFile), curFile));
                }
                return content;
            }
        }
        /// <summary>
        /// Decodes commented lines
        /// </summary>
        /// <param name="content"></param>
        /// <returns></returns>
        private String DecodeSingleStatement(String content)
        {
            List<String> commentedLines = MatchAndConfirm(content, Keywords.singleLineComment);

            if (commentedLines.Count == 0) return content;

            else
                foreach(String eachCommentedLine in commentedLines)
                    content = content.Replace(eachCommentedLine, "");

            return content;
        }
        /// <summary>
        /// Master function for recursive calls
        /// </summary>
        /// <param name="content"></param>
        /// <param name="curFile"></param>
        /// <returns></returns>
        /// <exception cref="NotImplementedException"></exception>
        private String DecodeByDepth(String content, String curFile)
        {
            if (isFilePath)
            {
                content = DecodeImport(content, curFile);
                content = DecodeSingleStatement(content);
                return content;
            }
            else
                throw new NotImplementedException("String parser is not implemented yet");
        }
        /// <summary>
        /// Decode root for all keywords
        /// </summary>
        public String DecodeKeywords => DecodeByDepth(content, filePath);
    }
}
