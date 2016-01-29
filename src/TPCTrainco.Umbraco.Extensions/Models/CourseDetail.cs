using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TPCTrainco.Umbraco.Extensions.Models
{
    public class CourseDetail
    {
        public int Id { get; set; }
        public int TopicId { get; set; }
        public int CourseTier { get; set; }
        public string Title { get; set; }
        public string SubTitle { get; set; }
        public string ImageUrl { get; set; }
        public string DetailsUrl { get; set; }
    }
}
