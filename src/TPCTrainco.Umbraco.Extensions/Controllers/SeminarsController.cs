using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
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
    public class SeminarsController : ApiController
    {
        [HttpPost]
        public object Search([FromBody] dynamic json)
        {
            List<Sem> resultsList = null;
            Objects.Seminars seminarsObj = new Seminars();

            //http://localhost:49712/api/seminars/search

            //Content-Type: application/json

            //{"location":"Denver, CO","classTopics":["electrical"],"dates":{"min":{"minMonthVal":9,"minYearVal":2015},"max":{"maxMonthVal":6,"maxYearVal":2016}}}
            //{"location":"Denver, CO","classTopics":["electrical","management"],"dates":{"min":{"minMonthVal":9,"minYearVal":2015},"max":{"maxMonthVal":1,"maxYearVal":2016}}}
            //{"location":"Denver, CO","classTopics":["electrical","management"]}


            SeminarsSearchRequest searchRequest = JsonConvert.DeserializeObject<SeminarsSearchRequest>(json.ToString());

            resultsList = seminarsObj.SearchSeminars(searchRequest);

            return resultsList;
        }


        [HttpGet]
        public object Search2()
        {
            List<Sem> resultsList = null;
            Objects.Seminars seminarsObj = new Seminars();
            SeminarsSearchRequest2 searchRequest = new SeminarsSearchRequest2();

            searchRequest.DateRage = new DateRange();
            searchRequest.DateRage.Min = DateTime.Parse(DateTime.Now.ToString("M/1/yyyy"));
            searchRequest.DateRage.Max = DateTime.Parse(searchRequest.DateRage.Min.AddMonths(4).AddDays(-1).ToString("M/d/yyyy"));

            if (false == string.IsNullOrWhiteSpace(HttpContext.Current.Request.QueryString["keyword"]))
            {
                searchRequest.Keywords = HttpContext.Current.Request.QueryString.Get("keyword");
            }
            if (false == string.IsNullOrWhiteSpace(HttpContext.Current.Request.QueryString["topic"]))
            {
                searchRequest.Keywords = HttpContext.Current.Request.QueryString.Get("topic");
            }
            if (false == string.IsNullOrWhiteSpace(HttpContext.Current.Request.QueryString["location"]))
            {
                searchRequest.Location = HttpContext.Current.Request.QueryString.Get("location");
            }
            if (false == string.IsNullOrWhiteSpace(HttpContext.Current.Request.QueryString["radius"]))
            {
                int radius = 50;

                int.TryParse(HttpContext.Current.Request.QueryString.Get("radius"), out radius);

                searchRequest.Radius = radius;
            }
            if (false == string.IsNullOrWhiteSpace(HttpContext.Current.Request.QueryString["date-start"]))
            {
                DateTime dateStart = searchRequest.DateRage.Min;
                DateTime.TryParse(HttpContext.Current.Request.QueryString.Get("date-start"), out dateStart);

                searchRequest.DateRage.Min = dateStart;
            }
            if (false == string.IsNullOrWhiteSpace(HttpContext.Current.Request.QueryString["date-end"]))
            {
                DateTime dateEnd = searchRequest.DateRage.Max;
                DateTime.TryParse(HttpContext.Current.Request.QueryString.Get("date-end"), out dateEnd);

                searchRequest.DateRage.Max = dateEnd;
            }
            if (false == string.IsNullOrWhiteSpace(HttpContext.Current.Request.QueryString["page"]))
            {
                int page = 0;

                int.TryParse(HttpContext.Current.Request.QueryString.Get("page"), out page);

                searchRequest.Page = page;
            }



            resultsList = seminarsObj.SearchSeminars(searchRequest);

            return resultsList;
        }
    }
}
