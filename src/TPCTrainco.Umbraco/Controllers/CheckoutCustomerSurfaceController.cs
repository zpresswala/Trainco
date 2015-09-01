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
            List<temp_Reg> cartList = null;
            string cartGuid = null;

            if (Session["CartId"] != null && Session["CartId"].ToString().Length > 0)
            {
                cartGuid = Session["CartId"].ToString().ToLower();

                Carts cartsObj = new Carts();

                cartList = cartsObj.GetCart(cartGuid);

                int totalItems = 0;
                decimal cartTotal = 0;

                if (cartList == null)
                {
                    Response.Redirect("/search-seminars/");
                }
                else
                {
                    Session["CartId"] = cartGuid;
                    totalItems = cartList.Count;
                    cartTotal = cartList.Sum(p => p.sem_FeeAmt) ?? 0;
                }
            }

            return PartialView("CheckoutCustomer", new CheckoutCustomer());
        }


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

                    int totalItems = 0;
                    decimal cartTotal = 0;

                    if (cartList == null)
                    {
                        Response.Redirect("/search-seminars/");
                    }
                    else
                    {
                        Session["CartId"] = cartGuid;
                        totalItems = cartList.Count;
                        cartTotal = cartList.Sum(p => p.sem_FeeAmt) ?? 0;
                    }
                }

                if (cartList != null)
                {
                    checkoutBilling.RegId = cartList[0].reg_ID;
                    checkoutBilling.CCNumber = model.CCNumber;

                    Session["CartBilling"] = checkoutBilling;

                    Carts cartsObj = new Carts();

                    temp_Cust tempCust = cartsObj.ConvertModelToTempCust(model, cartList);

                    if (tempCust != null)
                    {
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


                }
                else
                {
                    return Redirect("/search-seminars/");
                }
            }

            return RedirectToCurrentUmbracoUrl();
        }
    }
}