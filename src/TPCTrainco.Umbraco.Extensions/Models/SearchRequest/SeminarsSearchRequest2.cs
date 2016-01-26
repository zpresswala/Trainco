using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TPCTrainco.Umbraco.Extensions.Models.SearchRequest
{
    public class SeminarsSearchRequest2
    {
        public string Location { get; set; }
        public string Keywords { get; set; }
        public int Radius { get; set; }
        public string[] Topics { get; set; }
        public DateRange DateRage { get; set; }
        public int Page { get; set; }
    }

    public class DateRange
    {
        public DateTime Min { get; set; }
        public DateTime Max { get; set; }
    }
}
