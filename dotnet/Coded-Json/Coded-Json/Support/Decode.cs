using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Coded_Json.Support
{
    public class Decode : Base
    {
        public String[] import(String item)
        {
            String importFilePath = item.Split("$import \"")[1].Split("\"")[0];
            String baseDirectory = Directory.GetParent(this.filePath).FullName;
            String importFullPath = Path.Combine(baseDirectory, importFilePath);
            String fileText = File.ReadAllText(importFullPath);
            return new String[] { importFilePath, fileText};
        }
    }
}
