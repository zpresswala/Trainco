using MoreLinq;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.Entity.SqlServer;
using System.Linq;
using System.Runtime.Caching;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Web;
using TPCTrainco.Umbraco.Extensions.Helpers;
using TPCTrainco.Umbraco.Extensions.Models;
using TPCTrainco.Umbraco.Extensions.Models;
using TPCTrainco.Umbraco.Extensions.Models.SearchRequest;
using TPCTrainco.Umbraco.Extensions.ViewModels;
using TPCTrainco.Umbraco.Extensions.ViewModels.Backbone;
using Umbraco.Core.Models;
using Umbraco.Web;

namespace TPCTrainco.Umbraco.Extensions.Objects
{
    public class Seminars
    {
        public List<Seminar_Catalog> SeminarList = null;
        public List<Location> LocationList = null;
        public List<SCHEDULE> ScheduleList = null;
        public List<COURS> CourseList = null;
        public List<ScheduleCourseInstructor> ScheduleCourseList = null;
        public List<CourseFormat> CourseFormatList { get; set; }
        public List<CourseTopic> CourseTopicList { get; set; }
        public IPublishedContent SearchSeminarNode { get; set; }
        public string DefaultSearchLocationText { get; set; }

        UmbracoHelper umbracoHelper = new UmbracoHelper(UmbracoContext.Current);

        private string CacheSearchKey = "SeminarSearch:";

        public Seminars()
        {
            SeminarList = CacheObjects.GetSeminarList();
            LocationList = CacheObjects.GetLocationList();
            ScheduleList = CacheObjects.GetScheduleList();
            CourseList = CacheObjects.GetCourseList();
            ScheduleCourseList = CacheObjects.GetScheduleCourseList();
            CourseFormatList = CacheObjects.GetCourseFormatList();
            CourseTopicList = CacheObjects.GetCourseTopicList();
            SearchSeminarNode = Nodes.Instance.SeminarSearch;
            DefaultSearchLocationText = SearchSeminarNode.GetPropertyValue<string>("locationMessage");
        }


        public List<Sem> SearchSeminars(SeminarsSearchRequest request)
        {
            List<Sem> resultsList = null;
            List<Seminar> finalSeminarList = null;

            finalSeminarList = SearchReturnFullList(request);

            if (finalSeminarList != null && finalSeminarList.Count > 0)
            {
                resultsList = new List<Sem>();

                foreach (Seminar seminar in finalSeminarList)
                {
                    resultsList.Add(ConvertSeminarToBackboneModel(seminar));
                }
            }

            return resultsList;
        }


        public List<Loc> SearchLocations(LocationsSearchRequest request)
        {
            List<Loc> resultsList = null;
            List<Seminar> finalSeminarList = null;

            //"Search:" + finalSeminarList[0].SearchId

            if (request != null && request.CourseId > 0 && false == string.IsNullOrWhiteSpace(request.SearchId))
            {
                finalSeminarList = GetSearchCache(request.SearchId);

                if (finalSeminarList != null && finalSeminarList.Count > 0)
                {
                    RefreshSearchCache(finalSeminarList, request.SearchId);

                    Seminar selectedSeminar = finalSeminarList.Where(p => p.CourseId == request.CourseId).FirstOrDefault();

                    if (selectedSeminar != null)
                    {
                        resultsList = new List<Loc>();

                        foreach (TPCTrainco.Umbraco.Extensions.ViewModels.Location location in selectedSeminar.Locations)
                        {
                            resultsList.Add(ConvertLocationToBackboneModel(location));
                        }
                    }
                }
            }

            return resultsList;
        }


        public List<Sch> SearchSchedules(SchedulesSearchRequest request)
        {
            List<Sch> resultsList = null;
            List<Seminar> finalSeminarList = null;

            //"Search:" + finalSeminarList[0].SearchId

            if (request != null && request.CourseId > 0 && false == string.IsNullOrWhiteSpace(request.SearchId))
            {
                finalSeminarList = GetSearchCache(request.SearchId);

                if (finalSeminarList != null && finalSeminarList.Count > 0)
                {
                    RefreshSearchCache(finalSeminarList, request.SearchId);

                    Seminar selectedSeminar = finalSeminarList.Where(p => p.CourseId == request.CourseId).FirstOrDefault();

                    if (selectedSeminar != null)
                    {
                        List<TPCTrainco.Umbraco.Extensions.ViewModels.Location> locationsList = selectedSeminar.Locations;

                        if (locationsList != null && locationsList.Count > 0)
                        {
                            TPCTrainco.Umbraco.Extensions.ViewModels.Location selectedLocation = locationsList
                                .Where(p => p.CourseId == request.CourseId && p.LocationId == request.LocationId).FirstOrDefault();

                            if (selectedLocation != null)
                            {
                                resultsList = new List<Sch>();

                                foreach(TPCTrainco.Umbraco.Extensions.ViewModels.Schedule schedule in selectedLocation.Schedules)
                                {
                                    resultsList.Add(ConvertScheduleToBackboneModel(schedule));
                                }
                            }
                        }
                    }
                }
            }

            return resultsList;
        }


