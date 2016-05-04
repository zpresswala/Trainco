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
    public class CacheUpdateController : ApiController
    {
        [HttpGet]
        public void Refresh()
        {
            //http://localhost:49712/api/cacheupdate/refresh
            //Content-Type: application/json

            CacheObjects.GetCourseDetailList(true);
            CacheObjects.GetLocationScheduleDetailList(true);
        }
    }
}
