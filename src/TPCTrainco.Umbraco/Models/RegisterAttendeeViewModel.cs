using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace TPCTrainco.Umbraco.Models
{
    public class RegisterAttendeeViewModel
    {

        [Required]
        public string FirstName { get; set; }

        [Required]
        public string LastName { get; set; }

        public string Title { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }
    }
}