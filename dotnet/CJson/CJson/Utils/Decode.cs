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
        private Decode DecodeImport(String content, String curFile)
        {
            List<String> importVals = MatchAndConfirm(content, Keywords.importKeyRegex);

            if (importVals.Count == 0) return this;

            else
            {
                foreach (String eachImportVals in importVals)
                {
                    String importFilePath = GetCurrentFilePath(eachImportVals);
                    curFile = System.IO.Path.Combine(System.IO.Path.GetDirectoryName(curFile), importFilePath);

                    content = content.Replace(eachImportVals, DecodeByDepth(File.ReadAllText(curFile), curFile));
                }
                return this;
            }
        }
        /// <summary>
        /// Decodes commented lines
        /// </summary>
        /// <param name="content"></param>
        /// <returns></returns>
        private Decode DecodeSingleStatement(String content)
        {
            List<String> commentedLines = MatchAndConfirm(content, Keywords.singleLineComment);

            if (commentedLines.Count == 0) return this;

            else
                foreach(String eachCommentedLine in commentedLines)
                    content = content.Replace(eachCommentedLine, "");

            return this;
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
                return this.DecodeImport(content, curFile)
                    .DecodeSingleStatement(content)
                    .get();
            }
            else
                throw new NotImplementedException("String parser is not implemented yet");
        }
        private String get()
        {
            return this.content;
        }
        /// <summary>
        /// Decode root for all keywords
        /// </summary>
        public String DecodeKeywords => DecodeByDepth(content, filePath);
    }
}
