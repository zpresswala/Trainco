using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Web.Security;
using TPCTrainco.Umbraco.Extensions.Attributes;
using TPCTrainco.Umbraco.Extensions.Helpers;
using TPCTrainco.Umbraco.Extensions.Models.Account;
using TPCTrainco.Umbraco.Extensions.Models.API.Request;
using TPCTrainco.Umbraco.Extensions.Models.API.Response;
using TPCTrainco.Umbraco.Extensions.Objects;
using Umbraco.Core;
using Umbraco.Core.Models;
using Umbraco.Web;

namespace TPCTrainco.Umbraco.Extensions.Controllers
{
    public class TPCTraincoMembersController : ApiController
    {
        [HttpGet]
        public HttpResponseMessage Export(string auth)
        {
            var responseMessage = new {
                Success = true,
                Message = "Member export complete."
            };

            if (auth.ToLower() != ConfigurationManager.AppSettings.Get("Member:ApiKey").ToLower())
            {
                //CacheMessage.Message = "Invalid Key";
                //return CacheMessage;
            }

            try
            {
                using (var db = new americantraincoEntities())
                {
                    var webAccounts = db.WebAccounts.ToList();

                    var members = ApplicationContext.Current.Services.MemberService.GetAllMembers();

                    var isNew = false;
                    foreach (var member in members)
                    {
                        WebAccount webAccount = webAccounts.FirstOrDefault(wa => wa.EmailAddress == member.Email);
                        if (webAccount == null)
                        {
                            webAccount = new WebAccount();
                            isNew = true;
                        }

                        webAccount.Updated = DateTime.Now;
                        webAccount.EmailAddress = member.Email;
                        webAccount.FirstName = member.GetValue<string>("firstName");
                        webAccount.LastName = member.GetValue<string>("lastName");
                        webAccount.Title = member.GetValue<string>("title");
                        webAccount.PhoneNumber = member.GetValue<string>("phone");
                        webAccount.PhoneExtension = member.GetValue<string>("phoneExtension");
                        webAccount.CompanyName = member.GetValue<string>("companyName");
                        webAccount.AddressLn1 = member.GetValue<string>("address1");
                        webAccount.AddressLn2 = member.GetValue<string>("address2");
                        webAccount.Country = member.GetValue<string>("country");
                        webAccount.StateProvince = member.GetValue<string>("state");
                        webAccount.PostalCode = member.GetValue<string>("postalCode");
                        webAccount.City = member.GetValue<string>("city");
                        webAccount.PriorCustomer = member.GetValue<string>("hasMakePreviousPurchase");
                        webAccount.Industry = member.GetValue<string>("industry");
                        webAccount.OutsideTrainingFrequency = member.GetValue<string>("extentalTrianingUsageAmount");
                        webAccount.NbrEmplforTraining = member.GetValue<string>("numberOfEmployees");
                        webAccount.TrainingTopics = member.GetValue<string>("trainingTopics");

                        if (isNew)
                        {
                            webAccount.Created = DateTime.Now;
                            db.WebAccounts.Add(webAccount);
                        }

                        isNew = false;
                    }

                    db.SaveChanges();

                }
            }
            catch (Exception ex)
            {
                responseMessage = new
                {
                    Success = false,
                    Message = "ERROR: " + ex.Message + " | " + ex.InnerException
                };
            }

            return Request.CreateResponse(System.Net.HttpStatusCode.OK, responseMessage);
        }
    }
}
