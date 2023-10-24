using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CJsonTests.models
{
    public class Questions
    {
        public String question { get; set; }
        public List<String> options { get; set; }
        public String answer { get; set; }
    }
}
