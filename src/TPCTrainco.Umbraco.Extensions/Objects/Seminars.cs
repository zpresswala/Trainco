using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TPCTrainco.Umbraco.Extensions.Models;
using TPCTrainco.Umbraco.Extensions.ViewModels;
using MoreLinq;
using System.Text.RegularExpressions;

namespace TPCTrainco.Umbraco.Extensions.Objects
{
    public class Seminars
    {
        public List<Seminar_Catalog> SeminarList = null;
        public List<SCHEDULE> ScheduleList = null;
        public List<COURS> CourseList = null;
        public List<ScheduleCourseInstructor> ScheduleCourseList = null;
        public List<CourseFormat> CourseFormatList { get; set; }

        public Seminars()
        {
            SeminarList = CacheObjects.GetSeminarList();
            ScheduleList = CacheObjects.GetScheduleList();
            CourseList = CacheObjects.GetCourseList();
            ScheduleCourseList = CacheObjects.GetScheduleCourseList();
            CourseFormatList = CacheObjects.GetCourseFormatList();
        }


        /// <summary>
        /// Search Seminars/Courses
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        public List<Seminar> Search(SeminarsSearchRequest request)
        {
            List<Seminar> resultsList = null;

            List<Seminar_Catalog> seminarListSearch = SeminarList;

            // filter location
            if (false == string.IsNullOrEmpty(request.Location) && request.Location != "all")
            {
                SearchLocation searchLocation = new SearchLocation(request.Location);

                if (searchLocation != null)
                {
                    seminarListSearch = seminarListSearch.Where(p => p.City == searchLocation.City && p.State == searchLocation.State).ToList();
                }
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
                List<int> topicArray = new List<int>();

                foreach (string classTopic in request.classTopics)
                {
                    int topicId = Objects.Topics.TopicIdByShortName(classTopic);

                    if (topicId > int.MinValue)
                    {
                        topicArray.Add(topicId);
                    }
                }

                seminarListSearch = seminarListSearch.Where(p => topicArray.Any(r => r == p.TopicID)).ToList();

                //seminarListSearch = seminarListSearch.Where(p => p.TopicID.Equals(topicArray)).ToList();
            }

            if (seminarListSearch != null && seminarListSearch.Count > 0)
            {
                resultsList = new List<Seminar>();

                List<Seminar_Catalog> seminarDistinctList = seminarListSearch.DistinctBy(p => p.TitlePlain).ToList();

                if (seminarDistinctList != null && seminarDistinctList.Count > 0)
                {
                    foreach (Seminar_Catalog seminarDistinct in seminarDistinctList)
                    {
                        Seminar seminar = ConvertSeminarCatalogToViewModel(seminarDistinct);

                        if (seminar != null)
                        {
                            List<Seminar_Catalog> seminarsByLocation = seminarListSearch.Where(p => p.TitlePlain == seminarDistinct.TitlePlain).OrderBy(p => p.SchDate).ToList();

                            if (seminarsByLocation != null && seminarsByLocation.Count > 0)
                            {
                                foreach (Seminar_Catalog seminarCatalog in seminarsByLocation)
                                {
                                    ViewModels.Location location = new ViewModels.Location();

                                    location.Title = seminarCatalog.City + ", " + seminarCatalog.State;

                                    // Main Schedule
                                    ViewModels.Schedule schedule = null;

                                    SCHEDULE legacySchedule = ScheduleList.Where(p => p.ScheduleID == seminarCatalog.SchID).FirstOrDefault();

                                    schedule = ConvertScheduleToViewModel(legacySchedule);

                                    if (schedule != null)
                                    {
                                        location.Schedules = new List<Schedule>();

                                        location.Schedules.Add(schedule);

                                        // Sub-Schedule

                                        List<SCHEDULE> subLegacyScheduleList = ScheduleList.Where(p => p.ScheduleParentID == seminarCatalog.SchID).ToList();

                                        if (subLegacyScheduleList != null && subLegacyScheduleList.Count > 0)
                                        {
                                            foreach (SCHEDULE subLegacySchedule in subLegacyScheduleList)
                                            {
                                                ViewModels.Schedule subSchedule = ConvertScheduleToViewModel(subLegacySchedule);

                                                if (subSchedule != null)
                                                {
                                                    location.Schedules.Add(subSchedule);
                                                }
                                            }
                                        }
                                    }

                                    seminar.Locations = new List<ViewModels.Location>();
                                    seminar.Locations.Add(location);
                                }
                            }

                            resultsList.Add(seminar);
                        }

                    }
                }
            }


            return resultsList;
        }


        /// <summary>
        /// Convert the legacy seminar to the new ViewModel
        /// </summary>
        /// <param name="seminarCatalog"></param>
        /// <returns></returns>
        private Seminar ConvertSeminarCatalogToViewModel(Seminar_Catalog seminarCatalog)
        {
            Seminar result = new Seminar();

            result.Title = seminarCatalog.TitlePlain;
            result.SubTitle = seminarCatalog.WebToolTip;
            result.ImageUrl = "/test.gif";
            result.DetailsUrl = "/seminars/test";

            return result;
        }


        /// <summary>
        /// Convert the legacy schedule to the new ViewModel
        /// </summary>
        /// <param name="schedule"></param>
        /// <returns></returns>
        private Schedule ConvertScheduleToViewModel(SCHEDULE schedule)
        {
            Schedule result = new Schedule();
            ScheduleCourseInstructor scheduleCourse = ScheduleCourseList.Where(p => p.ScheduleID == schedule.ScheduleID).FirstOrDefault();

            if (scheduleCourse != null)
            {
                COURS course = CourseList.Where(p => p.CourseID == scheduleCourse.CourseID).FirstOrDefault();

                if (course != null)
                {
                    result.Id = schedule.ScheduleID;
                    result.DaysTitle = GetDaysTitle(course.CourseFormatID);
                    result.DaysDescription = course.CertTitle1 + (false == string.IsNullOrWhiteSpace(course.CertTitle2) ? " - " + course.CertTitle2 : "");
                    result.Date = schedule.ScheduleDateDescription;
                    result.Price = Convert.ToDouble(course.CourseFee);
                    result.Description = course.GoogleDesc;
                }
            }

            return result;
        }
        

        /// <summary>
        /// Get the schedule's days title (Day 1, Day 2, Both Days, etc)
        /// </summary>
        /// <param name="courseFormatId"></param>
        /// <returns></returns>
        private string GetDaysTitle(int courseFormatId)
        {
            string daysTitle = "";

            CourseFormat courseFormat = CourseFormatList.Where(p => p.CourseFormatID == courseFormatId).FirstOrDefault();

            if (courseFormat != null)
            {
                daysTitle = courseFormat.CourseFormatName;
            }

            return daysTitle;
        }


        
    }
}

