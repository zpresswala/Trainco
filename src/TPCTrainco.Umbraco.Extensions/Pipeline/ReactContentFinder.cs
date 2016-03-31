using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Umbraco.Core;
using Umbraco.Web.Routing;

namespace TPCTrainco.Umbraco.Extensions.Pipeline
{
    public class ReactContentFinder : IContentFinder
    {
        private List<string> _reactBase = new List<string>()
        {
            "dashboard",
            "account"
        };

        public bool TryFindContent(PublishedContentRequest contentRequest)
        {
            // We are looking for URLs of the form /dashboard/*
            var urlParts = contentRequest.Uri.GetAbsolutePathDecoded().Split(new[] { '/' }, StringSplitOptions.RemoveEmptyEntries);
            if (urlParts.Length > 1 && _reactBase.Contains(urlParts[0].ToLower()))
            {
                // Check to see if request is below the ad landing page, if so do silent redirect to it passing the categories
                var route = "/" + string.Join("/", urlParts[0]);
                var reactContent = contentRequest.RoutingContext.UmbracoContext.ContentCache.GetByRoute(route);
                if (reactContent != null)
                {
                    contentRequest.PublishedContent = reactContent;
                }
            }

            return contentRequest.HasPublishedContent;
        }
    }
}

