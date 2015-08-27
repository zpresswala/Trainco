using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TPCTrainco.Umbraco.Extensions.Models.SearchRequest
{
    public class SchedulesSearchRequest
    {
        public int SeminarId { get; set; }
        public int CourseId { get; set; }
        public string SearchId { get; set; }
    }
}
