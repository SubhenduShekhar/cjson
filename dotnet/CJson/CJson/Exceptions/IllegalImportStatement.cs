using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CJson.Exceptions
{
    public class IllegalImportStatement : Exception
    {
        public IllegalImportStatement(String message) : base(message)
        {
        }
        public IllegalImportStatement() : base ()
        {
        }
    }
}
