using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CJsonDebug.Models
{
    public class TargetObj
    {
        public String fruit { get; set; }
        public String size { get; set; }
        public String color { get; set; }
        public Int32 quantity { get; set; }
        public String secColor { get; set; }
        public List<String> colorList { get; set; }
        public Double digitCheck { get; set; }
        public Double digitImport { get; set; }
        public List<Double> digitArrayImport { get; set; }
    }
}
