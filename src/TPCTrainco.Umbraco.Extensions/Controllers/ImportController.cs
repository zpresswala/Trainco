using Newtonsoft.Json;
using System;
using System.Collections.Generic;
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
    public class ImportController : ApiController
    {
        [HttpGet]
        public object Redirects()
        {
            string output = Helpers.ImportRedirects.Import(HttpContext.Current.Server.MapPath("/data/American-Trainco-URL-Map-FIXED.xlsx"));

            return output;
        }
    }
}
