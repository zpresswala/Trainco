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

        [Required]
        [DisplayName("'your industry'")]
        public string Industry { get; set; }
        public string Role { get; set; }

        [Required]
        [DisplayName("'how often do you use outside training'")]
        public string ExternalTrainingUsageAmount { get; set; }

        [Required]
        [DisplayName("'number of employees in your facility need training'")]
        public string NumberOfEmployees { get; set; }

        [Required]
        [DisplayName("'training topics most interested in'")]
        public string TrainingTopics { get; set; }

        [Required]
        [DisplayName("'previously purchased or attended courses'")]
        public string HasMakePreviousPurchase { get; set; }


        
    }
}
