using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Coded_Json.Support
{
    public class Is : Decode
    {
        protected Boolean isImport(String lineItem)
        {
            if (lineItem.Contains("$import \""))
                return true;
            return false;
        }
    }
}
