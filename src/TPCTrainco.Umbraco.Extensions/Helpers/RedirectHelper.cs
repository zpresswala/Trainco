using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using TPCTrainco.Umbraco.Extensions.Models;
using Umbraco.Core.Logging;
using Umbraco.Core.Models;
using Umbraco.Web;

namespace TPCTrainco.Umbraco.Extensions.Helpers
{
    public static class RedirectHelper
    {
        public static void TryRedirect(IPublishedContent rootRedirectNode)
        {
            if (HttpContext.Current == null)
                return;

            var context = HttpContext.Current;

            var redirects = GetRedirectConfig(rootRedirectNode);
            var badUrl = GetCurrentPath();
            var badUrl2 = badUrl;

            badUrl2 = badUrl2.TrimEnd('/');

            var badUrl3 = badUrl;
            var badUrl4 = badUrl2;

            badUrl3 = badUrl3.Replace(" ", "%20");
            badUrl4 = badUrl4.Replace(" ", "%20");

            var redirect = redirects.Where(x => x.UrlToRedirect == badUrl || x.UrlToRedirect == badUrl2
                 || x.UrlToRedirect == badUrl3 || x.UrlToRedirect == badUrl4).FirstOrDefault();

            if (redirect != null)
            {
                LogHelper.Info<Redirect>(string.Format("Redirecting '{0}' to '{1}' with status {2}", redirect.UrlToRedirect, redirect.RedirectToUrl, redirect.StatusCode));
                context.Response.StatusCode = redirect.StatusCode;

                if (context.Response.StatusCode == 301)
                {
                    context.Response.RedirectPermanent(redirect.RedirectToUrl, true);
                }
                else
                {
                    context.Response.Redirect(redirect.RedirectToUrl, true);
                }
            }
        }

        public static void SetHttpStatus(int statusCode)
        {
            if (HttpContext.Current == null)
                return;

            var context = HttpContext.Current;

            context.Response.StatusCode = statusCode;
        }

        public static string GetCurrentPath()
        {
            if (HttpContext.Current == null)
                return "";

            var context = HttpContext.Current;

            return context.Request.QueryString["aspxerrorpath"] ?? context.Request.RawUrl;
        }

        public static List<Redirect> GetRedirectConfig(IPublishedContent rootRedirectNode)
        {
            var redirects = new List<Redirect>();

            var redirectNodes = rootRedirectNode.Descendants().Where(x => x.DocumentTypeAlias == "Redirect");

            foreach (var redirect in redirectNodes)
            {
                var statusCodeValue = redirect.GetPropertyValue<string>("statusCode");

                var statusCode = 301;

                if (!String.IsNullOrWhiteSpace(statusCodeValue))
                {
                    statusCode = Convert.ToInt32(statusCode);
                }

                redirects.Add(new Redirect()
                {
                    UrlToRedirect = redirect.GetPropertyValue<string>("urlToRedirect"),
                    RedirectToUrl = redirect.GetPropertyValue<UrlPicker.Umbraco.Models.UrlPicker>("redirectToUrl").Url,
                    StatusCode = statusCode
                }
                );
            }

            return redirects;
        }
    }


}
