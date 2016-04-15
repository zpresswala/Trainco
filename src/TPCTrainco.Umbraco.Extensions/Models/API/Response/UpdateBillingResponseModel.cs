using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TPCTrainco.Umbraco.Extensions.Models.Account;

namespace TPCTrainco.Umbraco.Extensions.Models.API.Response
{
    public class UpdateBillingResponseModel : ResponseBaseModel
    {
        public BillingModel Result { get; set; }
        public bool Success { get; set; }
    }
}
