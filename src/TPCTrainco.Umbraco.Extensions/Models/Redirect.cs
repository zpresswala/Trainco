using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TPCTrainco.Umbraco.Extensions.Models
{
    public class Redirect
    {
        public int StatusCode { get; set; }
        public string UrlToRedirect { get; set; }
        public string RedirectToUrl { get; set; }
    }
}
