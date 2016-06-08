using Foolproof;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
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

        public bool SaveAccount { get; set; }

        [RequiredIfTrue("CreateNewAccount", ErrorMessage = "'Your industry' is requied.")]
        public string Industry { get; set; }
        public string Role { get; set; }

        [RequiredIfTrue("CreateNewAccount", ErrorMessage = "The 'how often do you use outside training' is requied.")]
        public string ExternalTrainingUsageAmount { get; set; }

        [RequiredIfTrue("CreateNewAccount", ErrorMessage = "The 'number of employees in your facility need training' is requied.")]
        public string NumberOfEmployees { get; set; }

        [RequiredIfTrue("CreateNewAccount", ErrorMessage = "The 'training topics most interested in' is requied.")]
        public string TrainingTopics { get; set; }

        [RequiredIfTrue("CreateNewAccount", ErrorMessage = "The 'previously purchased or attended courses' is requied.")]
        public string HasMakePreviousPurchase { get; set; }


        
    }
}
