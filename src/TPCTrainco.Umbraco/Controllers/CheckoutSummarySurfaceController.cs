using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Mvc;
using TPCTrainco.Umbraco.Extensions;
using TPCTrainco.Umbraco.Extensions.Models;
using TPCTrainco.Umbraco.Extensions.Objects;
using Umbraco.Web.Mvc;

namespace TPCTrainco.Umbraco.Controllers
{
    public class CheckoutSummarySurfaceController : SurfaceController
    {
        public ActionResult Index()
        {
            CheckoutDetails checkoutDetails = new CheckoutDetails();
            List<temp_Reg> tempRegList = null;
            List<temp_Att> tempAttList = null;
            string cartGuid = null;

            if (Session["CartId"] != null && Session["CartId"].ToString().Length > 0)
            {
                cartGuid = Session["CartId"].ToString().ToLower();

                Carts cartsObj = new Carts();

                tempRegList = cartsObj.GetCart(cartGuid);

                if (tempRegList == null)
                {
                    return PartialView("CheckoutSummary", checkoutDetails);
                }
                else
                {
                    Session["CartId"] = cartGuid;

                    temp_Cust tempCust = null;

                    using (var db = new americantraincoEntities())
                    {
                        int regId = tempRegList[0].reg_ID;

                        tempCust = db.temp_Cust.Where(p => p.reg_ID == regId).FirstOrDefault();
                        tempAttList = db.temp_Att.Where(p => p.reg_ID == regId).ToList();

                        if (tempCust != null && tempAttList != null && tempAttList.Count > 0)
                        {
                            checkoutDetails.tempRegList = tempRegList;
                            checkoutDetails.tempAttList = tempAttList;
                            checkoutDetails.tempCust = tempCust;
                        }
                    }

                    return PartialView("CheckoutSummary", checkoutDetails);
                }
            }
            else
            {
                return PartialView("CheckoutSummary", checkoutDetails);
            }


        }


        [HttpPost]
        public ActionResult HandleFormSubmit(CheckoutDetails model)
        {
            Carts cartsObj = new Carts();

            if (false == ModelState.IsValid)
            {
                return CurrentUmbracoPage();
            }
            else
            {
                CheckoutDetails checkoutDetails = new CheckoutDetails();
                List<temp_Reg> tempRegList = null;
                List<temp_Att> tempAttList = null;
                string cartGuid = null;

                if (Session["CartId"] != null && Session["CartId"].ToString().Length > 0)
                {
                    cartGuid = Session["CartId"].ToString().ToLower();

                    tempRegList = cartsObj.GetCart(cartGuid);

                    if (tempRegList == null)
                    {
                        cartsObj.SendCartErrorEmail("ERROR: 94\n\rtempRegList == null");

                        return Redirect("/search-seminars/?error=94");
                    }
                    else
                    {
                        Session["CartId"] = cartGuid;
                    }
                }

                if (tempRegList != null)
                {
                    try
                    {
                        Session["CartId"] = cartGuid;

                        temp_Cust tempCust = null;

                        using (var db = new americantraincoEntities())
                        {
                            int regId = tempRegList[0].reg_ID;
                            CheckoutBilling checkoutBilling = null;
                            CreditCardResult creditCardResult = null;
                            REGISTRATION reg = null;

                            tempCust = db.temp_Cust.Where(p => p.reg_ID == regId).FirstOrDefault();
                            tempAttList = db.temp_Att.Where(p => p.reg_ID == regId).ToList();

                            checkoutBilling = (CheckoutBilling)Session["CartBilling"];

                            if (tempCust != null && tempAttList != null && tempAttList.Count > 0)
                            {
                                checkoutDetails.tempRegList = tempRegList;
                                checkoutDetails.tempAttList = tempAttList;
                                checkoutDetails.tempCust = tempCust;

                                bool isError = false;
                                bool isAlreadyProcessed = false;

                                

                                // check for CC already processed: [isCardProcessed()] true -> Success page
                                if (tempCust.payMethod == "Credit Card" && checkoutBilling != null)
                                {
                                    // card processed already?
                                    isAlreadyProcessed = cartsObj.CreditCardAlreadyProcessed(tempCust);

                                    // not process, charge credit card
                                    if (false == isAlreadyProcessed)
                                    {
                                        creditCardResult = cartsObj.ProcessCreditCard(checkoutDetails, checkoutBilling);
                                        isError = creditCardResult.ErrorCode != 0;
                                    }
                                }
                                else
                                {
                                    // check for duplicate
                                    reg = Registrations.GetRegistrationByCartId(tempCust.reg_ID ?? 0);

                                    if (reg != null)
                                    {
                                        isAlreadyProcessed = true;
                                    }
                                }

                                if (true == isError)
                                {
                                    cartsObj.AddToTempError(tempCust, creditCardResult);
                                    cartsObj.SendCreditCardErrorEmail(tempCust, creditCardResult);

                                    return Redirect("/register/summary/?error=cc");
                                }
                                else
                                {
                                    if (true == isAlreadyProcessed)
                                    {
                                        Session["RegistrationId"] = reg.RegistrationID;
                                        return Redirect("/register/success/");
                                    }
                                    else
                                    {
                                        // convert temp to registration
                                        reg = Registrations.AddRegistrationByTempCart(tempCust.reg_ID ?? 0);

                                        if (reg != null && reg.RegistrationID > 0)
                                        {
                                            Session["RegistrationId"] = reg.RegistrationID;
                                            Session["RegistrationTotal"] = (reg.RegOrderTotal ?? 0).ToString("G");

                                            // Email Registrar and Billing
                                            Registrations.EmailOrderConfirmations(checkoutDetails, reg);

                                            // Email Attendees
                                            Registrations.EmailAttendeeConfirmations(checkoutDetails, reg);

                                            return Redirect("/register/success/");
                                        }
                                        else
                                        {
                                            // registration wasn't created
                                            cartsObj.SendCartErrorEmail("ERROR: 90\n\rregistration wasn't created: (reg == null || reg.RegistrationID <= 0)");

                                            return Redirect("/register/error/?error=90");
                                        }
                                    }
                                }
                            }
                            else
                            {
                                cartsObj.SendCartErrorEmail("ERROR: 91\n\rregistration wasn't created: (tempCust == null || tempAttList == null || tempAttList.Count <= 0)");

                                return Redirect("/search-seminars/?error=91");
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        cartsObj.SendCheckoutErrorEmail("RegID: " + tempRegList[0].reg_ID + "\n\rError: " + ex.ToString());
                    }
                }
                else
                {
                    cartsObj.SendCartErrorEmail("ERROR: 92\n\rregistration list null: (tempRegList == null)");

                    return Redirect("/search-seminars/?error=92");
                }

                cartsObj.SendCartErrorEmail("ERROR: 93\n\rfunction fall through.");

                return Redirect("/search-seminars/?error=93");
            }
        }
    }
}