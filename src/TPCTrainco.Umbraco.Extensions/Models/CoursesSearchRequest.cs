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
        public string DateStart { get; set; }
        public string DateEnd { get; set; }
    }
}
