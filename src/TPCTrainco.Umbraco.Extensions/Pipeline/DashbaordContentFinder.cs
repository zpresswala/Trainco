using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Umbraco.Core;
using Umbraco.Web.Routing;

namespace TPCTrainco.Umbraco.Extensions.Pipeline
{
    public class DashbaordContentFinder : IContentFinder
    {
        public bool TryFindContent(PublishedContentRequest contentRequest)
        {
            // We are looking for URLs of the form /dashboard/*
            var urlParts = contentRequest.Uri.GetAbsolutePathDecoded().Split(new[] { '/' }, StringSplitOptions.RemoveEmptyEntries);
            if (urlParts.Length > 1 && urlParts[0].ToLower().Equals("dashboard"))
            {
                // Check to see if request is below the ad landing page, if so do silent redirect to it passing the categories
                var dashboard = "/" + string.Join("/", urlParts[0]);
                var dashboardContent = contentRequest.RoutingContext.UmbracoContext.ContentCache.GetByRoute(dashboard);

                contentRequest.PublishedContent = dashboardContent;
            }

            return contentRequest.HasPublishedContent;
        }
    }
}

