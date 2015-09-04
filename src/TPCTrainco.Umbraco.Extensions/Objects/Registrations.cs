using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TPCTrainco.Umbraco.Extensions.Models;
using Umbraco.Core.Models;

namespace TPCTrainco.Umbraco.Extensions.Objects
{
    public class Registrations
    {
        public static REGISTRATION GetRegistrationByCartId(int cartId)
        {
            REGISTRATION reg = null;

            if (cartId > 0)
            {
                using (var db = new ATI_DevelopmentEntities1())
                {
                    reg = db.REGISTRATIONS.Where(p => p.CartID == cartId).FirstOrDefault();
                }
            }

            return reg;
        }


        public static REGISTRATION GetRegistrationById(int registrationId)
        {
            REGISTRATION reg = null;

            if (registrationId > 0)
            {
                using (var db = new ATI_DevelopmentEntities1())
                {
                    reg = db.REGISTRATIONS.Where(p => p.RegistrationID == registrationId).FirstOrDefault();
                }
            }

            return reg;
        }


        public static REGISTRATION AddRegistrationByTempCart(int regId)
        {
            REGISTRATION reg = null;

            if (regId > 0)
            {
                using (var db = new ATI_DevelopmentEntities1())
                {
                    int? registraionId = db.add_Registration(regId).SingleOrDefault();

                    if (registraionId != null && registraionId > 0)
                    {
                        reg = GetRegistrationById(registraionId ?? 0);
                    }

                    reg = db.REGISTRATIONS.Where(p => p.CartID == regId).FirstOrDefault();
                }
            }

            return reg;
        }


        public static void EmailConfirmations(CheckoutDetails checkout, REGISTRATION reg)
        {
            IEnumerable<IPublishedContent> emailTemplates = null;

            emailTemplates = Helpers.Nodes.Instance.SiteSettings.Children.FirstOrDefault(n => n.DocumentTypeAlias == "EmailTemplates").Children;

            if (emailTemplates != null)
            {
                IPublishedContent emailTemplateOrderConfirm = emailTemplates.Where(p => p.Name == "Order Confirm").FirstOrDefault();
                IPublishedContent emailTemplateOrderConfirmATI = emailTemplates.Where(p => p.Name == "Order Confirm ATI").FirstOrDefault();
                IPublishedContent emailTemplateOrderConfirmDetail = emailTemplates.Where(p => p.Name == "Order Confirm Seminar Detail").FirstOrDefault();



                if (emailTemplateOrderConfirm != null && emailTemplateOrderConfirmATI != null && emailTemplateOrderConfirmDetail != null)
                {
                    Helpers.Email email = new Helpers.Email();

                    email.EmailFrom = emailTemplateOrderConfirm.GetProperty("emailFrom").Value.ToString();
                    email.EmailToList = emailTemplateOrderConfirm.GetProperty("emailToAlt").Value.ToString().Split(';').ToList();
                    email.Subject = emailTemplateOrderConfirm.GetProperty("emailSubject").Value.ToString();
                    email.IsBodyHtml = true;

                    string emailOrderConfirm = emailTemplateOrderConfirm.GetProperty("emailBody").Value.ToString();
                    string emailOrderConfirmATI = emailTemplateOrderConfirmATI.GetProperty("emailBody").Value.ToString();
                    string emailDetailTemplate = emailTemplateOrderConfirmDetail.GetProperty("emailBody").Value.ToString();

                    // replace the email tags
                    emailOrderConfirm = ReplaceEmailTags(emailOrderConfirm, checkout, reg);
                    emailOrderConfirmATI = ReplaceEmailTags(emailOrderConfirmATI, checkout, reg);



                    //email.Body = body;
                }

            }
        }


        private static string ReplaceEmailTags(string emailBody, CheckoutDetails checkout, REGISTRATION reg)
        {
            string output = emailBody;

            output = output.Replace("{{DATE}}", DateTime.Now.ToString("MMM dd, yyyy"));
            output = output.Replace("{{ORDERNO}}", reg.RegistrationID.ToString());
            output = output.Replace("{{ORDERNO}}", reg.RegistrationID.ToString());

            string authText = GenerateAuthDetails(checkout, reg);
            output = output.Replace("{{AUTHINFO}}", authText);

            string billingText = GenerateBillingDetails(checkout, reg);
            output = output.Replace("{{BILLINFO}}", billingText);

            string paymentInfo = GeneratePaymentDetails(checkout, reg);
            output = output.Replace("{{PAYMENTINFO}}", paymentInfo);

            return output;
        }


