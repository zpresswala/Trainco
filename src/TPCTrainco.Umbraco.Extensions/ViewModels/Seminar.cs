using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TPCTrainco.Umbraco.Extensions.ViewModels
{
    public class Seminar
    {
        public long SeminarId { get; set; }
        public int CourseId { get; set; }
        public string Title { get; set; }
        public string SubTitle { get; set; }
        public string ImageUrl { get; set; }
        public string DetailsUrl { get; set; }
        public string SearchId { get; set; }
        public List<Location> Locations { get; set; }
    }
}
