using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Mvc;
using TPCTrainco.Umbraco.Extensions.Models;
using Umbraco.Web.Mvc;

namespace TPCTrainco.Umbraco.Controllers
{
    public class CheckoutCustomerController : SurfaceController
    {
        public ActionResult Index()
        {
            return PartialView("CheckoutCustomer", new CheckoutCustomer());
        }


        [HttpPost]
        public ActionResult HandleFormSubmit(CheckoutCustomer model)
        {


            return RedirectToCurrentUmbracoUrl();
        }
    }
}