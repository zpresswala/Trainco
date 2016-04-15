using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TPCTrainco.Umbraco.Extensions.Models.Account
{
    public class CourseModel
    {
        public CourseDetail CourseDetail { get; set; }

        public IEnumerable<MaterialModel> Materials { get; set; }
        public IEnumerable<AttendeeModel> Attendees { get; set; }

        public int ScheduleId { get; set; }
        public string ScheduleDateDescription { get; set; }
        public DateTime ScheduleDate { get; set; }
    }

    public class MaterialModel
    {
        public string Url { get; set; }
    }

    public class AttendeeModel
    {
        public int RegistrationAttendeeId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Title { get; set; }
    }
}