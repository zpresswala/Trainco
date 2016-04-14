using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TPCTrainco.Umbraco.Extensions.Models.Account
{
    public class CompanyModel
    {
        public string Username { get; set; }
        public string Name { get; set; }
        public string Address1 { get; set; }
        public string Address2 { get; set; }
        public string Country { get; set; }        
        public string City { get; set; }
        public string State { get; set; }
        public string PostalCode { get; set; }

        public string HowDidYouAboutUs { get; set; }
        public string PromCode { get; set; }
        public string Industry { get; set; }
        public string Role { get; set; }
        public string ExternalTrainingUsageAmount { get; set; }
        public string NumberOfEmployees { get; set; }
        public string TrainingTopics { get; set; }
        public string HasMakePreviousPurchase { get; set; }


        
    }
}
