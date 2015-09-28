using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TPCTrainco.Umbraco.Extensions.Models
{
    public class CheckoutCart
    {
        public string CartGuid { get; set; }
        public List<CheckoutItem> CheckoutItems { get; set; }
    }
}
