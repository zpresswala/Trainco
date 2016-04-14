using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace TPCTrainco.Umbraco.Extensions.Objects
{
    public class Users
    {
        public static string CookieName = "TPC-Trainco-User";
        public static string CookieValue = "TPC-Token";
        public static string EncryptKey = "T^MfdsAfdsX#%TBYL&*(JIjyOlkT&EXTjYNl>(BYTcde^gTYUkO>FTH23";

        public static string GetToken(HttpSessionStateBase session)
        {
            string output = null;

            if (session != null && session["TokenId"] != null && session["TokenId"].ToString().Length > 5)
            {
                output = session["TokenId"].ToString();
            }
            else
            {
                output = GetCookie();
            }

            if (false == string.IsNullOrEmpty(output))
            {
                session["TokenId"] = output;
            }

            return output;
        }


        public static void SetToken(HttpSessionStateBase session, string token)
        {
            session["TokenId"] = token;

            HttpCookie cookie = HttpContext.Current.Request.Cookies[CookieName] ?? new HttpCookie(CookieName);

            cookie.Values[CookieValue] = EncryptToken(token);
            HttpContext.Current.Response.Cookies.Add(cookie);
        }


        public static string GetCookie()
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
                        output = DecryptToken(cookieValue);
                    }
                }
            }
            catch (Exception ex)
            {

            }

            return output;
        }


        public static string EncryptToken(string token)
        {
            return EncryptString.Encrypt(token, EncryptKey);
        }


        public static string DecryptToken(string tokenEncrypted)
        {
            return EncryptString.Decrypt(tokenEncrypted, EncryptKey);
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
