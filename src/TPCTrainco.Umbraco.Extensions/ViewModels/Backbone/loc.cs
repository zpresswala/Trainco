using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TPCTrainco.Umbraco.Extensions.ViewModels.Backbone
{
    public class Loc
    {
        public int LocationId { get; set; }
        public int CityId { get; set; }
        public int CourseId { get; set; }
        public string CityState { get; set; }
        public string Date { get; set; }
        public double Price { get; set; }
        public string SearchId { get; set; }
    }
}
