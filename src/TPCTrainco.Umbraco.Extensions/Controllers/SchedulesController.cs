using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using System.Net.Http;
using TPCTrainco.Umbraco.Extensions.Models;
using TPCTrainco.Umbraco.Extensions.Models.SearchRequest;
using TPCTrainco.Umbraco.Extensions.Objects;
using TPCTrainco.Umbraco.Extensions.ViewModels;
using TPCTrainco.Umbraco.Extensions.ViewModels.Backbone;

namespace TPCTrainco.Umbraco.Extensions.Controllers
{
    public class SchedulesController : ApiController
    {
        [HttpPost]
        public List<Sch> SearchByLocation([FromBody] dynamic json)
        {
            List<Sch> resultsList = null;
            Objects.Seminars seminarsObj = new Seminars();

            //http://localhost:49712/api/locations/searchbylocation

            //Content-Type: application/json

            //POST
            //{"courseId":123,"cityId":12,"searchId":""}

            if (false == string.IsNullOrWhiteSpace(json))
            {
                SchedulesSearchRequest searchRequest = JsonConvert.DeserializeObject<SchedulesSearchRequest>(json.ToString());

                if (searchRequest != null && searchRequest.CourseId > 0 && searchRequest.CityId > 0 && false == string.IsNullOrWhiteSpace(searchRequest.SearchId))
                {
                    resultsList = seminarsObj.SearchSchedules(searchRequest);
                }
            }


            return resultsList;
        }
    }
}
