using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CJson.Exceptions
{
    public class AbsolutePathConstraintError : Exception
    {
        public AbsolutePathConstraintError() : base("Expected absolute path in import statement but got relative") { }
    }
}
