using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using TPCTrainco.Umbraco.Extensions;
using Umbraco.Core;
using Umbraco.Core.Logging;
using Umbraco.Forms.Core;
using Umbraco.Forms.Core.Enums;
using Umbraco.Forms.Data.Storage;
using Umbraco.Forms.Web.Services;

namespace TPCTrainco.Umbraco.App_Code
{
    public class FormWorkflowTPC : WorkflowType
    {
        public FormWorkflowTPC()
        {
            this.Id = Guid.Parse("89E46D3E-2423-4E69-B256-04C2E8DCA064");
            this.Name = "Add to ATI Database";
            this.Description = "Add the form data to the ATI database";
        }

        public override WorkflowExecutionStatus Execute(Record record, RecordEventArgs e)
        {
            // first we log it
            LogHelper.Info(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType, "the IP " + record.IP + " has submitted a record");
            // we can then iterate through the fields
            try
            {
                WebSignup webSignup = new WebSignup();

                webSignup.Referrer = "ATI Website";
                webSignup.PreferredContact = "Email";
                webSignup.rcd_Date = DateTime.Now;
                webSignup.OptIN = 0;
                string interest = "";
                string numTrainees = "";

                foreach (RecordField rf in record.RecordFields.Values)
                {
                    //List<object> vals = rf.Values;

                    if (rf.Alias == "firstName" || rf.Alias == "name")
                    {
                        webSignup.FirstName = rf.ValuesAsString();
                    }
                    else if (rf.Alias == "lastName")
                    {
                        webSignup.LastName = rf.ValuesAsString();
                    }
                    else if (rf.Alias == "email")
                    {
                        webSignup.Email = rf.ValuesAsString();
                    }
                    else if (rf.Alias == "company")
                    {
                        webSignup.CompanyName = rf.ValuesAsString();
                    }
                    else if (rf.Alias == "phone")
                    {
                        webSignup.Phone = TPCTrainco.Umbraco.Extensions.Helpers.StringUtilities.FormatPhoneNumber(rf.ValuesAsString());
                    }
                    else if (rf.Alias == "subjectOfInterest")
                    {
                        interest = "Subject: " + rf.ValuesAsString();
                    }
                    else if (rf.Alias == "pleaseSendMeInformationThroughTheMail")
                    {
                        webSignup.PreferredContact += " Mail";
                    }
                    else if (rf.Alias == "mailingAddress")
                    {
                        webSignup.Address1 = rf.ValuesAsString();
                    }
                    else if (rf.Alias == "mailingAddressLine2")
                    {
                        webSignup.Address2 = rf.ValuesAsString();
                    }
                    else if (rf.Alias == "city")
                    {
                        webSignup.City = rf.ValuesAsString();
                    }
                    else if (rf.Alias == "stateProvince" || rf.Alias == "state")
                    {
                        webSignup.State = rf.ValuesAsString();
                    }
                    else if (rf.Alias == "postalCode")
                    {
                        webSignup.Zipcode = rf.ValuesAsString();
                    }
                    else if (rf.Alias == "country")
                    {
                        string country = rf.ValuesAsString();

                        if (country.IndexOf("United States") >= 0)
                        {
                            country = "US";
                        }
                        else if (country.IndexOf("Canada") >= 0)
                        {
                            country = "CA";
                        }

                        webSignup.Country = country;

                    }
                    else if (rf.Alias == "ofTrainees")
                    {
                        numTrainees = rf.ValuesAsString();
                    }

                    else if (rf.Alias == "howDidYouHearAboutUs")
                    {
                        webSignup.PromoType = rf.ValuesAsString();
                    }
                    else if (rf.Alias == "promoCode")
                    {
                        webSignup.PromoCode = rf.ValuesAsString();
                    }
                }

                if (false == string.IsNullOrWhiteSpace(interest))
                {
                    webSignup.Interest = interest;

                    if (false == string.IsNullOrWhiteSpace(numTrainees))
                    {
                        webSignup.Interest += Environment.NewLine + "# People: " + numTrainees;
                    }
                }

                using (var db = new ATI_DevelopmentEntities1())
                {
                    db.WebSignups.Add(webSignup);
                    db.SaveChanges();
                }

            }
            catch (Exception ex)
            {
                return WorkflowExecutionStatus.Failed;
            }
            //webSignup.Phone = "";
            //webSignup.Email = "";
            //webSignup.Interest = "Subject: ";
            //webSignup.PromoType = "";
            //webSignup.PromoCode = "";


            //// If we altered a field, we can save it using the record storage
            //RecordStorage store = new RecordStorage();
            //store.UpdateRecord(record, e.Form);
            //store.Dispose();

            //// we then invoke the recordservice which handles all record states //and make the service delete the record.
            //RecordService rs = new RecordService();
            //rs.Delete(record, e.Form);
            ////rs.Dispose(record, e.Form);

            return WorkflowExecutionStatus.Completed;
        }

        public override List<Exception> ValidateSettings()
        {
            List<Exception> exceptions = new List<Exception>();

            //if you have any settings, validate them here

            return exceptions;
        }
    }
}