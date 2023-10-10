
using CJson;
using CJson.Utils;
using CJsonDebug.Models;
using Newtonsoft.Json.Linq;
using System.Runtime.Remoting;
using System.Text.Json;

namespace CJsonDebug
{
    public class Class1
    {
        public static void Main(String[] args)
        {
            CJson<Target> cJson = new CJson<Target>(new CJson.Path(@"C:\Users\Home\OneDrive\Desktop\projects\cjson\tests\test-files\targetRelativeCalls.cjson"));
            Target t = cJson.deserialize();

        }
    }
}
