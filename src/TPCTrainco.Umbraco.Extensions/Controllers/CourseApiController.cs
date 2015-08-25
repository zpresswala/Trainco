using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using TPCTrainco.Umbraco.Extensions.Models;
using TPCTrainco.Umbraco.Extensions.Objects;
using TPCTrainco.Umbraco.Extensions.ViewModels;
using System.Globalization;
using Umbraco.Web.Editors;
using Umbraco.Web.Mvc;

namespace TPCTrainco.Umbraco.Extensions.Controllers
{
    [PluginController("TPCTrainco")]
    public class CourseApiController : UmbracoAuthorizedJsonController
    {
        public IEnumerable<object> GetCourses()
        {
            List<object> data = new List<object>();
            Seminars seminars = new Seminars();
            List<CourseCategory> courseCategoryList = seminars.GetCourseCategoryList();

            foreach (CourseCategory category in courseCategoryList.OrderBy(o => o.Title))
            {
                foreach (Course course in category.Courses.Where(p => (p.TypeId == 3 || p.TypeId == 5) && p.CountryId == 0).OrderBy(o => o.Title))
                {
                    var newCourse = new { Id = course.Id.ToString(), Title = course.Title, Category = category.Title};
                    data.Add(newCourse);
                }
            }

            return data;
        }
    }
}
