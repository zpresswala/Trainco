using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TPCTrainco.Umbraco.Extensions.Models
{
    public class CheckoutItem
    {
        [Required]
        public int SeminarId { get; set; }

        [Required]
        public short AttendeeNum { get; set; }

        [Required]
        public int AttendeeInc { get; set; }

        [Required(ErrorMessage = "First name is required.")]
        [StringLength(255)]
        public string FirstName { get; set; }

        [Required(ErrorMessage = "Last name is required.")]
        [StringLength(255)]
        public string LastName { get; set; }

        [StringLength(255)]
        public string Title { get; set; }

        [EmailAddress(ErrorMessage = "Invalid email address.")]
        [StringLength(255)]
        public string Email { get; set; }
    }
}
