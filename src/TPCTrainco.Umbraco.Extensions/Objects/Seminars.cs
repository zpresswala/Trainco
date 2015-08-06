using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TPCTrainco.Umbraco.Extensions.Models;
using TPCTrainco.Umbraco.Extensions.ViewModels;
using MoreLinq;
using System.Text.RegularExpressions;
using System.Data.Entity.SqlServer;

namespace TPCTrainco.Umbraco.Extensions.Objects
{
    public class Seminars
    {
        public List<Seminar_Catalog> SeminarList = null;
        public List<SCHEDULE> ScheduleList = null;
        public List<COURS> CourseList = null;
        public List<ScheduleCourseInstructor> ScheduleCourseList = null;
        public List<CourseFormat> CourseFormatList { get; set; }
        public List<CourseTopic> CourseTopicList { get; set; }

        public Seminars()
        {
            SeminarList = CacheObjects.GetSeminarList();
            ScheduleList = CacheObjects.GetScheduleList();
            CourseList = CacheObjects.GetCourseList();
            ScheduleCourseList = CacheObjects.GetScheduleCourseList();
            CourseFormatList = CacheObjects.GetCourseFormatList();
            CourseTopicList = CacheObjects.GetCourseTopicList();
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
                CoordinateDetails coordinateDetails = GeoCoordinates.GetCoordinateDetailsFromCityState(request.Location);

                if (coordinateDetails != null)
                {
                    seminarListSearch = FindLocationSeminarCatalog(seminarListSearch, coordinateDetails);
                }
                else
                {
                    seminarListSearch = null;
                }
            }

            // Dates are required, if not present, create default;
            if (request.Dates == null || request.Dates.Min == null || request.Dates.Max == null)
            {
                DateTime nowDate = DateTime.Now;

                request.Dates = new Dates();

                request.Dates.Min = new Min();
                request.Dates.Max = new Max();

                request.Dates.Min.MinMonthVal = nowDate.Month;
                request.Dates.Min.MinYearVal = nowDate.Year;

                request.Dates.Max.MaxMonthVal = nowDate.AddMonths(3).Month;
                request.Dates.Max.MaxYearVal = nowDate.AddMonths(3).Year;
            }

            if (request.Dates != null)
            {
                // filter date min
                if (request.Dates.Min != null)
                {
                    DateTime minDate = DateTime.Parse(request.Dates.Min.MinMonthVal + "/1/" + request.Dates.Min.MinYearVal);

                    seminarListSearch = seminarListSearch.Where(p => p.SchDate >= minDate).ToList();
                }
                // filter date max
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

            // Create Seminar object list
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


        public Course GetCourseById(int id)
        {
            Course result = null;

            COURS course = CourseList.Where(p => p.CourseID == id).FirstOrDefault();

            if (course != null)
            {
                result = ConvertCourseToViewModel(course);
            }

            return result;
        }


        public CourseCategory GetCourseCategoryById(int id)
        {
            CourseCategory result = null;

            CourseTopic courseTopic = CourseTopicList.Where(p => p.CourseTopicID == id).FirstOrDefault();

            if (courseTopic != null)
            {
                result = ConvertCourseCategoryToViewModel(courseTopic);
            }

            return result;
        }


        public List<Course> GetCourseList()
        {
            List<Course> result = null;

            if (CourseList != null && CourseList.Count > 0)
            {
                result = new List<Course>();

                foreach (COURS courseLegacy in CourseList)
                {
                    Course course = ConvertCourseToViewModel(courseLegacy);

                    if (course != null)
                    {
                        result.Add(course);
                    }
                }
            }

            return result;
        }


        public List<CourseCategory> GetCourseCategoryList()
        {
            List<CourseCategory> result = null;

            List<CourseTopic> courseTopicList = CourseTopicList;

            if (courseTopicList != null && courseTopicList.Count > 0)
            {
                result = new List<CourseCategory>();

                foreach (CourseTopic courseTopicLegacy in courseTopicList)
                {
                    CourseCategory courseCategory = ConvertCourseCategoryToViewModel(courseTopicLegacy);

                    if (courseCategory != null)
                    {
                        result.Add(courseCategory);
                    }
                }
            }

            return result;
        }


        private List<Seminar_Catalog> FindLocationSeminarCatalog(List<Seminar_Catalog> seminarListSearch, CoordinateDetails coordinateDetails)
        {
            List<Seminar_Catalog> resultSearch = null;
            double radiusSearch = 20;

            while ((resultSearch == null || resultSearch.Count <= 0) && radiusSearch < 1500)
            {
                resultSearch = RadialSearchSeminarCatalog(seminarListSearch, coordinateDetails, radiusSearch);

                radiusSearch *= 2;
            }

            return resultSearch;
        }


        /// <summary>
        /// Perform a radial search in miles on seminar catalog
        /// </summary>
        /// <param name="seminarListSearch"></param>
        /// <param name="coordinateDetails"></param>
        /// <param name="radiusInMiles"></param>
        /// <returns></returns>
        private List<Seminar_Catalog> RadialSearchSeminarCatalog(List<Seminar_Catalog> seminarListSearch, CoordinateDetails coordinateDetails, double radiusInMiles)
        {
            List<Seminar_Catalog> tempSearch = null;

            tempSearch = seminarListSearch.Where(x => x.Coordinates.Distance(coordinateDetails.DbGeography) * 0.00062 <= radiusInMiles)
                    .OrderBy(p => p.Coordinates.Distance(coordinateDetails.DbGeography)).ToList();

            return tempSearch;
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


        private Course ConvertCourseToViewModel(COURS course)
        {
            Course result = new Course();

            if (course != null)
            {
                CourseFormat courseFormat = CourseFormatList.Where(p => p.CourseFormatID == course.CourseFormatID).FirstOrDefault();
                CourseTopic courseTopic = CourseTopicList.Where(p => p.CourseTopicID == course.CourseTopicID).FirstOrDefault();
                CourseCategory category = null;

                if (courseTopic != null)
                {
                    category = ConvertCourseCategoryToViewModel(courseTopic);
                }

                result.Id = course.CourseID;
                result.CategoryId = course.CourseTopicID;
                result.Category = category;
                result.TypeId = course.CourseTypeID;
                result.CountryId = course.CountryID ?? 0;
                result.FormatName = courseFormat != null ? courseFormat.CourseFormatName : null;
                result.CreditsText = course.CourseCredits;
                result.ToolTip = course.WebToolTip;
                result.TimesText = course.CourseTimes;
                result.Title = course.TitlePlain;
                result.FeeText = course.CourseFeeDescription;
                result.CourseFee = course.CourseFee;
                result.CertTitle = course.CertTitle1;
                result.CertTitle2 = course.CertTitle2;
            }

            return result;
        }


        private CourseCategory ConvertCourseCategoryToViewModel(CourseTopic courseTopic)
        {
            CourseCategory result = new CourseCategory();

            if (courseTopic != null)
            {
                result.Id = courseTopic.CourseTopicID;
                result.Title = courseTopic.CourseTopicName;
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

