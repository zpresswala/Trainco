using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TPCTrainco.Umbraco.Extensions.Models.Account
{
    public class UserModel
    {
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Title { get; set; }
        public string Phone { get; set; }
        public string PhoneExtention { get; set; }
        public string Password { get; set; }

        public bool HasMadePreviousPurchase { get; set; }
        public string Role { get; set; }
        public string TrainingTopics { get; set; }
        public string ValidationCode { get; set; }
    }
}
