using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TPCTrainco.Umbraco.Extensions.Models
{
    public class UmbracoCourseDetail
    {
        public int CourseId { get; set; }
        public int NodeId { get; set; }
        public string SubTitle { get; set; }
        public string ImageUrl { get; set; }
        public string DetailsUrl { get; set; }
    }
}
