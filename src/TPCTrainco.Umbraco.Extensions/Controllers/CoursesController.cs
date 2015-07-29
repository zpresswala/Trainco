using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using TPCTrainco.Umbraco.Extensions.Models;
using TPCTrainco.Umbraco.Extensions.Objects;

namespace TPCTrainco.Umbraco.Extensions.Controllers
{
    public class CoursesController : ApiController
    {
        [HttpPost]
        public void Search([FromBody] dynamic json)
        {
            //{"location":"Vermont","classTopics":["electrical","management"],"dates":{"min":{"minMonthVal":9,"minYearVal":2015},"max":{"maxMonthVal":1,"maxYearVal":2016}}}

            SeminarsSearchRequest searchRequest = JsonConvert.DeserializeObject<SeminarsSearchRequest>(json.ToString());

            List<COURS> courseList = CacheObjects.GetCourseList();

            if (courseList != null)
            {

            }

        }
    }
}
