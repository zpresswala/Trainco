using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TPCTrainco.Umbraco.Extensions.ViewModels.Search
{
    public class Schedule
    {
        public long Id { get; set; }
        public string Description { get; set; }
        public string DaysTitle { get; set; }
        public string DaysDescription { get; set; }
        public string Date { get; set; }
        public double Price { get; set; }
        public DateTime DateFilter { get; set; }
        public string DateMonthYear { get; set; }
    }
}
