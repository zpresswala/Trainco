using Foolproof;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TPCTrainco.Umbraco.Extensions.Objects;

namespace TPCTrainco.Umbraco.Extensions.Models
{
    public class CheckoutCustomer
    {
        public int RegId { get; set; }

        [Required]
        [StringLength(255)]
        [DisplayName("First Name")]
        public string FirstName { get; set; }

        [Required]
        [StringLength(255)]
        [DisplayName("Last Name")]
        public string LastName { get; set; }

        [StringLength(255)]
        public string Company { get; set; }

        [StringLength(255)]
        public string Title { get; set; }

        [Required]
        [StringLength(255)]
        public string Address { get; set; }

        [StringLength(255)]
        [DisplayName("Address 2")]
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
        [RegularExpression(@"\(?\d{3}\)?-? *\d{3}-? *-?\d{4}", ErrorMessage = "Please use the format xxx-xxx-xxxx.")]
        public string Phone { get; set; }

        public string PhoneExt { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        public string HearAbout { get; set; }

        public string HearAboutOther { get; set; }

        public string PromoCode { get; set; }

        public bool BillingDifferent { get; set; }

        [RequiredIfTrue("BillingDifferent")]
        [StringLength(255)]
        [DisplayName("Billing First Name")]
        public string BillFirstName { get; set; }

        [RequiredIfTrue("BillingDifferent")]
        [StringLength(255)]
        [DisplayName("Billing Last Name")]
        public string BillLastName { get; set; }

        [RequiredIfTrue("BillingDifferent")]
        [StringLength(255)]
        [DisplayName("Billing Address")]
        public string BillAddress { get; set; }

        [StringLength(255)]
        [DisplayName("Billing Address 2")]
        public string BillAddress2 { get; set; }

        [RequiredIfTrue("BillingDifferent")]
        [StringLength(255)]
        [DisplayName("Billing City")]
        public string BillCity { get; set; }

        [RequiredIfTrue("BillingDifferent")]
        [StringLength(3)]
        [DisplayName("Billing State")]
        public string BillState { get; set; }

        [RequiredIfTrue("BillingDifferent")]
        [DataType(DataType.PostalCode)]
        [StringLength(12)]
        [DisplayName("Billing Postal Code")]
        public string BillZip { get; set; }

        [RequiredIfTrue("BillingDifferent", ErrorMessage = "Billing Country is required.")]
        [StringLength(3)]
        [DisplayName("Billing Country")]
        public string BillCountry { get; set; }

        [DisplayName("Credit Card Payment")]
        public string PaymentType { get; set; }

        [RequiredIf("PaymentType", "credit", ErrorMessage = "Credit Card Name is required.")]
        [StringLength(255)]
        [DisplayName("Credit Card Name")]
        public string CCName { get; set; }

        [RequiredIf("PaymentType", "credit", ErrorMessage = "Credit Card Number is required.")]
        [CreditCard]
        [DisplayName("Credit Card Number")]
        public string CCNumber { get; set; }

        [RequiredIf("PaymentType", "credit", ErrorMessage = "Credit Card Expiration is required.")]
        [RegularExpression(@"([\d]{1,2}/[\d]{2,4})", ErrorMessage = "Invalid. Use MM/YY")]
        [DisplayName("Credit Card Expiration")]
        public string CCExpiration { get; set; }

        [RequiredIf("PaymentType", "credit", ErrorMessage = "Credit Card CVVV Code is required.")]
        [RegularExpression(@"\A\d{3,4}\Z", ErrorMessage = "CVV must be between 3 - 4 digits long.")]
        [DisplayName("Credit Card CVV")]
        public string CVVCode { get; set; }

        public string PONumber { get; set; }
    }
}
