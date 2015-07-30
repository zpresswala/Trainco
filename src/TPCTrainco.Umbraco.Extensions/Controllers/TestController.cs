using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;

namespace TPCTrainco.Umbraco.Extensions.Controllers
{
    public class TestController : ApiController
    {
        [HttpGet]
        public string[] Get()
        {
            return new string[] { "value1", "value2" };
        }

        [HttpGet]
        public string[] Index()
        {
            return new string[] { "value1", "value2" };
        }

        [HttpGet]
        public string[] Test()
        {
            return new string[] { "value1", "value2" };
        }
    }
}
