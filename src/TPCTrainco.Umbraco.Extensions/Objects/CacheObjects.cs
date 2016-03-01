using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Runtime.Caching;
using System.Configuration;
using MoreLinq;
using System.Diagnostics;
using TPCTrainco.Umbraco.Extensions.Models;
using Umbraco.Web;
using Umbraco.Core.Models;
using TPCTrainco.Umbraco.Extensions.Helpers;
using System.Text.RegularExpressions;

namespace TPCTrainco.Umbraco.Extensions.Objects
{
    public class CacheObjects
    {
        public static DateTime dateStart = DateTime.Now.AddDays(-7);
        public static DateTime dateEnd = DateTime.Now.AddMonths(18);

        public static List<Seminar_Catalog> GetSeminarList()
        {
            string cacheKey = "SeminarList";
            int cacheUpdateInMinutes = Convert.ToInt32(ConfigurationManager.AppSettings.Get("Caching:Minutes:SeminarList"));
            ObjectCache cache = MemoryCache.Default;

            List<Seminar_Catalog> seminarList = cache.Get(cacheKey) as List<Seminar_Catalog>;

            if (seminarList == null)
            {
                Debug.WriteLine("Adding Seminar List to Cache...");

                using (var db = new americantraincoEntities())
                {
                    seminarList = db.Seminar_Catalog.Where(p => p.WeekOf >= dateStart && p.WeekOf < dateEnd && p.CourseTier > 0).ToList();
                }

                CacheItemPolicy policy = new CacheItemPolicy { AbsoluteExpiration = DateTimeOffset.Now.AddMinutes(cacheUpdateInMinutes) };
                cache.Add(cacheKey, seminarList, policy);

                Debug.WriteLine(" - Seminar List Cache Updated");
                Debug.WriteLine("");
            }

            return seminarList;
        }


        public static List<SCHEDULE> GetScheduleList()
        {
            string cacheKey = "ScheduleList";
            int cacheUpdateInMinutes = Convert.ToInt32(ConfigurationManager.AppSettings.Get("Caching:Minutes:ScheduleList"));
            ObjectCache cache = MemoryCache.Default;

            List<SCHEDULE> scheduleList = cache.Get(cacheKey) as List<SCHEDULE>;

            if (scheduleList == null)
            {
                Debug.WriteLine("Adding Schedule List to Cache...");

                using (var db = new americantraincoEntities())
                {
                    DateTime dateStart = DateTime.Now.AddDays(-7);
                    DateTime dateEnd = DateTime.Now.AddMonths(18);

                    scheduleList = db.SCHEDULES.Where(p => p.Active == 1 && p.ScheduleDate >= dateStart && p.ScheduleDate < dateEnd).ToList();
                }

                CacheItemPolicy policy = new CacheItemPolicy { AbsoluteExpiration = DateTimeOffset.Now.AddMinutes(cacheUpdateInMinutes) };
                cache.Add(cacheKey, scheduleList, policy);

                Debug.WriteLine(" - Schedule List Cache Updated");
                Debug.WriteLine("");
            }

            return scheduleList;
        }


        public static List<COURS> GetCourseList()
        {
            string cacheKey = "CourseList";
            int cacheUpdateInMinutes = Convert.ToInt32(ConfigurationManager.AppSettings.Get("Caching:Minutes:Courses"));
            ObjectCache cache = MemoryCache.Default;

            List<COURS> courseList = cache.Get(cacheKey) as List<COURS>;

            if (courseList == null)
            {
                Debug.WriteLine("Adding Course List to Cache");

                using (var db = new americantraincoEntities())
                {
                    courseList = db.COURSES.Where(p => p.Active == 1).ToList();
                }

                CacheItemPolicy policy = new CacheItemPolicy { AbsoluteExpiration = DateTimeOffset.Now.AddMinutes(cacheUpdateInMinutes) };
                cache.Add(cacheKey, courseList, policy);

                Debug.WriteLine(" - Course List Cache Updated");
                Debug.WriteLine("");
            }

            return courseList;
        }


