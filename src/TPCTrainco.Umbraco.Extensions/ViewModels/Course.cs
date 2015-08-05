using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TPCTrainco.Umbraco.Extensions.ViewModels
{
    public class Course
    {
        public int Id { get; set; }
        public int CategoryId { get; set; }
        public CourseCategory Category { get; set; }
        public int TypeId { get; set; }
        public int CountryId { get; set; }
        public string FormatName { get; set; }
        public string CreditsText { get; set; }
        public string ToolTip { get; set; }
        public string TimesText { get; set; }
        public string Title { get; set; }
        public string FeeText { get; set; }
        public decimal CourseFee { get; set; }
        public string CertTitle { get; set; }
        public string CertTitle2 { get; set; }

    }
}
