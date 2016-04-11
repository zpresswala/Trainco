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

            if (false == badUrl.EndsWith(".png") && false == badUrl.EndsWith(".gif") && false == badUrl.EndsWith(".jpg"))
            {
                var redirect = redirects.Where(x => x.UrlToRedirect.ToLower() == badUrl.ToLower() || x.UrlToRedirect.ToLower() == badUrl2.ToLower()
                     || x.UrlToRedirect.ToLower() == badUrl3.ToLower() || x.UrlToRedirect.ToLower() == badUrl4.ToLower()).FirstOrDefault();

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
                else
                {
                    LogHelper.Info<Redirect>(string.Format("No Redirect found '{0}'", badUrl));
                    SetHttpStatus(404);
                }
            }
            else
            {
                SetHttpStatus(404);
            }
        }

        public static void SetHttpStatus(int statusCode)
        {
            if (HttpContext.Current == null)
                return;

            var context = HttpContext.Current;

            context.Response.StatusCode = statusCode;

            if (statusCode == 404)
            {
                context.Response.StatusDescription = "404 Page Not Found";
            }
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
