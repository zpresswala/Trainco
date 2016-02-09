using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using TPCTrainco.Umbraco.Extensions.Helpers;
using TPCTrainco.Umbraco.Extensions.Models;
using Umbraco.Core.Logging;
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
                using (var db = new americantraincoEntities())
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
                using (var db = new americantraincoEntities())
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
                using (var db = new americantraincoEntities())
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


        public static void EmailOrderConfirmations(CheckoutDetails checkout, REGISTRATION reg)
        {
            IEnumerable<IPublishedContent> emailTemplates = null;

            emailTemplates = Helpers.Nodes.Instance.SiteSettings.Children.FirstOrDefault(n => n.DocumentTypeAlias == "EmailTemplates").Children;

            if (emailTemplates != null)
            {
                IPublishedContent emailTemplateOrderConfirm = emailTemplates.Where(p => p.Name == "Order Confirm").FirstOrDefault();
                IPublishedContent emailTemplateOrderConfirmATI = emailTemplates.Where(p => p.Name == "Order Confirm ATI").FirstOrDefault();
                IPublishedContent emailTemplateOrderConfirmDetail = emailTemplates.Where(p => p.Name == "Order Seminar Details Template").FirstOrDefault();
                IPublishedContent emailTemplateOrderSummaryTemplate = emailTemplates.Where(p => p.Name == "Order Summary Template").FirstOrDefault();

                if (emailTemplateOrderConfirm != null && emailTemplateOrderConfirmATI != null && emailTemplateOrderConfirmDetail != null)
                {
                    Helpers.Email email = new Helpers.Email();

                    email.IsBodyHtml = true;

                    string fromOrderConfirm = emailTemplateOrderConfirm.GetProperty("emailFrom").Value.ToString();
                    string emailOrderConfirm = emailTemplateOrderConfirm.GetProperty("emailBody").Value.ToString();
                    string subjectOrderConfirm = emailTemplateOrderConfirm.GetProperty("emailSubject").Value.ToString();
                    string toAltOrderConfirm = emailTemplateOrderConfirm.GetProperty("emailToAlt").Value.ToString();

                    string fromOrderConfirmATI = emailTemplateOrderConfirmATI.GetProperty("emailFrom").Value.ToString();
                    string emailOrderConfirmATI = emailTemplateOrderConfirmATI.GetProperty("emailBody").Value.ToString();
                    string subjectOrderConfirmATI = emailTemplateOrderConfirmATI.GetProperty("emailSubject").Value.ToString();
                    string toAltOrderConfirmATI = emailTemplateOrderConfirm.GetProperty("emailToAlt").Value.ToString();

                    string emailDetailTemplate = emailTemplateOrderConfirmDetail.GetProperty("emailBody").Value.ToString();
                    string emailOrderSummaryTemplate = emailTemplateOrderSummaryTemplate.GetProperty("emailBody").Value.ToString();

                    // replace the email tags
                    emailOrderConfirm = ReplaceEmailTags(emailOrderConfirm, checkout, reg);
                    emailOrderConfirmATI = ReplaceEmailTags(emailOrderConfirmATI, checkout, reg);

                    string emailOrderAttendeeDetailsList = "";
                    string emailOrderSummaryList = "";
                    bool isCourseCancelling = false;







                    // Loop through attendees
                    foreach (temp_Reg tempReg in checkout.tempRegList)
                    {
                        string attendeeDetails = emailDetailTemplate;
                        string attendeeSummary = emailOrderSummaryTemplate;

                        SCHEDULE schedule = CacheObjects.GetScheduleList().Where(p => p.ScheduleID == tempReg.sem_SID).FirstOrDefault();

                        if (schedule != null && schedule.ScheduleStatus != null && schedule.ScheduleStatus > 0)
                        {
                            isCourseCancelling = true;
                        }

                        List<temp_Att> tempAttList = checkout.tempAttList.Where(p => p.reg_SEQ == tempReg.reg_SEQ).ToList();

                        if (tempAttList != null && tempAttList.Count > 0)
                        {
                            foreach (temp_Att tempAtt in tempAttList)
                            {
                                if (tempAtt != null)
                                {
                                    attendeeDetails = attendeeDetails.Replace("{{ATTENDEE}}", tempAtt.att_FName + " " + tempAtt.att_LName);
                                    attendeeDetails = attendeeDetails.Replace("{{FEE}}", string.Format("{0:C0}", tempReg.sem_FeeAmt));
                                    attendeeDetails = GenerateSeminarDetails(attendeeDetails, tempReg);

                                    emailOrderAttendeeDetailsList += attendeeDetails;

                                    string seminarTitle = tempReg.sem_SID.ToString() + ": <strong>" + tempReg.sem_Title + "</strong><br /> - " + tempReg.sem_Place + "  " + tempReg.sem_FeeName;

                                    attendeeSummary = attendeeSummary.Replace("{{SEMINAR_TITLE}}", seminarTitle);
                                    attendeeSummary = attendeeSummary.Replace("{{FULL_NAME}}", tempAtt.att_FName + " " + tempAtt.att_LName);
                                    attendeeSummary = attendeeSummary.Replace("{{PRICE}}", string.Format("{0:C0}", tempReg.sem_FeeAmt));

                                    emailOrderSummaryList += attendeeSummary;
                                }
                            }
                        }
                    }

                    emailOrderConfirm = emailOrderConfirm.Replace("{{DETAILINFO}}", emailOrderAttendeeDetailsList);
                    emailOrderConfirmATI = emailOrderConfirmATI.Replace("{{DETAILINFO}}", emailOrderAttendeeDetailsList);

                    emailOrderConfirm = emailOrderConfirm.Replace("{{ORDERSUMMARY}}", emailOrderSummaryList);
                    emailOrderConfirmATI = emailOrderConfirmATI.Replace("{{ORDERSUMMARY}}", emailOrderSummaryList);

                    if (true == isCourseCancelling)
                    {
                        string courseCancelling = "<div style=\"font-weight: bold; color: #800000; font-style: italic; text-align: center;\">";
                        courseCancelling += "** CLASS IS PENDING CANCELLATION **</div>";

                        emailOrderConfirmATI = emailOrderConfirmATI.Replace("{{XXMSG}}", courseCancelling);
                    }
                    else
                    {
                        emailOrderConfirmATI = emailOrderConfirmATI.Replace("{{XXMSG}}", "");
                    }

                    // Send email to Regsitrar
                    email.EmailFrom = fromOrderConfirm;
                    email.EmailToList = reg.RegAuthEmail.Split(';').ToList();
                    email.Subject = subjectOrderConfirm;
                    email.Body = emailOrderConfirm;

                    email.SendEmail();

                    // Send to billing email if different
                    if (reg.RegAuthEmail.Trim().ToLower() != reg.RegBillEmail.Trim().ToLower())
                    {
                        email.EmailToList = reg.RegBillEmail.Split(';').ToList();

                        email.SendEmail();
                    }

                    // Send to Admins
                    if (false == string.IsNullOrWhiteSpace(toAltOrderConfirmATI))
                    {
                        email.EmailFrom = fromOrderConfirmATI;
                        email.EmailToList = toAltOrderConfirmATI.Split(';').ToList();
                        email.Subject = (isCourseCancelling ? "** PENDING CANCELLATION **  " : "") + subjectOrderConfirmATI;
                        email.Body = emailOrderConfirmATI;

                        email.SendEmail();
                    }

                    if (true == isCourseCancelling && ConfigurationManager.AppSettings["Registration:CancelPendingEmail"] != null &&
                            ConfigurationManager.AppSettings.Get("Registration:CancelPendingEmail").Length > 0)
                    {
                        email.EmailFrom = fromOrderConfirmATI;
                        email.EmailToList = ConfigurationManager.AppSettings.Get("Registration:CancelPendingEmail").Split(';').ToList();
                        email.Subject = (isCourseCancelling ? "** PENDING CANCELLATION **  " : "") + subjectOrderConfirmATI;
                        email.Body = emailOrderConfirmATI;

                        email.SendEmail();
                    }
                }
            }
        }


        public static void EmailAttendeeConfirmations(CheckoutDetails checkout, REGISTRATION reg)
        {
            StringBuilder authText = new StringBuilder();

            if (checkout != null && reg != null)
            {
                IEnumerable<IPublishedContent> emailTemplates = null;

                emailTemplates = Helpers.Nodes.Instance.SiteSettings.Children.FirstOrDefault(n => n.DocumentTypeAlias == "EmailTemplates").Children;

                if (emailTemplates != null)
                {
                    IPublishedContent emailTemplateAttendeeConfirm = emailTemplates.Where(p => p.Name == "Order Attendee Confirm").FirstOrDefault();
                    IPublishedContent emailTemplateOrderConfirmDetail = emailTemplates.Where(p => p.Name == "Order Attendee Details").FirstOrDefault();

                    string emailAttendeeConfirm = emailTemplateAttendeeConfirm.GetProperty("emailBody").Value.ToString();
                    string fromtAttendeeConfirm = emailTemplateAttendeeConfirm.GetProperty("emailFrom").Value.ToString();
                    string toAltAttendeeConfirm = emailTemplateAttendeeConfirm.GetProperty("emailToAlt").Value.ToString();
                    string subjectAttendeeConfirm = emailTemplateAttendeeConfirm.GetProperty("emailSubject").Value.ToString();

                    string emailDetailTemplate = emailTemplateOrderConfirmDetail.GetProperty("emailBody").Value.ToString();

                    foreach (temp_Att tempAtt in checkout.tempAttList)
                    {
                        temp_Reg tempReg = checkout.tempRegList.Where(p => p.reg_SEQ == tempAtt.reg_SEQ).FirstOrDefault();
                        string attEmailBody = emailAttendeeConfirm;

                        attEmailBody = attEmailBody.Replace("{{NAME}}", tempAtt.att_FName + " " + tempAtt.att_LName);
                        attEmailBody = attEmailBody.Replace("{{TITLE}}", tempAtt.att_Title);
                        attEmailBody = attEmailBody.Replace("{{COMPANY}}", reg.RegCompanyName);
                        attEmailBody = attEmailBody.Replace("{{DATE}}", DateTime.Now.ToShortDateString());
                        attEmailBody = attEmailBody.Replace("{{TRANSNO}}", reg.RegistrationID.ToString());
                        attEmailBody = attEmailBody.Replace("{{DETAILINFO}}", GenerateSeminarDetails(emailDetailTemplate, tempReg));

                        // Send Email to Attendee
                        Helpers.Email email = new Helpers.Email();

                        if (false == string.IsNullOrEmpty(tempAtt.att_Email))
                        {
                            email.EmailFrom = fromtAttendeeConfirm;
                            email.Subject = subjectAttendeeConfirm;
                            email.Body = attEmailBody;
                            email.IsBodyHtml = true;
                            email.EmailToList = tempAtt.att_Email.Split(new[] { ';' }, StringSplitOptions.RemoveEmptyEntries).ToList();

                            email.SendEmail();
                        }

                        // Send email to Admins
                        if (false == string.IsNullOrWhiteSpace(toAltAttendeeConfirm))
                        {
                            Helpers.Email emailAdmin = new Helpers.Email();

                            emailAdmin.EmailFrom = fromtAttendeeConfirm;
                            emailAdmin.Subject = subjectAttendeeConfirm;
                            emailAdmin.Body = attEmailBody;
                            emailAdmin.IsBodyHtml = true;
                            emailAdmin.EmailToList = toAltAttendeeConfirm.Split(new[] { ';' }, StringSplitOptions.RemoveEmptyEntries).ToList();

                            emailAdmin.SendEmail();
                        }
                    }
                }
            }
        }


        private static string ReplaceEmailTags(string emailBody, CheckoutDetails checkout, REGISTRATION reg)
        {
            string output = emailBody;

            output = output.Replace("{{DOMAIN}}", HttpContext.Current.Request.Url.Authority);
            output = output.Replace("{{DATE}}", DateTime.Now.ToString("MMM dd, yyyy"));
            output = output.Replace("{{ORDERNO}}", reg.RegistrationID.ToString());
            output = output.Replace("{{ORDERNO}}", reg.RegistrationID.ToString());

            string authText = GenerateAuthDetails(checkout, reg);
            output = output.Replace("{{AUTHINFO}}", authText);

            string billingText = GenerateBillingDetails(checkout, reg);
            output = output.Replace("{{BILLINFO}}", billingText);

            string paymentInfo = GeneratePaymentDetails(checkout, reg);
            output = output.Replace("{{PAYMENTINFO}}", paymentInfo);

            output = output.Replace("{{ORDER_TOTAL}}", String.Format("{0:C0}", reg.RegOrderTotal ?? 0));

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



        private static string GenerateOrderDetails(CheckoutDetails checkout, REGISTRATION reg)
        {
            StringBuilder detailsText = new StringBuilder();

            if (checkout != null && reg != null)
            {
                foreach (temp_Reg tempReg in checkout.tempRegList)
                {

                }
            }


            return detailsText.ToString();
        }


        private static string GenerateSeminarDetailsList(string emailTemplate, CheckoutDetails checkout)
        {
            StringBuilder detailsText = new StringBuilder();

            if (checkout != null && checkout.tempCust != null)
            {
                foreach (temp_Reg tempReg in checkout.tempRegList)
                {
                    detailsText.AppendLine(GenerateSeminarDetails(emailTemplate, tempReg));
                }
            }


            return detailsText.ToString();
        }


        private static string GenerateSeminarDetails(string emailTemplate, temp_Reg tempReg)
        {
            StringBuilder detailsText = new StringBuilder();
            Carts cartsObj = new Carts();

            if (true == string.IsNullOrEmpty(emailTemplate))
            {
                cartsObj.SendCheckoutErrorEmail("GenerateSeminarDetails: emailTemplate = NULL or Empty");

                return null;
            }

            if (tempReg != null)
            {
                SCHEDULE schedule = Objects.CacheObjects.GetScheduleList().Where(p => p.ScheduleID == tempReg.sem_SID).First();
                ScheduleCourseInstructor schCourse = Objects.CacheObjects.GetScheduleCourseList().Where(p => p.ScheduleID == tempReg.sem_SID).FirstOrDefault();
                Location location = Objects.CacheObjects.GetLocationList().Where(p => p.LocationID == schedule.LocationID).FirstOrDefault();
                COURS course = Objects.CacheObjects.GetCourseList().Where(p => p.CourseID == schCourse.CourseID).FirstOrDefault();

                string tempStr = emailTemplate;

                tempStr = tempStr.Replace("{{SEMINAR}}", tempReg.sem_SID + ": " + tempReg.sem_Title + " - " + tempReg.sem_Place + " " + tempReg.sem_FeeName);

                if (course != null)
                {
                    tempStr = tempStr.Replace("{{TIME}}", course.CourseTimes);
                }

                IPublishedContent searchSeminarNode = null;
                string defaultSearchLocationText = "";

                searchSeminarNode = Nodes.Instance.SeminarSearch;

                if (searchSeminarNode.GetProperty("locationMessage").HasValue)
                {
                    defaultSearchLocationText = searchSeminarNode.GetProperty("locationMessage").Value.ToString();
                }

                if (location != null && false == string.IsNullOrEmpty(location.LocationNotes))
                {
                    tempStr = tempStr.Replace("{{LOCATION}}", FixLocationNotes(location.LocationNotes));
                }
                else
                {
                    tempStr = tempStr.Replace("{{LOCATION}}", defaultSearchLocationText);
                }

                detailsText.AppendLine(tempStr);
            }
            else
            {
                cartsObj.SendCheckoutErrorEmail("GenerateSeminarDetails: tempReg = NULL");

                return null;
            }


            return detailsText.ToString();
        }


        private static string FixLocationNotes(string locationNotes)
        {
            string output = "";

            if (false == string.IsNullOrEmpty(locationNotes))
            {
                output = locationNotes;

                output = output.Replace("</ul>", "</ul><br />" + Environment.NewLine);
                output = output.Replace(Environment.NewLine, "<br />" + Environment.NewLine);
                output = output.Replace("\n\r", "<br />" + Environment.NewLine);
                output = output.Replace("\"", "&quot;");
            }

            return output;
        }
    }
}

