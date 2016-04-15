using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TPCTrainco.Umbraco.Extensions.Models.Account
{
    public class LoginModel
    {
        public string Username { get; set; }
        public string Password { get; set; }
        public bool PersistantLogin { get; set; }
    }
}
