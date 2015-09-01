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

                    using (var db = new ATI_DevelopmentEntities1())
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

                    Carts cartsObj = new Carts();

                    tempRegList = cartsObj.GetCart(cartGuid);

                    if (tempRegList == null)
                    {
                        return Redirect("/search-seminars/");
                    }
                    else
                    {
                        Session["CartId"] = cartGuid;
                    }
                }

                if (tempRegList != null)
                {
                    Session["CartId"] = cartGuid;

                    temp_Cust tempCust = null;

                    using (var db = new ATI_DevelopmentEntities1())
                    {
                        int regId = tempRegList[0].reg_ID;

                        tempCust = db.temp_Cust.Where(p => p.reg_ID == regId).FirstOrDefault();
                        tempAttList = db.temp_Att.Where(p => p.reg_ID == regId).ToList();

                        if (tempCust != null && tempAttList != null && tempAttList.Count > 0)
                        {
                            checkoutDetails.tempRegList = tempRegList;
                            checkoutDetails.tempAttList = tempAttList;
                            checkoutDetails.tempCust = tempCust;




                            return Redirect("/register/success/");

                        }
                        else
                        {
                            return Redirect("/search-seminars/");
                        }
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