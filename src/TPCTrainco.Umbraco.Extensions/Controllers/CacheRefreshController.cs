using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using TPCTrainco.Umbraco.Extensions.Models;
using TPCTrainco.Umbraco.Extensions.Models.SearchRequest;
using TPCTrainco.Umbraco.Extensions.Objects;
using TPCTrainco.Umbraco.Extensions.ViewModels;
using TPCTrainco.Umbraco.Extensions.ViewModels.Backbone;

namespace TPCTrainco.Umbraco.Extensions.Controllers
{
    public class CacheRefreshController : ApiController
    {
        [HttpGet]
        public object Seminars(string apiKeyRequest)
        {
            string apiKey = ConfigurationManager.AppSettings.Get("Caching:Refresh:Api");
            CacheResponse response = new CacheResponse();

            response.Success = 0;
            response.Message = "";

            if (apiKey.ToUpper() == apiKey.ToUpper())
            {
                List<Seminar_Catalog> seminarList = CacheObjects.GetSeminarList(true);
                List<SCHEDULE> scheduleList = CacheObjects.GetScheduleList(true);
            }
            else
            {
                response.Success = 0;
                response.Message = "Invalid Key";
            }

            string responseString = JsonConvert.SerializeObject(response);

            return responseString;
        }


        public object Courses(string apiKeyRequest)
        {
            string apiKey = ConfigurationManager.AppSettings.Get("Caching:Refresh:Api");
            CacheResponse response = new CacheResponse();

            response.Success = 0;
            response.Message = "";

            if (apiKey.ToUpper() == apiKey.ToUpper())
            {
                List<COURS> courseList = CacheObjects.GetCourseList(true);
            }
            else
            {
                response.Success = 0;
                response.Message = "Invalid Key";
            }

            string responseString = JsonConvert.SerializeObject(response);

            return responseString;
        }

    }
}
