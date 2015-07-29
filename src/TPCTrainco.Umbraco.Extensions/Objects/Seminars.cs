using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TPCTrainco.Umbraco.Extensions.Models;
using TPCTrainco.Umbraco.Extensions.ViewModels;

namespace TPCTrainco.Umbraco.Extensions.Objects
{
    public class Seminars
    {
        public static List<Seminar> Search(SeminarsSearchRequest request)
        {
            List<Seminar> resultsList = null;

            List<Seminar_Catalog> seminarList = CacheObjects.GetSeminarList();
            List<SCHEDULE> scheduleList = CacheObjects.GetScheduleList();
            List<COURS> courseList = CacheObjects.GetCourseList();
            List<ScheduleCourseInstructor> scheduleCourseList = CacheObjects.GetScheduleCourseList();

            List<Seminar_Catalog> seminarListSearch = seminarList;

            // filter location
            if (false == string.IsNullOrEmpty(request.Location) && request.Location != "all")
            {
                seminarListSearch = seminarListSearch.Where(p => p.City == request.Location).ToList();
            }

            // filter date min
            if (request.Dates != null)
            {
                if (request.Dates.Min != null)
                {
                    DateTime minDate = DateTime.Parse(request.Dates.Min.MinMonthVal + "/1/" + request.Dates.Min.MinYearVal);

                    seminarListSearch = seminarListSearch.Where(p => p.SchDate >= minDate).ToList();
                }
            }

            // filter date max
            if (request.Dates != null)
            {
                if (request.Dates.Max != null)
                {
                    DateTime maxDate = DateTime.Parse(request.Dates.Max.MaxMonthVal + "/1/" + request.Dates.Max.MaxYearVal).AddMonths(1).AddDays(-1);

                    seminarListSearch = seminarListSearch.Where(p => p.SchDate <= maxDate).ToList();
                }
            }

            // filter 
            if (request.classTopics != null && request.classTopics.Length > 0)
            {
                List<int> topicArray = request.classTopics.Select(x => Int32.Parse(x)).ToList();

                seminarListSearch = seminarListSearch.Where(p => p.TopicID.Equals(topicArray)).ToList();
            }


            return resultsList;
        }
    }
}
