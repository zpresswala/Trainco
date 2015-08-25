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
    public class CartsController : ApiController
    {
        [HttpPost]
        public object Save([FromBody] dynamic json)
        {
            CartResponse resultsList = null;

            //http://localhost:49712/api/carts/save

            //Content-Type: application/json

            //[{"Id":1234,"quantity":1},{"Id":1235,"quantity":2}]


            List<CartItem> saveRequest = JsonConvert.DeserializeObject<List<CartItem>>(json.ToString());

            Carts cartsObj = new Carts();

            resultsList = cartsObj.SaveCartItems(saveRequest);

            return resultsList;
        }
    }
}
