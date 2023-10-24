using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CJsonTests.models
{
    public class TargetRelativeCalls
    {
        public Pure source { get; set; }
        public RelativeCalls relativeCalls { get; set; }
        public TargetObj target { get; set; }
    }
}
