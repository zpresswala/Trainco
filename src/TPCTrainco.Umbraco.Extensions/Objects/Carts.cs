using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TPCTrainco.Umbraco.Extensions.Models;
using TPCTrainco.Umbraco.Extensions.ViewModels;

namespace TPCTrainco.Umbraco.Extensions.Objects
{
    public class Carts
    {
        public CartResponse SaveCartItems(List<CartItem> cartItemList)
        {
            CartResponse response = new CartResponse();

            response.Success = true;
            response.Message = "Success!";

            return response;
        }
    }
}
