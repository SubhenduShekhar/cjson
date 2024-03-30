using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CJson.Exceptions
{
    public class InvalidJPathError : Exception
    {
        public InvalidJPathError() : base("JPath should be in valid format. Check and try again")
        {

        }
    }
}