        public static List<Location> GetLocationList()
        {
            string cacheKey = "LocationList";
            int cacheUpdateInMinutes = Convert.ToInt32(ConfigurationManager.AppSettings.Get("Caching:Minutes:Locations"));
            ObjectCache cache = MemoryCache.Default;

            List<Location> locationList = cache.Get(cacheKey) as List<Location>;

            if (locationList == null)
            {
                Debug.WriteLine("Adding Location List to Cache...");

                using (var db = new americantraincoEntities())
                {
                    locationList = db.Locations.Where(p => p.Active == 1 && p.LocationID != 1 && p.LocationID != 3).ToList();
                }

                CacheItemPolicy policy = new CacheItemPolicy { AbsoluteExpiration = DateTimeOffset.Now.AddMinutes(cacheUpdateInMinutes) };
                cache.Add(cacheKey, locationList, policy);

                Debug.WriteLine(" - Location List Cache Updated");
                Debug.WriteLine("");
            }

            return locationList;
        }


        public static List<ScheduleCourseInstructor> GetScheduleCourseList()
        {
            string cacheKey = "ScheduleCourseList";
            int cacheUpdateInMinutes = Convert.ToInt32(ConfigurationManager.AppSettings.Get("Caching:Minutes:ScheduleCourses"));
            ObjectCache cache = MemoryCache.Default;

            List<ScheduleCourseInstructor> scheduleCourseList = cache.Get(cacheKey) as List<ScheduleCourseInstructor>;

            if (scheduleCourseList == null)
            {
                Debug.WriteLine("Adding ScheduleCourse List to Cache...");

                using (var db = new americantraincoEntities())
                {
                    scheduleCourseList = db.Set<ScheduleCourseInstructor>().ToList();
                }

                CacheItemPolicy policy = new CacheItemPolicy { AbsoluteExpiration = DateTimeOffset.Now.AddMinutes(cacheUpdateInMinutes) };
                cache.Add(cacheKey, scheduleCourseList, policy);

                Debug.WriteLine(" - ScheduleCourse List Cache Updated");
                Debug.WriteLine("");
            }

            return scheduleCourseList;
        }


        public static List<CourseFormat> GetCourseFormatList()
        {
            string cacheKey = "CourseFormatList";
            int cacheUpdateInMinutes = Convert.ToInt32(ConfigurationManager.AppSettings.Get("Caching:Minutes:CourseFormats"));
            ObjectCache cache = MemoryCache.Default;

            List<CourseFormat> courseFormatList = cache.Get(cacheKey) as List<CourseFormat>;

            if (courseFormatList == null)
            {
                Debug.WriteLine("Adding CourseFormat List to Cache...");

                using (var db = new americantraincoEntities())
                {
                    courseFormatList = db.CourseFormats.Where(p => p.Active == 1).ToList();
                }

                CacheItemPolicy policy = new CacheItemPolicy { AbsoluteExpiration = DateTimeOffset.Now.AddMinutes(cacheUpdateInMinutes) };
                cache.Add(cacheKey, courseFormatList, policy);

                Debug.WriteLine(" - CourseFormat List Cache Updated");
                Debug.WriteLine("");
            }

            return courseFormatList;
        }

        public static List<CourseTopic> GetCourseTopicList()
        {
            string cacheKey = "CourseTopicList";
            int cacheUpdateInMinutes = Convert.ToInt32(ConfigurationManager.AppSettings.Get("Caching:Minutes:CourseTopics"));
            ObjectCache cache = MemoryCache.Default;

            List<CourseTopic> courseTopicList = cache.Get(cacheKey) as List<CourseTopic>;

            if (courseTopicList == null)
            {
                Debug.WriteLine("Adding CourseTopic List to Cache...");

                using (var db = new americantraincoEntities())
                {
                    courseTopicList = db.CourseTopics.Where(p => p.Active == 1 && p.CourseTopicName.Substring(0, 1) != "x" &&
                        p.CourseTopicName.Substring(0, 1) != "y" &&
                        p.CourseTopicName.Substring(0, 1) != "z").ToList();
                }

                CacheItemPolicy policy = new CacheItemPolicy { AbsoluteExpiration = DateTimeOffset.Now.AddMinutes(cacheUpdateInMinutes) };
                cache.Add(cacheKey, courseTopicList, policy);

                Debug.WriteLine(" - CourseTopic List Cache Updated");
                Debug.WriteLine("");
            }

            return courseTopicList;
        }


        public static List<City> GetCityList()
        {
            string cacheKey = "CityList";
            int cacheUpdateInMinutes = Convert.ToInt32(ConfigurationManager.AppSettings.Get("Caching:Minutes:CityList"));
            ObjectCache cache = MemoryCache.Default;

            List<City> cityList = cache.Get(cacheKey) as List<City>;

            if (cityList == null)
            {
                Debug.WriteLine("Adding City List to Cache...");

                using (var db = new americantraincoEntities())
                {
                    cityList = db.Cities.DistinctBy(p => p.MailCode).Where(p => p.Active == 1).ToList();
                }

                CacheItemPolicy policy = new CacheItemPolicy { AbsoluteExpiration = DateTimeOffset.Now.AddMinutes(cacheUpdateInMinutes) };
                cache.Add(cacheKey, cityList, policy);

                Debug.WriteLine(" - City List Cache Updated");
                Debug.WriteLine("");
            }

            return cityList;
        }


