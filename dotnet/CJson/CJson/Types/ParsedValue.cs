using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CJson.Types
{
    public class ParsedValue
    {
        public dynamic value;
        public String type;
        public ParsedValue(Object value, String type)
        {
            this.value = value;
            this.type = type;
        }
    }
}
