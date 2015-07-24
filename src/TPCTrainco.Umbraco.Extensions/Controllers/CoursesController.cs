using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using TPCTrainco.Umbraco.Extensions.Models;

namespace TPCTrainco.Umbraco.Extensions.Controllers
{
    public class CoursesController : ApiController
    {
        [HttpGet]
        public void Search(string json)
        {
            CoursesSearchRequest searchRequest = JsonConvert.DeserializeObject<CoursesSearchRequest>(json);
        }
    }
}
