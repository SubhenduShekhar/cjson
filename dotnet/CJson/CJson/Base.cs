using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CJsonTests
{
    public class Base
    {
        private String GetCurrentDirectory
        {
            get
            {
                String path = Directory.GetParent(Directory.GetCurrentDirectory()).Parent.FullName;
                return Path.Combine(path, "tests", "test-files");
            }
        }
        
    }
}
