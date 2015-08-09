using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TPCTrainco.Umbraco.Extensions.Models.SearchRequest
{
    public class SeminarsSearchRequest
    {
        public string Location { get; set; }
        public string[] classTopics { get; set; }
        public Dates Dates { get; set; }
    }

    public class Dates
    {
        public Min Min { get; set; }
        public Max Max { get; set; }
    }

    public class Min
    {
        public int MinMonthVal { get; set; }
        public int MinYearVal { get; set; }
    }

    public class Max
    {
        public int MaxMonthVal { get; set; }
        public int MaxYearVal { get; set; }
    }
}
