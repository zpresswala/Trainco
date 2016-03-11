using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TPCTrainco.Umbraco.Extensions.Models.Account;

namespace TPCTrainco.Umbraco.Extensions.Models.API.Request
{
    public class LoginRequestModel : RequestBaseModel
    {
        public string Username { get; set; }
        public string Password { get; set; }
        public bool PersistantLogin { get; set; }
    }
}