        public static List<City> GetCityAllList()
        {
            string cacheKey = "CityAllList";
            int cacheUpdateInMinutes = Convert.ToInt32(ConfigurationManager.AppSettings.Get("Caching:Minutes:CityList"));
            ObjectCache cache = MemoryCache.Default;

            List<City> cityList = cache.Get(cacheKey) as List<City>;

            if (cityList == null)
            {
                Debug.WriteLine("Adding All Cities List to Cache...");

                using (var db = new americantraincoEntities())
                {
                    cityList = db.Cities.Where(p => p.Active == 1).ToList();
                }

                CacheItemPolicy policy = new CacheItemPolicy { AbsoluteExpiration = DateTimeOffset.Now.AddMinutes(cacheUpdateInMinutes) };
                cache.Add(cacheKey, cityList, policy);

                Debug.WriteLine(" - All Cities List Cache Updated");
                Debug.WriteLine("");
            }

            return cityList;
        }


        public static List<State> GetStateList()
        {
            string cacheKey = "StateList";
            int cacheUpdateInMinutes = Convert.ToInt32(ConfigurationManager.AppSettings.Get("Caching:Minutes:StateList"));
            ObjectCache cache = MemoryCache.Default;

            List<State> stateList = cache.Get(cacheKey) as List<State>;

            if (stateList == null)
            {
                Debug.WriteLine("Adding State List to Cache...");

                using (var db = new americantraincoEntities())
                {
                    stateList = db.States.Where(p => p.Active == 1 && p.RepRegion > 0 && p.Sort > 0).OrderBy(o => o.Sort).ToList();
                }

                CacheItemPolicy policy = new CacheItemPolicy { AbsoluteExpiration = DateTimeOffset.Now.AddMinutes(cacheUpdateInMinutes) };
                cache.Add(cacheKey, stateList, policy);

                Debug.WriteLine(" - State List Cache Updated");
            }

            return stateList;
        }


        public static List<Country> GetCountryList()
        {
            string cacheKey = "CountryList";
            int cacheUpdateInMinutes = Convert.ToInt32(ConfigurationManager.AppSettings.Get("Caching:Minutes:CountryList"));
            ObjectCache cache = MemoryCache.Default;

            List<Country> countryList = cache.Get(cacheKey) as List<Country>;

            if (countryList == null)
            {
                Debug.WriteLine("Adding Country List to Cache...");

                using (var db = new americantraincoEntities())
                {
                    countryList = db.Countries.OrderBy(o => o.SortOrder).ToList();
                }

                CacheItemPolicy policy = new CacheItemPolicy { AbsoluteExpiration = DateTimeOffset.Now.AddMinutes(cacheUpdateInMinutes) };
                cache.Add(cacheKey, countryList, policy);

                Debug.WriteLine(" - Country List Cache Updated");
                Debug.WriteLine("");
            }

            return countryList;
        }




