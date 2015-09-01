using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TPCTrainco.Umbraco.Extensions.ViewModels
{
    public class CheckoutResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public string CartGuid { get; set; }
        public List<CheckoutItemResponse> InvalidItems { get; set; }
    }
}
