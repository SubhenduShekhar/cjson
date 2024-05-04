using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CJsonTests.models
{
    public class TargetObj
    {
        public String fruit { get; set; }
        public String size { get; set; }
        public String color { get; set; }
        public String secColor { get; set; }
        public List<String> colorList { get; set; }
        public double digitCheck { get; set; }
        public double digitImport { get; set; }
        public List<Double> digitArrayImport { get; set; }
        public String types { get; set; }
        public Int32 quantity { get; set; }
        public String fruitType { get; set; }
        public String rawData { get; set; }
        public String mixData { get; set; }
    }
}