        public static List<CourseDetail> GetCourseDetailList()
        {
            string cacheKey = "CourseDetailList";
            int cacheUpdateInMinutes = Convert.ToInt32(ConfigurationManager.AppSettings.Get("Caching:Minutes:Courses"));
            ObjectCache cache = MemoryCache.Default;

            List<CourseDetail> courseDetailList = cache.Get(cacheKey) as List<CourseDetail>;

            if (courseDetailList == null)
            {
                Debug.WriteLine("Course Detail List to Cache...");

                List<COURS> courseList = CacheObjects.GetCourseList();

                courseList = courseList.Where(p => p.CourseTier > 0).ToList();

                if (courseList != null && courseList.Count > 0)
                {
                    Debug.WriteLine(" - Count: " + courseList.Count);

                    courseList = courseList.OrderBy(p => p.CourseTier).ThenBy(t => t.CourseTopicID).ToList();

                    courseDetailList = new List<CourseDetail>();

                    foreach (COURS courseItem in courseList)
                    {
                        CourseDetail courseDetail = new CourseDetail();

                        UmbracoHelper UmbracoHelperObj = new UmbracoHelper(UmbracoContext.Current);

                        courseDetail.Id = courseItem.CourseID;
                        courseDetail.TopicId = courseItem.CourseTopicID;
                        courseDetail.CourseTier = courseItem.CourseTier ?? 0;
                        courseDetail.Title = courseItem.TitlePlain;
                        courseDetail.SubTitle = courseItem.WebToolTip;

                        IPublishedContent seminarNode = Helpers.Nodes.Instance.SeminarItems.Where(p => p.GetProperty("courseLink").Value != null && p.GetProperty("courseLink").Value.ToString() == courseItem.CourseID.ToString()).FirstOrDefault();

                        courseDetail.ImageUrl = "/images/default-seminar.gif";
                        courseDetail.DetailsUrl = "#";
                        courseDetail.Price = Convert.ToDouble(courseItem.CourseFee);

                        if (seminarNode != null)
                        {
                            IPublishedContent imageObject = UmbracoHelperObj.Content(seminarNode.Id);
                            courseDetail.ImageUrl = imageObject.GetCropUrl("image", "Image");
                            courseDetail.DetailsUrl = seminarNode.Url;

                            if (true == seminarNode.HasValue("searchSummaryText"))
                            {
                                courseDetail.SubTitle = seminarNode.GetPropertyValue<string>("searchSummaryText");
                            }
                        }

                        courseDetailList.Add(courseDetail);
                    }

                    courseDetailList = courseDetailList.Where(p => p.DetailsUrl != "#").ToList();
                }


                CacheItemPolicy policy = new CacheItemPolicy { AbsoluteExpiration = DateTimeOffset.Now.AddMinutes(cacheUpdateInMinutes) };
                cache.Add(cacheKey, courseDetailList, policy);

                Debug.WriteLine(" - Course Detail List Cache Updated");
                Debug.WriteLine("");
            }

            return courseDetailList;
        }


        public static List<LocationScheduleDetail> GetLocationScheduleDetailList()
        {
            string cacheKey = "LocationScheduleDetailList";
            int cacheUpdateInMinutes = Convert.ToInt32(ConfigurationManager.AppSettings.Get("Caching:Minutes:ScheduleList"));
            ObjectCache cache = MemoryCache.Default;
            int inc = 0;

            string defaultSearchLocationText = Nodes.Instance.SeminarSearch.GetPropertyValue<string>("locationMessage");

            List<LocationScheduleDetail> locationScheduleDetailList = cache.Get(cacheKey) as List<LocationScheduleDetail>;

            if (locationScheduleDetailList == null)
            {
                Debug.WriteLine("Location Schedule Detail List to Cache...");

                List<SCHEDULE> seminarList = GetScheduleList();

                if (seminarList != null && seminarList.Count > 0)
                {
                    Debug.WriteLine(" - Count: " + seminarList.Count);

                    locationScheduleDetailList = new List<LocationScheduleDetail>();

                    foreach (SCHEDULE legacySchedule in seminarList)
                    {
                        LocationScheduleDetail locationScheduleDetail = new LocationScheduleDetail();

                        ScheduleCourseInstructor scheduleCourse = GetScheduleCourseList().Where(p => p.ScheduleID == legacySchedule.ScheduleID).FirstOrDefault();
                        COURS legacyCourse = GetCourseList().Where(p => p.CourseID == scheduleCourse.CourseID).FirstOrDefault();
                        State legacyState = GetStateList().Where(p => p.StateID == legacySchedule.StateID).FirstOrDefault();
                        City legacyCity = GetCityAllList().Where(p => p.CityID == legacySchedule.CityID).FirstOrDefault();

                        if (true)
                        {
                            if (scheduleCourse != null && legacyCourse != null && legacyState != null && legacyCity != null)
                            {
                                COURS course = GetCourseList().Where(p => p.CourseID == scheduleCourse.CourseID).FirstOrDefault();

                                if (course != null)
                                {
                                    locationScheduleDetail.Id = legacySchedule.ScheduleID;
                                    locationScheduleDetail.ParentId = legacySchedule.ScheduleParentID ?? 0;
                                    locationScheduleDetail.ScheduleSeminarNumber = legacySchedule.ScheduleSeminarNumber;
                                    locationScheduleDetail.TopicId = legacyCourse.CourseTopicID;
                                    locationScheduleDetail.CourseId = scheduleCourse.CourseID;
                                    locationScheduleDetail.DaysTitle = GetDaysTitle(course.CourseFormatID);
                                    locationScheduleDetail.DaysDescription = course.CertTitle1 + (false == string.IsNullOrWhiteSpace(course.CertTitle2) ? " - " + course.CertTitle2 : "");
                                    locationScheduleDetail.Date = legacySchedule.ScheduleDateDescription;
                                    locationScheduleDetail.Price = Convert.ToDouble(course.CourseFee);
                                    locationScheduleDetail.Description = course.GoogleDesc ?? course.TitlePlain;

                                    locationScheduleDetail.City = legacyCity.CityName;
                                    locationScheduleDetail.StateCode = legacyState.StateAbbreviation;
                                    locationScheduleDetail.State = legacyState.StateName;

                                    // get exact location
                                    Location locationDetail = GetLocationList().Where(p => p.LocationID == legacySchedule.LocationID).FirstOrDefault();

                                    if (locationDetail != null)
                                    {
                                        locationScheduleDetail.LocationDetails = GetLocationDetails(locationDetail, locationScheduleDetail);
                                    }
                                    else
                                    {
                                        locationScheduleDetail.LocationDetails = defaultSearchLocationText;
                                    }

                                    locationScheduleDetail.Coordinates = legacyCity.Coordinates;
                                    locationScheduleDetail.DateFilter = legacySchedule.ScheduleDate;
                                    locationScheduleDetail.DateMonthYear = locationScheduleDetail.DateFilter.ToString("M-yyyy");
                                    locationScheduleDetail.Distance = 0;
                                }

                                locationScheduleDetailList.Add(locationScheduleDetail);
                            }
                        }

                        inc++;
                        Debug.WriteLine(" - Adding... " + inc);
                    }
                }


                CacheItemPolicy policy = new CacheItemPolicy { AbsoluteExpiration = DateTimeOffset.Now.AddMinutes(cacheUpdateInMinutes) };
                cache.Add(cacheKey, locationScheduleDetailList, policy);

                Debug.WriteLine(" - Location Schedule Detail List Cache Updated");
                Debug.WriteLine("");
            }

            return locationScheduleDetailList;
        }


