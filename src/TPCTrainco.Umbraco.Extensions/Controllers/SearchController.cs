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
    public class SearchController : ApiController
    {
        [HttpGet]
        public object Index()
        {
            return new string[] { "value1", "value2" };
        }

        [HttpGet]
        public object Get()
        {
            return new string[] { "value1", "value2" };
        }
    }
}