        private static string GenerateAuthDetails(CheckoutDetails checkout, REGISTRATION reg)
        {
            StringBuilder authText = new StringBuilder();

            if (checkout != null && reg != null)
            {
                authText.AppendLine(reg.RegAuthFirstName + " " + reg.RegAuthLastName + "<br />");
                if (false == string.IsNullOrEmpty(reg.RegAuthTitle))
                {
                    authText.AppendLine(reg.RegAuthTitle + "<br />");
                }
                if (false == string.IsNullOrEmpty(reg.RegCompanyName))
                {
                    authText.AppendLine(reg.RegCompanyName + "<br />");
                }
                if (false == string.IsNullOrEmpty(reg.RegAuthMailCode))
                {
                    authText.AppendLine("Mail Code: " + reg.RegAuthMailCode + "<br />");
                }
                authText.AppendLine(reg.RegAuthAddress1 + "<br />");
                if (false == string.IsNullOrEmpty(reg.RegAuthAddress2))
                {
                    authText.AppendLine(reg.RegAuthAddress2 + "<br />");
                }
                authText.AppendLine(reg.RegAuthCity + ", " + checkout.tempCust.authState + " " + reg.RegAuthZipcode + "<br />");
                authText.AppendLine(checkout.tempCust.authCountry + "<br />");

                authText.AppendLine("Phone: " + reg.RegAuthPhone);
                if (false == string.IsNullOrEmpty(reg.RegAuthPhoneExt))
                {
                    authText.AppendLine(" Ext: " + reg.RegAuthPhoneExt);
                }
                authText.AppendLine("<br />");

                if (false == string.IsNullOrEmpty(reg.RegAuthFax))
                {
                    authText.AppendLine("Fax: " + reg.RegAuthFax + "<br />");
                }
                authText.AppendLine("Email: " + reg.RegAuthEmail);
            }

            return authText.ToString();
        }


        private static string GenerateBillingDetails(CheckoutDetails checkout, REGISTRATION reg)
        {
            StringBuilder billText = new StringBuilder();

            if (checkout != null && reg != null)
            {
                billText.AppendLine(reg.RegBillFirstName + " " + reg.RegBillLastName + "<br />");
                if (false == string.IsNullOrEmpty(reg.RegBillTitle))
                {
                    billText.AppendLine(reg.RegBillTitle + "<br />");
                }
                if (false == string.IsNullOrEmpty(reg.RegCompanyName))
                {
                    billText.AppendLine(reg.RegCompanyName + "<br />");
                }
                if (false == string.IsNullOrEmpty(reg.RegBillMailCode))
                {
                    billText.AppendLine("Mail Code: " + reg.RegBillMailCode + "<br />");
                }
                billText.AppendLine(reg.RegBillAddress1 + "<br />");
                if (false == string.IsNullOrEmpty(reg.RegBillAddress2))
                {
                    billText.AppendLine(reg.RegBillAddress2 + "<br />");
                }
                billText.AppendLine(reg.RegBillCity + ", " + checkout.tempCust.authState + " " + reg.RegBillZipcode + "<br />");
                billText.AppendLine(checkout.tempCust.authCountry + "<br />");

                billText.AppendLine("Phone: " + reg.RegBillPhone);
                if (false == string.IsNullOrEmpty(reg.RegBillPhoneExt))
                {
                    billText.AppendLine(" Ext: " + reg.RegBillPhoneExt);
                }
                billText.AppendLine("<br />");

                if (false == string.IsNullOrEmpty(reg.RegBillFax))
                {
                    billText.AppendLine("Fax: " + reg.RegBillFax + "<br />");
                }
                billText.AppendLine("Email: " + reg.RegBillEmail);
            }

            return billText.ToString();
        }


        private static string GeneratePaymentDetails(CheckoutDetails checkout, REGISTRATION reg)
        {
            StringBuilder paymentText = new StringBuilder();

            if (checkout != null && reg != null)
            {
                paymentText.AppendLine("Payment Method: " + checkout.tempCust.payMethod + "<br />");

                if (checkout.tempCust.payMethod == "Credit Card")
                {
                    paymentText.AppendLine("CC Type: " + checkout.tempCust.ccType + "<br />");
                    paymentText.AppendLine("CC Number: ****-****-****-" + checkout.tempCust.ccNumber + "<br />");
                    paymentText.AppendLine("CC Expire: **/**<br />");
                    paymentText.AppendLine("CC Expire: **/**<br />");
                }
                else
                {
                    if (false == string.IsNullOrEmpty(reg.RegBillPONumber))
                    {
                        paymentText.AppendLine("PO Number: " + reg.RegBillPONumber + "<br />");
                    }
                }
            }

            return paymentText.ToString();
        }

    }
}

