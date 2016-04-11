using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Web.Mvc;
using TPCTrainco.Umbraco.Extensions;
using TPCTrainco.Umbraco.Extensions.Models;
using TPCTrainco.Umbraco.Extensions.Objects;
using Umbraco.Web.Mvc;

namespace TPCTrainco.Umbraco.Controllers
{
    public class CheckoutCustomerSurfaceController : SurfaceController
    {
        public ActionResult Index()
        {
            CheckoutCustomer checkoutCustomer = new CheckoutCustomer();
            List<temp_Reg> cartList = null;
            string cartGuid = null;

            cartGuid = Carts.GetCartGuid(Session);

            if (false == string.IsNullOrWhiteSpace(cartGuid))
            {
                Carts cartsObj = new Carts();

                cartList = cartsObj.GetCart(cartGuid);

                if (cartList == null)
                {
                    return Redirect("/register/?cart=" + Server.UrlEncode(cartGuid));
                }
                else
                {
                    Session["CartId"] = cartGuid;

                    temp_Cust tempCust = null;

                    using (var db = new americantraincoEntities())
                    {
                        int regId = cartList[0].reg_ID;
                        checkoutCustomer.RegId = regId;

                        tempCust = db.temp_Cust.Where(p => p.reg_ID == regId).FirstOrDefault();

                        if (tempCust != null)
                        {
                            checkoutCustomer = cartsObj.ConvertTempCustToCheckoutCustomer(tempCust);
                            checkoutCustomer.BillingDifferent = true;
                        }
                    }

                    checkoutCustomer.CartGuid = CartCookies.EncryptCartGuid(cartGuid + "|" + checkoutCustomer.RegId + "|" + Request.UserHostAddress);

                    if (false == cartsObj.IsValidCart(checkoutCustomer.RegId, "/register/info/"))
                    {
                        return Redirect("/register/?cart=" + cartGuid);
                    }
                    else
                    {
                        return PartialView("CheckoutCustomer", checkoutCustomer);
                    }
                }
            }
            else
            {
                return Redirect("/");
            }
        }


        [NotChildAction]
        [HttpPost]
        public ActionResult HandleFormSubmit(CheckoutCustomer model)
        {
            StringBuilder debug = new StringBuilder();

            debug.AppendLine("-=Customer Checkout=-\r\n");

            Carts cartsObj = new Carts();

            if (false == ModelState.IsValid)
            {
                return CurrentUmbracoPage();
            }
            else
            {
                debug.AppendLine("Loading cart...");

                CheckoutBilling checkoutBilling = new CheckoutBilling();
                List<temp_Reg> cartList = null;
                string cartGuid = null;

                cartGuid = Carts.GetCartGuid(Session);

                if (true == string.IsNullOrWhiteSpace(cartGuid) || model.RegId <= 0)
                {
                    string cartGuidStr = CartCookies.DecryptCartGuid(model.CartGuid);

                    if (cartGuidStr.IndexOf("|") >= 0)
                    {
                        string[] cartGuidArray = cartGuidStr.Split('|');

                        if (cartGuidArray[2] == Request.UserHostAddress)
                        {
                            cartGuid = cartGuidArray[0];
                            model.RegId = Convert.ToInt32(cartGuidArray[1]);
                        }
                    }
                }

                if (false == string.IsNullOrWhiteSpace(cartGuid))
                {
                    cartList = cartsObj.GetCart(cartGuid, model.RegId);

                    if (cartList == null)
                    {
                        debug.AppendLine("CART NOT FOUND!");

                        return Redirect("/search-seminars/");
                    }
                    else
                    {
                        Session["CartId"] = cartGuid;
                    }
                }

                if (cartList != null)
                {
                    if (false == cartsObj.IsValidCart(cartList[0].reg_ID, "/register/info/ (POST)"))
                    {
                        return Redirect("/register/?cart=" + cartGuid);
                    }

                    checkoutBilling.RegId = cartList[0].reg_ID;

                    if (model.PaymentType == "credit")
                    {
                        checkoutBilling.CCNumber = model.CCNumber.Replace("-", "");
                    }

                    temp_Cust tempCust = cartsObj.ConvertModelToTempCust(model, cartList);

                    if (tempCust != null)
                    {
                        tempCust.regTakenBy = "Customer Web";
                        tempCust.PastCustomer = "Not Sure";

                        if (model.PaymentType == "credit")
                        {
                            tempCust.ccNumber = checkoutBilling.CCNumber;
                        }

                        tempCust = cartsObj.SaveCheckoutDetails(tempCust);

                        if (tempCust != null)
                        {
                            return Redirect("/register/summary/");
                        }
                        else
                        {
                            cartsObj.SendCartErrorEmail("ERROR: 81\n\r tempCust == null");

                            return Redirect("/register/error/?error=81");
                        }
                    }
                    else
                    {
                        cartsObj.SendCartErrorEmail("ERROR: 82\n\r tempCust == null");
                        return Redirect("/register/error/?error=82");
                    }
                }
                else
                {
                    cartsObj.SendCartErrorEmail("ERROR: 83\n\r cartList == null");
                    return Redirect("/register/error/?error=83");
                }
            }
        }
    }
}