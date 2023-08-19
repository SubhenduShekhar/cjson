using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CJson.Exceptions
{
    internal class JsonSyntaxException : Exception
    {
        public JsonSyntaxException(String message) : base(message)
        {   
        }
        public JsonSyntaxException() : base("Object is neither JsonObject nor a JsonArray")
        {

        }
    }
}