        /// <summary>
        /// Search Seminars/Courses
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        public List<Seminar> SearchReturnFullList(SeminarsSearchRequest request)
        {
            List<Seminar> finalSeminarList = null;

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
                    return null;
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
                // filter date min and max
                if (request.Dates.Min != null && request.Dates.Max != null)
                {
                    DateTime minDate = DateTime.Parse(request.Dates.Min.MinMonthVal + "/1/" + request.Dates.Min.MinYearVal);
                    DateTime maxDate = DateTime.Parse(request.Dates.Max.MaxMonthVal + "/1/" + request.Dates.Max.MaxYearVal).AddMonths(1).AddDays(-1);

                    seminarListSearch = seminarListSearch.Where(p => p.SchDate >= minDate && p.SchDate <= maxDate).ToList();
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
                finalSeminarList = new List<Seminar>();

                List<Seminar_Catalog> seminarDistinctList = seminarListSearch.DistinctBy(p => p.TitlePlain).ToList();

                // Specify a class id (course id)
                if (request.ClassId > 0)
                {
                    List<Seminar_Catalog> seminarDistinctListTemp = new List<Seminar_Catalog>();

                    foreach(Seminar_Catalog tempSeminar in seminarDistinctList)
                    {
                        ScheduleCourseInstructor scheduleCourse = ScheduleCourseList.Where(p => p.ScheduleID == tempSeminar.SchID && p.CourseID == request.ClassId).FirstOrDefault();

                        if (scheduleCourse != null)
                        {
                            seminarDistinctListTemp.Add(tempSeminar);
                        }
                    }

                    if (seminarDistinctListTemp.Count > 0)
                    {
                        seminarDistinctList = seminarDistinctListTemp;
                    }
                    else
                    {
                        seminarDistinctList = null;
                    }
                }


                if (seminarDistinctList != null && seminarDistinctList.Count > 0)
                {
                    string searchId = Guid.NewGuid().ToString().ToLower();

                    foreach (Seminar_Catalog seminarDistinct in seminarDistinctList)
                    {
                        Seminar seminar = ConvertSeminarCatalogToViewModel(seminarDistinct, searchId);

                        if (seminar != null)
                        {
                            List<Seminar_Catalog> seminarsByLocation = seminarListSearch.Where(p => p.TitlePlain == seminarDistinct.TitlePlain).OrderBy(p => p.SchDate).ToList();

                            if (seminarsByLocation != null && seminarsByLocation.Count > 0)
                            {
                                seminar.Locations = new List<ViewModels.Location>();

                                foreach (Seminar_Catalog seminarCatalog in seminarsByLocation)
                                {
                                    ViewModels.Location location = new ViewModels.Location();

                                    location.LocationId = seminarCatalog.SchID;
                                    location.CourseId = seminar.CourseId;
                                    location.CityState = seminarCatalog.City + ", " + seminarCatalog.State;
                                    location.SearchId = searchId;

                                    // Main Schedule
                                    ViewModels.Schedule schedule = null;

                                    SCHEDULE legacySchedule = ScheduleList.Where(p => p.ScheduleID == seminarCatalog.SchID).FirstOrDefault();

                                    schedule = ConvertScheduleToViewModel(legacySchedule);

                                    if (schedule != null)
                                    {
                                        // get exact location
                                        Location locationDetail = LocationList.Where(p => p.LocationID == legacySchedule.LocationID).FirstOrDefault();

                                        schedule.CourseId = seminar.CourseId;
                                        schedule.LocationId = location.LocationId;

                                        if (locationDetail != null)
                                        {
                                            location.LocationDetails = locationDetail.LocationName;
                                        }
                                        else
                                        {
                                            location.LocationDetails = DefaultSearchLocationText;
                                        }

                                        location.CityId = schedule.CityId;
                                        location.Date = schedule.Date;
                                        location.Price = schedule.Price;

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
                                                    subSchedule.CourseId = seminar.CourseId;
                                                    subSchedule.LocationId = location.LocationId;

                                                    location.Schedules.Add(subSchedule);
                                                }
                                            }
                                        }
                                    }

                                    seminar.Locations.Add(location);
                                }
                            }

                            finalSeminarList.Add(seminar);
                        }

                    }
                }
            }

            if (finalSeminarList != null && finalSeminarList.Count > 0)
            {
                RefreshSearchCache(finalSeminarList, finalSeminarList[0].SearchId);
            }

            return finalSeminarList;
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
        private Seminar ConvertSeminarCatalogToViewModel(Seminar_Catalog seminarCatalog, string searchId)
        {
            Seminar result = new Seminar();

            UmbracoHelper UmbracoHelperObj = new UmbracoHelper(UmbracoContext.Current);
            ScheduleCourseInstructor scheduleCourse = ScheduleCourseList.Where(p => p.ScheduleID == seminarCatalog.SchID).FirstOrDefault();

            result.SeminarId = seminarCatalog.SchID;
            result.CourseId = scheduleCourse.CourseID;
            result.Title = seminarCatalog.TitlePlain;
            result.SubTitle = seminarCatalog.WebToolTip;

            result.ImageUrl = "/assets/images/default-seminar.gif";
            result.DetailsUrl = "#";

            if (scheduleCourse != null)
            {
                IPublishedContent seminarNode = Helpers.Nodes.Instance.SeminarItems.Where(p => p.GetProperty("courseLink").Value != null && p.GetProperty("courseLink").Value.ToString() == scheduleCourse.CourseID.ToString()).FirstOrDefault();

                if (seminarNode != null)
                {
                    IPublishedContent imageObject = UmbracoHelperObj.Content(seminarNode.Id);
                    result.ImageUrl = imageObject.GetCropUrl("image", "Image");
                    result.DetailsUrl = seminarNode.Url;
                }
            }
            
            result.SearchId = searchId;

            return result;
        }


        /// <summary>
        /// Convert the seminar to the Backbone model
        /// </summary>
        /// <param name="seminarCatalog"></param>
        /// <returns></returns>
        private Sem ConvertSeminarToBackboneModel(Seminar seminar)
        {
            Sem result = new Sem();

            result.CourseId = seminar.CourseId;
            result.Title = seminar.Title;
            result.SubTitle = seminar.SubTitle;
            result.ImageUrl = seminar.ImageUrl;
            result.DetailsUrl = seminar.DetailsUrl;
            result.SearchId = seminar.SearchId;

            return result;
        }



        /// <summary>
        /// Convert the location to the Backbone model
        /// </summary>
        /// <param name="location"></param>
        /// <returns></returns>
        private Loc ConvertLocationToBackboneModel(TPCTrainco.Umbraco.Extensions.ViewModels.Location location)
        {
            Loc result = new Loc();

            result.LocationId = location.LocationId;
            result.CityId = location.CityId;
            result.CourseId = location.CourseId;
            result.CityState = location.CityState;
            result.LocationDetails = location.LocationDetails;
            result.Date = location.Date;
            result.Price = location.Price;
            result.SearchId = location.SearchId;

            return result;
        }


        /// <summary>
        /// Convert the location to the Backbone model
        /// </summary>
        /// <param name="location"></param>
        /// <returns></returns>
        private Sch ConvertScheduleToBackboneModel(TPCTrainco.Umbraco.Extensions.ViewModels.Schedule schedule)
        {
            Sch result = new Sch();

            result.Id = schedule.Id;
            result.LocationId = schedule.LocationId;
            result.CourseId = schedule.CourseId;
            result.CityId = schedule.CityId;
            result.DaysTitle = schedule.DaysTitle;
            result.DaysDescription = schedule.DaysDescription;
            result.Date = schedule.Date;
            result.Price = schedule.Price;
            result.Description = schedule.Description;

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
                    result.LocationId = schedule.ScheduleID;
                    result.CourseId = course.CourseID;
                    result.CityId = schedule.CityID;
                    result.DaysTitle = GetDaysTitle(course.CourseFormatID);
                    result.DaysDescription = course.CertTitle1 + (false == string.IsNullOrWhiteSpace(course.CertTitle2) ? " - " + course.CertTitle2 : "");
                    result.Date = schedule.ScheduleDateDescription;
                    result.Price = Convert.ToDouble(course.CourseFee);
                    result.Description = course.GoogleDesc ?? course.TitlePlain;
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


        /// <summary>
        /// Get search cache by search id
        /// </summary>
        /// <param name="searchId"></param>
        /// <returns></returns>
        private List<Seminar> GetSearchCache(string searchId)
        {
            List<Seminar> seminarList = null;
            ObjectCache cache = MemoryCache.Default;

            seminarList = cache.Get(CacheSearchKey + searchId) as List<Seminar>;

            return seminarList;
        }


        /// <summary>
        /// Refresh search cache by search id
        /// </summary>
        /// <param name="seminarList"></param>
        private void RefreshSearchCache(List<Seminar> seminarList, string searchId)
        {
            string cacheKey = CacheSearchKey + searchId;
            int cacheUpdateInMinutes = Convert.ToInt32(ConfigurationManager.AppSettings.Get("Caching:Minutes:SeminarSearch"));
            ObjectCache cache = MemoryCache.Default;

            CacheItemPolicy policy = new CacheItemPolicy { AbsoluteExpiration = DateTimeOffset.Now.AddMinutes(cacheUpdateInMinutes) };
            cache.Add(cacheKey, seminarList, policy);
        }
    }
}

