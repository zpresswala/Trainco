using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TPCTrainco.Umbraco.Extensions.Models
{
    public class CheckoutCustomer
    {
        public int RegId { get; set; }

        [Required]
        [StringLength(255)]
        public string Company { get; set; }

        [Required]
        [StringLength(255)]
        public string FirstName { get; set; }

        [Required]
        [StringLength(255)]
        public string LastName { get; set; }

        [Required]
        [StringLength(255)]
        public string Address { get; set; }

        [StringLength(255)]
        public string Address2 { get; set; }

        [Required]
        [StringLength(255)]
        public string City { get; set; }

        [Required]
        [StringLength(3)]
        public string State { get; set; }

        [Required]
        [StringLength(12)]
        public string Zip { get; set; }

        [Required]
        [StringLength(3)]
        public string Country { get; set; }

        [Required]
        [DataType(DataType.PhoneNumber)]
        public string Phone { get; set; }

        [Required]
        [DataType(DataType.EmailAddress)]
        public string Email { get; set; }

        public string HearAbout { get; set; }
        public string PromoCode { get; set; }

        [Required]
        [StringLength(255)]
        public string BillFirstName { get; set; }

        [Required]
        [StringLength(255)]
        public string BillLastName { get; set; }

        [Required]
        [StringLength(255)]
        public string BillAddress { get; set; }

        [StringLength(255)]
        public string BillAddress2 { get; set; }

        [Required]
        [StringLength(255)]
        public string BillCity { get; set; }

        [Required]
        [StringLength(3)]
        public string BillState { get; set; }

        [Required]
        [DataType(DataType.PostalCode)]
        [StringLength(12)]
        public string BillZip { get; set; }

        [Required]
        [StringLength(3)]
        public string BillCountry { get; set; }

        public string PaymentType { get; set; }

        [Required]
        [StringLength(255)]
        public string CCName { get; set; }

        [Required]
        [StringLength(20)]
        public string CCNumber { get; set; }

        [Required]
        [StringLength(7)]
        public string CCExpiration { get; set; }

        [Required]
        [StringLength(4)]
        public string CVVCode { get; set; }


    }
}
