using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CJson.Exceptions
{
    public class VariableInjectionException : Exception
    {
        public VariableInjectionException(String message) : base(message)
        {

        }
    }
}
