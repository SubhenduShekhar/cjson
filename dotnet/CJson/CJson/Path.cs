using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CJson
{
    public class Path
    {
        internal String FilePath { get; private set; }
        public Path(params String[] filePath)
        {
            this.FilePath = System.IO.Path.Combine(filePath);
        }
        public String ToString() { return FilePath; }
        public static bool IsAbsolutePath(String filePath)
        {
            return System.IO.Path.IsPathRooted(filePath);
        }
    }
}
