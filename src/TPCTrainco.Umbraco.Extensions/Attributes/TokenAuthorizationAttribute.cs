using System;
using System.Linq;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Controllers;
using TPCTrainco.Umbraco.Extensions.Helpers;

namespace TPCTrainco.Umbraco.Extensions.Attributes
{
    [AttributeUsage(AttributeTargets.Method, AllowMultiple = false, Inherited = true)]
    public class TokenAuthorizationAttribute : AuthorizeAttribute
    {
        private const string _securityToken = "Token"; // Name of the url parameter.

        public override void OnAuthorization(HttpActionContext actionContext)
        {
            if (Authorize(actionContext))
            {
                return;
            }

            HandleUnauthorizedRequest(actionContext);
        }

        protected override void HandleUnauthorizedRequest(HttpActionContext actionContext)
        {
            base.HandleUnauthorizedRequest(actionContext);
        }

        protected override bool IsAuthorized(HttpActionContext actionContext)
        {
            return base.IsAuthorized(actionContext);
        }

        private bool Authorize(HttpActionContext actionContext)
        {
            try
            {
                HttpRequestMessage request = actionContext.Request;

                var token = request.Headers.Authorization.Parameter;

                return AccountHelper.IsTokenValid(token, request.RequestUri.Host, UtilitiesHelper.GetClientIpAddress(request), request.Headers.UserAgent.ToString());
            }
            catch (Exception)
            {
                return false;
            }
        }

        private string GetQueryStrings(HttpRequestMessage request, string key)
        {
            // IEnumerable<KeyValuePair<string,string>> - right!
            var queryStrings = request.GetQueryNameValuePairs();
            if (queryStrings == null)
                return null;

            var match = queryStrings.FirstOrDefault(kv => string.Compare(kv.Key, key, true) == 0);
            if (string.IsNullOrEmpty(match.Value))
                return null;

            return match.Value;
        }
    }
}
