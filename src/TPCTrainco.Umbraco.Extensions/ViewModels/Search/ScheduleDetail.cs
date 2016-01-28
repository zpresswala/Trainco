using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TPCTrainco.Umbraco.Extensions.ViewModels.Search
{
    public class ScheduleDetail
    {
        public LocationSchedule LocationSchedule { get; set; }
        public List<Schedule> ScheduleList { get; set; }
    }
}
