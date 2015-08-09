using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using TPCTrainco.Umbraco.Extensions.Models;
using TPCTrainco.Umbraco.Extensions.Models.SearchRequest;
using TPCTrainco.Umbraco.Extensions.Objects;
using TPCTrainco.Umbraco.Extensions.ViewModels;
using TPCTrainco.Umbraco.Extensions.ViewModels.Backbone;

namespace TPCTrainco.Umbraco.Extensions.Controllers
{
    public class SeminarsController : ApiController
    {
        [HttpPost]
        public object Search([FromBody] dynamic json)
        {
            List<Sem> resultsList = null;
            Objects.Seminars seminarsObj = new Seminars();

            //http://localhost:49712/api/seminars/search

            //Content-Type: application/json

            //{"location":"Denver, CO","classTopics":["electrical","management"],"dates":{"min":{"minMonthVal":9,"minYearVal":2015},"max":{"maxMonthVal":1,"maxYearVal":2016}}}
            //{"location":"Denver, CO","classTopics":["electrical","management"]}


            SeminarsSearchRequest searchRequest = JsonConvert.DeserializeObject<SeminarsSearchRequest>(json.ToString());

            resultsList = seminarsObj.SearchSeminars(searchRequest);

            return resultsList;
        }
    }
}
