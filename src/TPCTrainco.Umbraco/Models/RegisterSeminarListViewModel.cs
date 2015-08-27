using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TPCTrainco.Umbraco.Models
{
    public class RegisterSeminarListViewModel
    {
        public int ScheduleId { get; set; }
        public int CourseId { get; set; }
        public string Title { get; set; }
        public string SubTitle { get; set; }
        public string Location { get; set; }
        public string DateString { get; set; }
        public List<RegisterAttendeeViewModel> AttendeeList { get; set; }
    }
}