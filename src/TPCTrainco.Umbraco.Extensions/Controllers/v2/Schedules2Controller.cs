using System;
using System.Web;
using System.Web.Http;
using TPCTrainco.Umbraco.Extensions.Models.SearchRequest;
using TPCTrainco.Umbraco.Extensions.Objects;
using TPCTrainco.Umbraco.Extensions.ViewModels.Search;

namespace TPCTrainco.Umbraco.Extensions.Controllers.v2
{
    public class Schedules2Controller : ApiController
    {
        [HttpGet]
        public object Details(string id = null)
        {
            SearchScheduleResponse searchResponse = new SearchScheduleResponse();

            searchResponse.Success = true;
            searchResponse.ErrorMessage = "";

            try
            {
                long scheduleId = 0;

                if (false == string.IsNullOrWhiteSpace(id))
                {
                    long.TryParse(id, out scheduleId);
                }

                if (scheduleId > 0)
                {
                    SeminarSearch seminarsObj = new SeminarSearch();

                    searchResponse.ScheduleDetail = seminarsObj.GetScheduleDetails(scheduleId);
                }
                else
                {
                    searchResponse.Success = false;
                    searchResponse.ErrorMessage = "Please provide a schedule id";
                }
            }
            catch (Exception ex)
            {
                searchResponse.Success = false;
                searchResponse.ErrorMessage = ex.ToString();
            }

            return searchResponse;
        }
    }
}
