using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CJson.Exceptions
{
    public class UnsupportedFileExtension : Exception
    {
        public UnsupportedFileExtension(String message) : base(message)
        {
        }
        public UnsupportedFileExtension() : base()
        {
        }
    }
}
