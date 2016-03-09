using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TPCTrainco.Umbraco.Extensions.ViewModels.Angular
{
    public class Location
    {
        public string City { get; set; }
        public string StateCode { get; set; }
        public string State { get; set; }
        public string LocationDetails { get; set; }
        public DateTime DateFilter { get; set; }
        public string Date { get; set; }
        public double Price { get; set; }
        public double Distance { get; set; }
        public List<Schedule> Schedules { get; set; }
    }
}
