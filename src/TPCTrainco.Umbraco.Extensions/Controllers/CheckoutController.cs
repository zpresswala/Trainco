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
    public class CheckoutController : ApiController
    {
        [HttpPost]
        public object Submit([FromBody] dynamic json)
        {
            CheckoutResponse resultsList = null;

            //http://localhost:49712/api/checkout/submit

            //Content-Type: application/json

            //[{"seminarId":53148,"firstName":"f","lastName":"l","title":"t","email":"e"},{"seminarId":53148,"firstName":"f2","lastName":"l2","title":"t2","email":"e2"},{"seminarId":53147,"firstName":"f3","lastName":"l3","title":"t3","email":"e3"}]


            CheckoutCart saveRequest = JsonConvert.DeserializeObject<CheckoutCart>(json.ToString());

            Carts cartsObj = new Carts();

            resultsList = cartsObj.SaveCheckoutItems(saveRequest);

            return resultsList;
        }
    }
}
