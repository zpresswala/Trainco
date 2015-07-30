using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TPCTrainco.Umbraco.Extensions.ViewModels
{
    public class Location
    {
        public string Title { get; set; }
        public List<Schedule> Schedules { get; set; }
    }
}
