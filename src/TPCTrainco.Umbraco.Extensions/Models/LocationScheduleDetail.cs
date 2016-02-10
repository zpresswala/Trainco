using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TPCTrainco.Umbraco.Extensions.Models
{
    public class LocationScheduleDetail
    {
        public int CourseId { get; set; }
        public int TopicId { get; set; }
        public string City { get; set; }
        public string StateCode { get; set; }
        public string State { get; set; }
        public string LocationDetails { get; set; }
        public System.Data.Entity.Spatial.DbGeography Coordinates { get; set; }
        public DateTime DateFilter { get; set; }
        public string DateMonthYear { get; set; }
        public double? Distance { get; set; }

        public long Id { get; set; }
        public long ParentId { get; set; }
        public string ScheduleSeminarNumber { get; set; }
        public string DaysTitle { get; set; }
        public string DaysDescription { get; set; }
        public string Date { get; set; }
        public double Price { get; set; }
        public string Description { get; set; }
    }
}
