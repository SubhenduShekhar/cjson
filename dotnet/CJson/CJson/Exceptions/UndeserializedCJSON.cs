using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CJson.Exceptions
{
    public class UndeserializedCJSON : Exception
    {
        public UndeserializedCJSON(String message) : base(message)
        {

        }
    }
}
