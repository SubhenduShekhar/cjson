using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CJson
{
    /// <summary>
    /// For file path related operations, use this class object.
    /// </summary>
    public class Path
    {
        internal String FilePath { get; private set; }
        /// <summary>
        /// Constructor for object creation.<br/>
        /// Please provide absolute path for this operation.
        /// </summary>
        /// <param name="filePath"></param>
        public Path(params String[] filePath)
        {
            this.FilePath = System.IO.Path.Combine(filePath);
        }
        /// <summary>
        /// Get the string value of the path
        /// </summary>
        public new String ToString {
            get { return this.FilePath; }
        }
        /// <summary>
        /// Returns true if the path is absolute, else false.<br/>
        /// This method is not tested in IOS. For bug report, refer to the <a href="https://github.com/SubhenduShekhar/cjson">github</a>
        /// </summary>
        /// <param name="filePath">Test path</param>
        /// <returns>true if path is absolute, else false in boolean</returns>
        public static bool IsAbsolutePath(String filePath)
        {
            if(filePath.StartsWith("\\"))
                filePath = filePath.Substring(2);
            return System.IO.Path.IsPathRooted(filePath);
        }
    }
}
