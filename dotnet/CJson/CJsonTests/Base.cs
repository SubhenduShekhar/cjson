using CJson;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Path = CJson.Path;

namespace CJsonTests
{
    public class Base
    {
        private static String GetCurrentDirectory
        {
            get
            {
                String path = Directory.GetParent(Directory.GetCurrentDirectory()).Parent.Parent.Parent.Parent.Parent.FullName;
                return System.IO.Path.Combine(path, "tests", "test-files");
            }
        }
        protected readonly Path cjsonFilePath = new Path(GetCurrentDirectory, "target.cjson");
        protected readonly Path jsonfilePath = new Path(GetCurrentDirectory, "source.json");
        protected readonly Path pureJsonfilePath = new Path(GetCurrentDirectory, "pure.json");
        protected readonly Path relativeTargetCjson = new Path(GetCurrentDirectory, "targetRelativeCalls.cjson");
        protected readonly Path variableInjectionCjson = new Path(GetCurrentDirectory, "VariableInjection.cjson");
    }
}
