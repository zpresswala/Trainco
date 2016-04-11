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

        public string CartGuid { get; set; }

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

        [StringLength(200)]
        public string Country { get; set; }

        [Required]
        [RegularExpression(@"\(?\d{3}\)?-? *\d{3}-? *-?\d{4}", ErrorMessage = "Please enter a valid phone number. Dashes are optional.")]
        public string Phone { get; set; }

        public string PhoneExt { get; set; }

        [Required]
        [RegularExpression(@"^(?("")("".+?(?<!\\)""@)|(([0-9a-zA-Z]((\.(?!\.))|[-!#\$%&'\*/=\?\^`\{\}\|~\w])*)(?<=[0-9a-zA-Z])@))(?(\[)(\[(\d{1,3}\.){3}\d{1,3}\])|(([0-9a-zA-Z][-\w]*[0-9a-zA-Z]*\.)+[a-zA-Z0-9][\-a-zA-Z0-9]{0,22}[a-zA-Z0-9]))$", ErrorMessage = "Email address is invalid.")]
        public string Email { get; set; }

        public string HearAbout { get; set; }

        public string HearAboutOther { get; set; }

        public string PromoCode { get; set; }

        public bool BillingDifferent { get; set; }

        [RequiredIfTrue("BillingDifferent", ErrorMessage = "Billing First Name is required.")]
        [StringLength(255)]
        [DisplayName("Billing First Name")]
        public string BillFirstName { get; set; }

        [RequiredIfTrue("BillingDifferent", ErrorMessage = "Billing Last Name is required.")]
        [StringLength(255)]
        [DisplayName("Billing Last Name")]
        public string BillLastName { get; set; }

        [RequiredIfTrue("BillingDifferent", ErrorMessage = "Billing Address is required.")]
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

        [RequiredIfTrue("BillingDifferent", ErrorMessage = "Billing State is required.")]
        [StringLength(3)]
        [DisplayName("Billing State")]
        public string BillState { get; set; }

        [RequiredIfTrue("BillingDifferent", ErrorMessage = "Billing Postal Code is required.")]
        [DataType(DataType.PostalCode)]
        [StringLength(12)]
        [DisplayName("Billing Postal Code")]
        public string BillZip { get; set; }

        [StringLength(250)]
        [DisplayName("Billing Country")]
        public string BillCountry { get; set; }

        [RequiredIfTrue("BillingDifferent", ErrorMessage = "Billing Phone Number is required.")]
        [RegularExpression(@"\(?\d{3}\)?-? *\d{3}-? *-?\d{4}", ErrorMessage = "Please enter a valid phone number. Dashes are optional.")]
        public string BillPhone { get; set; }

        public string BillPhoneExt { get; set; }

        [RequiredIfTrue("BillingDifferent", ErrorMessage = "Billing Email is required.")]
        [RegularExpression(@"^(?("")("".+?(?<!\\)""@)|(([0-9a-z]((\.(?!\.))|[-!#\$%&'\*/=\?\^`\{\}\|~\w])*)(?<=[0-9a-z])@))(?(\[)(\[(\d{1,3}\.){3}\d{1,3}\])|(([0-9a-z][-\w]*[0-9a-z]*\.)+[a-z0-9][\-a-z0-9]{0,22}[a-z0-9]))$", ErrorMessage = "Email address is invalid.")]
        public string BillEmail { get; set; }

        [DisplayName("Payment Type")]
        [Required]
        public string PaymentType { get; set; }

        [RequiredIf("PaymentType", "credit", ErrorMessage = "Credit Card Name is required.")]
        [StringLength(255)]
        [DisplayName("Credit Card Name")]
        public string CCName { get; set; }

        [RequiredIf("PaymentType", "credit", ErrorMessage = "Credit Card Number is required.")]
        [CreditCard(ErrorMessage = "Invalid credit card. Please enter the number. Dashes or spaces are optional.")]
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
