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

                
                if (emailTemplateOrderConfirm != null)
                {
                    Helpers.Email email = new Helpers.Email();

                    email.EmailFrom = emailTemplateOrderConfirm.GetProperty("emailFrom").Value.ToString();
                    email.EmailToList = emailTemplateOrderConfirm.GetProperty("emailToAlt").Value.ToString().Split(';').ToList();
                    email.Subject = emailTemplateOrderConfirm.GetProperty("emailSubject").Value.ToString();
                    email.IsBodyHtml = true;

                    string body = emailTemplateOrderConfirm.GetProperty("emailBody").Value.ToString();

                    email.Body = body;
                }

            }
        }




    }
}
