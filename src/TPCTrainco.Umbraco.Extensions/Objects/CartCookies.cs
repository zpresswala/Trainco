using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace TPCTrainco.Umbraco.Extensions.Objects
{
    public static class CartCookies
    {
        public static string CookieName = "TPC-Trainco";
        public static string CookieValue = "TPC-Session";
        public static string EncryptKey = "J89udsauyfn79dTG^FNIODGF^MnuidSgf6uidgf^D*UI";

        public static void Set(string cartGuid)
        {
            HttpCookie cookie = HttpContext.Current.Request.Cookies[CookieName] ?? new HttpCookie(CookieName);

            cookie.Values[CookieValue] = EncryptString.Encrypt(cartGuid, EncryptKey);
            HttpContext.Current.Response.Cookies.Add(cookie);
        }

        public static string Get()
        {
            string output = null;

            try
            {

                HttpCookie cookie = HttpContext.Current.Request.Cookies[CookieName];
                if (cookie != null)
                {
                    string cookieValue = cookie.Values[CookieValue];

                    if (false == string.IsNullOrWhiteSpace(cookieValue))
                    {
                        output = EncryptString.Decrypt(cookieValue, EncryptKey);
                    }
                }
            }
            catch (Exception ex)
            {

            }

            return output;
        }


        public static string Remove()
        {
            string output = null;

            try
            {

                HttpCookie cookie = HttpContext.Current.Request.Cookies[CookieName];
                if (cookie != null)
                {
                    cookie.Expires = DateTime.Now.AddDays(-1);
                    HttpContext.Current.Response.Cookies.Add(cookie);
                }
            }
            catch (Exception ex)
            {

            }

            return output;
        }
    }



}
