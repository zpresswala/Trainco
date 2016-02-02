using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using TPCTrainco.Umbraco.Extensions.Helpers;
using TPCTrainco.Umbraco.Extensions.Models;
using Umbraco.Core.Models;
using Umbraco.Web;

namespace TPCTrainco.Umbraco.Extensions.Controllers.v2
{
    public class ContentsController : ApiController
    {
        [HttpGet]
        public object Course(string id = null)
        {
            string output = "";
            UmbracoCourseDetail seminarDetails = new UmbracoCourseDetail();
            IPublishedContent contentResponse = null;

            seminarDetails.ImageUrl = "/images/default-seminar.gif";
            seminarDetails.DetailsUrl = "#";
            try
            {
                UmbracoHelper UmbracoHelperObj = new UmbracoHelper(UmbracoContext.Current);

                if (false == string.IsNullOrWhiteSpace(id))
                {
                    contentResponse = Helpers.Nodes.Instance.SeminarItems.Where(p => p.GetProperty("courseLink").Value != null && p.GetProperty("courseLink").Value.ToString() == id).FirstOrDefault();

                    if (contentResponse != null)
                    {
                        seminarDetails.ImageUrl = "/images/default-seminar.gif";
                        seminarDetails.DetailsUrl = contentResponse.Url;

                        IPublishedContent imageObject = UmbracoHelperObj.Content(contentResponse.Id);
                        if (imageObject != null)
                        {
                            seminarDetails.ImageUrl = imageObject.GetCropUrl("image", "Image");
                        }

                        if (true == contentResponse.HasValue("searchSummaryText"))
                        {
                            seminarDetails.SubTitle = contentResponse.GetPropertyValue<string>("searchSummaryText");
                        }

                        output = JsonConvert.SerializeObject(seminarDetails);
                    }
                }
            }
            catch (Exception ex)
            {

            }

            return output;
        }


        [HttpGet]
        public object SummaryText()
        {
            string output = "";

            try
            {
                output = Nodes.Instance.SeminarSearch.GetPropertyValue<string>("locationMessage");
            }
            catch (Exception ex)
            {

            }

            return output;
        }
    }


}
