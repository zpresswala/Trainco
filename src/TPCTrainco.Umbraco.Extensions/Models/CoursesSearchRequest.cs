using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TPCTrainco.Umbraco.Extensions.Models
{
    public class CoursesSearchRequest
    {
        public string Location { get; set; }
        public List<string> classTopics { get; set; }
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
        public int MinYearhVal { get; set; }
    }

    public class Max
    {
        public int MaxMonthVal { get; set; }
        public int MaxYearhVal { get; set; }
    }
}
