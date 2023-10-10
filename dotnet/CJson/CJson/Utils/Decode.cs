﻿using CJson.Exceptions;
using CJson.Types;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CJson.Utils
{
    public class Decode : Json
    {
        protected static List<String> runtimeValList = new List<String>();
        protected List<String> matchedPaths;
        public Decode(Path filePath) : base(filePath)
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
        private Decode DecodeImport(String content, String curFile, ref Boolean isModified)
        {
            if (MatchAndConfirm(content, Keywords.importKeyRegex).Count != 0)
            {
                isModified = true;
                this.content = DecodeRecursivly(content, curFile);
            }
            else isModified = false;
            return this;
        }
        private String DecodeRecursivly(String content, String curFile)
        {
            List<String> importVals = MatchAndConfirm(content, Keywords.importKeyRegex);

            if (importVals.Count == 0) return content;

            else
            {
                foreach (String eachImportVals in importVals)
                {
                    String importFilePath = GetCurrentFilePath(eachImportVals);

                    String dirName;
                    if (Path.IsAbsolutePath(importFilePath))
                        dirName = importFilePath;
                    else
                    {
                        String path = System.IO.Path.Combine(System.IO.Path.GetDirectoryName(curFile), importFilePath);
                        content = content.Replace(eachImportVals, DecodeRecursivly(File.ReadAllText(path), path));
                    }
                }
                return content;
            }
        }
        /// <summary>
        /// Decodes commented lines
        /// </summary>
        /// <param name="content"></param>
        /// <returns></returns>
        private Decode DecodeSingleStatement(ref Boolean isModified)
        {
            List<String> commentedLines = MatchAndConfirm(content, Keywords.singleLineComment);

            if (commentedLines.Count == 0) 
            {
                isModified = false;
                return this; 
            }
            else
                foreach (String eachCommentedLine in commentedLines)
                    this.content = this.content.Replace(eachCommentedLine, "");

            isModified = true;
            return this;
        }
        /// <summary>
        /// Master function for recursive calls
        /// </summary>
        /// <param name="content"></param>
        /// <param name="curFile"></param>
        /// <returns></returns>
        /// <exception cref="NotImplementedException"></exception>
        private String DecodeByDepth(String curFile)
        {
            if (isFilePath)
            {
                Boolean isImportModified = true, isCommentModified = true, isRuntimeKeyModified = true, isRelPathModified = true;

                while(isImportModified | isCommentModified | isRuntimeKeyModified | isRelPathModified)
                {
                    this.DecodeImport(this.content, curFile, ref isImportModified)
                        .DecodeSingleStatement(ref isCommentModified)
                        .DecodeRuntimeKeys(ref isRuntimeKeyModified)
                        .RelativePathsToStringKeys(ref isRelPathModified);
                }

                this.json = ParseJson(this.content);

                return this.DecodeRelativePaths().Get();
            }
            else
                throw new NotImplementedException("String parser is not implemented yet");
        }
        private String Get()
        {
            return this.content;
        }
        private Decode DecodeRuntimeKeys(ref Boolean isModified)
        {
            List<String> runtimeVals = MatchAndConfirm(content, Keywords.runtimeVals);

            if (runtimeVals.Count == 0)
                isModified = false;
            else
            {
                foreach (String eachRuntimeVal in runtimeVals)
                {
                    String variable = eachRuntimeVal.Split("<")[1].Split(">")[0];
                    runtimeValList.Add(variable);

                    if (!content.Contains("\"<" + eachRuntimeVal + ">\""))
                    {
                        variable = "\"<-" + variable + "->\"";
                        content = content.Replace(eachRuntimeVal, variable);
                    }
                }
                isModified = true;
            }
            return this;
        }
        private Decode RelativePathsToStringKeys(ref Boolean isModified)
        {
            if(MatchAndConfirm(this.content, Keywords.modifiedRelativeJPathRegex).Count != 0)
            {
                isModified = false;
                return this;
            }

            matchedPaths = MatchAndConfirm(content, Keywords.relativeJPathRegex).Distinct().ToList();

            if (matchedPaths.Count == 0) isModified = false;

            else
            {
                foreach (String eachMatchedPaths in matchedPaths)
                    this.content = content.Replace(eachMatchedPaths, "\"<" + eachMatchedPaths + ">\"");

                isModified = true;
            }
            return this;
        }
        private Decode DecodeRelativePaths()
        {

            foreach(String eachPath in matchedPaths)
            {
                ParsedValue value = ParseValue(eachPath);

                while (value.value.ToString().Contains("$."))
                    value = ParseValue(value.value.ToString());

                if (value.type.ToString().Equals("string"))
                    this.content = this.content.Replace("\"<" + eachPath + ">\"", "\"" + value.value + "\"");
                else
                    this.content = this.content.Replace("\"<" + eachPath + ">\"", value.value.ToString());

                RedefineJson(this.content);
            }

            return this;
        }
        /// <summary>
        /// Decode root for all keywords
        /// </summary>
        public String DecodeKeywords => DecodeByDepth(filePath);
    }
}
