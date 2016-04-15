using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TPCTrainco.Umbraco.Extensions.Models.API.Request
{
    public class EmailVerificationRequestModel
    {
        public string Email { get; set; }
        public string ValidationCode { get; set; }
    }
}
