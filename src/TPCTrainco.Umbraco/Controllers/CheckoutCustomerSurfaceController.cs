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
    public class CheckoutCustomerSurfaceController : SurfaceController
    {
        public ActionResult Index()
        {
            CheckoutCustomer checkoutCustomer = new CheckoutCustomer();
            List<temp_Reg> cartList = null;
            string cartGuid = null;

            if (Session["CartId"] != null && Session["CartId"].ToString().Length > 0)
            {
                cartGuid = Session["CartId"].ToString().ToLower();

                Carts cartsObj = new Carts();

                cartList = cartsObj.GetCart(cartGuid);

                if (cartList == null)
                {
                    return PartialView("CheckoutCustomer", checkoutCustomer);
                }
                else
                {
                    Session["CartId"] = cartGuid;

                    temp_Cust tempCust = null;

                    using (var db = new ATI_DevelopmentEntities1())
                    {
                        int regId = cartList[0].reg_ID;

                        tempCust = db.temp_Cust.Where(p => p.reg_ID == regId).FirstOrDefault();

                        if (tempCust != null)
                        {
                            checkoutCustomer = cartsObj.ConvertTempCustToCheckoutCustomer(tempCust);
                            checkoutCustomer.BillingDifferent = true;
                        }
                    }

                    return PartialView("CheckoutCustomer", checkoutCustomer);
                }
            }
            else
            {
                return PartialView("CheckoutCustomer", checkoutCustomer);
            }
        }


        [NotChildAction]
        [HttpPost]
        public ActionResult HandleFormSubmit(CheckoutCustomer model)
        {
            if (false == ModelState.IsValid)
            {
                return CurrentUmbracoPage();
            }
            else
            {
                CheckoutBilling checkoutBilling = new CheckoutBilling();
                List<temp_Reg> cartList = null;
                string cartGuid = null;

                if (Session["CartId"] != null && Session["CartId"].ToString().Length > 0)
                {
                    cartGuid = Session["CartId"].ToString().ToLower();

                    Carts cartsObj = new Carts();

                    cartList = cartsObj.GetCart(cartGuid);

                    if (cartList == null)
                    {
                        return Redirect("/search-seminars/");
                    }
                    else
                    {
                        Session["CartId"] = cartGuid;
                    }
                }

                if (cartList != null)
                {
                    Carts cartsObj = new Carts();

                    // delete old temp_Cust
                    cartsObj.DeleteTempCust(cartList[0].reg_ID);

                    checkoutBilling.RegId = cartList[0].reg_ID;

                    if (model.PaymentType == "credit")
                    {
                        checkoutBilling.CCNumber = model.CCNumber.Replace("-", "");

                        Session["CartBilling"] = checkoutBilling;
                    }

                    temp_Cust tempCust = cartsObj.ConvertModelToTempCust(model, cartList);

                    if (tempCust != null)
                    {
                        tempCust.regTakenBy = "Customer Web";
                        tempCust.PastCustomer = "Not Sure";
                        tempCust = cartsObj.SaveCheckoutDetails(tempCust);

                        if (tempCust != null)
                        {
                            return Redirect("/register/summary/");
                        }
                        else
                        {
                            return Redirect("/search-seminars/?error=99");
                        }
                    }
                    else
                    {
                        return Redirect("/search-seminars/?error=98");
                    }
                }
                else
                {
                    return Redirect("/search-seminars/");
                }
            }
        }
    }
}