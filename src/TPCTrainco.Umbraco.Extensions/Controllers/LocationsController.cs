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
    public class LocationsController : ApiController
    {
        [HttpPost]
        public List<Loc> SearchBySeminar([FromBody] dynamic json)
        {
            List<Loc> resultsList = null;
            Objects.Seminars seminarsObj = new Seminars();

            //http://localhost:49712/api/locations/searchbyseminar

            //Content-Type: application/json

            //POST
            //{"courseId":55890,"searchId":"acb4eba9-3868-4987-a224-5b77077cbb4b"}
            LocationsSearchRequest searchRequest = JsonConvert.DeserializeObject<LocationsSearchRequest>(json.ToString());

            if (searchRequest != null && searchRequest.CourseId > 0 && false == string.IsNullOrWhiteSpace(searchRequest.SearchId))
            {
                searchRequest.SearchId = searchRequest.SearchId.ToLower();

                resultsList = seminarsObj.SearchLocations(searchRequest);
            }


            return resultsList;
        }
    }
}