        /// <summary>
        /// Get the schedule's days title (Day 1, Day 2, Both Days, etc)
        /// </summary>
        /// <param name="courseFormatId"></param>
        /// <returns></returns>
        public static string GetDaysTitle(int courseFormatId)
        {
            string daysTitle = "";

            CourseFormat courseFormat = GetCourseFormatList().Where(p => p.CourseFormatID == courseFormatId).FirstOrDefault();

            if (courseFormat != null)
            {
                daysTitle = courseFormat.CourseFormatName;
            }

            return daysTitle;
        }


        public static string GetLocationDetails(Location locationDetail, LocationScheduleDetail locationScheduleDetail)
        {
            string output = "";

            if (locationDetail.LocationNotes != null && locationDetail.LocationNotes.IndexOf("<b>LOCATION</b>") >= 0)
            {
                string locationDetails = locationDetail.LocationNotes;

                if (false == string.IsNullOrWhiteSpace(locationDetails))
                {
                    var startTag = "<b>LOCATION";
                    int startIndex = locationDetails.IndexOf(startTag) + startTag.Length;
                    int endIndex = locationDetails.IndexOf("<b>", startIndex);
                    output = locationDetails.Substring(startIndex, endIndex - startIndex);

                    output = output.Replace("<b>LOCATION", "");
                    output = Regex.Replace(output, "<b>", "");
                    output = Regex.Replace(output, "</b>", "");
                    output = output.Trim();
                    output = output.Replace("\r", "<br />" + Environment.NewLine);
                }
            }
            if (true == string.IsNullOrWhiteSpace(output))
            {
                output = locationDetail.LocationName + ", " + locationScheduleDetail.City + ", " + locationScheduleDetail.StateCode + " (Street address and directions will be provided via email.)";
            }


            //<b>CNTOROTH3</b>

            //<b>LOCATION</b>
            //Toronto Airport West Hotel
            //5444 Dixie Rd
            //Mississauga, ON L4W 2L2

            //<b>PHONE</b>
            //905-624-1144

            //<b>DIRECTIONS</b>
            //From Airport: Take 427 South to 401 West, exit Dixie Road South and proceed two lights South on Dixie Road and turn right on Aerowood Drive and left into the Hotel driveway.

            //<b>HOTEL INFORMATION</b>
            //Please feel free to contact the hotel directly to make room reservations and to inquire of any discounts that may apply for American Trainco attendees. 


            return output;
        }
    }
}