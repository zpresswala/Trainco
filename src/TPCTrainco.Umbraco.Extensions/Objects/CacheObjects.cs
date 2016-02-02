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
using Umbraco.Core;
using Umbraco.Core.Persistence;
using System.Net;
using Newtonsoft.Json;

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

                using (americantraincoEntities db = new americantraincoEntities())
                {
                    cityList = db.Cities.MoreLinqDistinctBy(p => p.MailCode).Where(p => p.Active == 1).ToList();
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


        public static List<CourseDetail> GetCourseDetailList(bool noCache = false)
        {
            string cacheKey = "CourseDetailList";
            ObjectCache cache = MemoryCache.Default;
            int cacheUpdateInMinutes = Convert.ToInt32(ConfigurationManager.AppSettings.Get("Caching:Minutes:Courses"));
            List<CourseDetail> courseDetailList = cache.Get(cacheKey) as List<CourseDetail>;

            if (true == noCache || courseDetailList == null)
            {
                var db = ApplicationContext.Current.DatabaseContext.Database;

                Sql sql = null;

                sql = new Sql()
                     .Select("*")
                     .From("CacheCourseDetail");

                courseDetailList = db.Query<CourseDetail>(sql).ToList();
            }

            return courseDetailList;
        }


        public static List<LocationScheduleDetail> GetLocationScheduleDetailList(bool noCache = false)
        {
            string cacheKey = "LocationScheduleDetailList";
            ObjectCache cache = MemoryCache.Default;
            int cacheUpdateInMinutes = Convert.ToInt32(ConfigurationManager.AppSettings.Get("Caching:Minutes:ScheduleList"));
            List<LocationScheduleDetail> locationScheduleDetailList = cache.Get(cacheKey) as List<LocationScheduleDetail>;

            if (true == noCache || locationScheduleDetailList == null)
            {
                var db = ApplicationContext.Current.DatabaseContext.Database;

                Sql sql = null;

                sql = new Sql()
                     .Select("*")
                     .From("CacheLocationScheduleDetail");

                locationScheduleDetailList = db.Query<LocationScheduleDetail>(sql).ToList();
            }

            return locationScheduleDetailList;
        }


        public static List<CourseDetail> GenerateLocalCourseDetailList()
        {
            List<CourseDetail> courseDetailList = new List<CourseDetail>();
            //UmbracoHelper UmbracoHelperObj = new UmbracoHelper(UmbracoContext.Current);

            Console.WriteLine("Course Detail List to Cache...");

            List<COURS> courseList = GetCourseList();

            courseList = courseList.Where(p => p.CourseTier > 0).ToList();

            if (courseList != null && courseList.Count > 0)
            {
                Console.WriteLine(" - Count: " + courseList.Count);

                courseList = courseList.OrderBy(p => p.CourseTier).ThenBy(t => t.CourseTopicID).ToList();

                courseDetailList = new List<CourseDetail>();

                foreach (COURS courseItem in courseList)
                {
                    CourseDetail courseDetail = new CourseDetail();

                    courseDetail.Id = courseItem.CourseID;
                    courseDetail.TopicId = courseItem.CourseTopicID;
                    courseDetail.CourseTier = courseItem.CourseTier ?? 0;
                    courseDetail.Title = courseItem.TitlePlain;
                    courseDetail.SubTitle = courseItem.WebToolTip;

                    courseDetail.ImageUrl = "/images/default-seminar.gif";
                    courseDetail.DetailsUrl = "#";
                    courseDetail.Price = Convert.ToDouble(courseItem.CourseFee);

                    UmbracoCourseDetail umbracoCourse = null;

                    using (WebClient wc = new WebClient())
                    {
                        string umbracoUrl = ConfigurationManager.AppSettings.Get("Umbraco:API:Url") + "/api/contents/course/";
                        var json = wc.DownloadString(umbracoUrl + courseItem.CourseID);

                        umbracoCourse = JsonConvert.DeserializeObject<UmbracoCourseDetail>(json);
                    }

                    if (umbracoCourse != null)
                    {
                        courseDetail.ImageUrl = umbracoCourse.ImageUrl;
                        courseDetail.DetailsUrl = umbracoCourse.DetailsUrl;
                        courseDetail.SubTitle = umbracoCourse.SubTitle;
                    }

                    courseDetailList.Add(courseDetail);
                }

                courseDetailList = courseDetailList.Where(p => p.DetailsUrl != "#").ToList();
            }



            Console.WriteLine(" - Course Detail List Cache Updated");
            Console.WriteLine("");

            if (courseDetailList != null && courseDetailList.Count > 0)
            {
                Console.WriteLine("");
                Console.WriteLine("-= Courses: Updating Local Copy =-");

                var db = ApplicationContext.Current.DatabaseContext.Database;

                // Find delete records
                List<CourseDetail> currentDbCourseList = GetCourseDetailList(true);
                List<CourseDetail> deletedCourseList = currentDbCourseList.Where(p => !courseDetailList.Any(p2 => p2.Id == p.Id)).ToList();
                Console.WriteLine("");
                Console.WriteLine("Delete record count: " + (deletedCourseList != null ? deletedCourseList.Count.ToString() : "null"));
                foreach (CourseDetail deleteCourse in deletedCourseList)
                {
                    db.Delete(deleteCourse);
                    Console.WriteLine(" - Deleted: " + deleteCourse.Id);
                }

                // Insert/update records
                Console.WriteLine("");
                Console.WriteLine("Update record count: " + (courseDetailList != null ? courseDetailList.Count.ToString() : "null"));
                foreach (CourseDetail updateCourse in courseDetailList)
                {
                    CourseDetail findCourse = currentDbCourseList.Where(p => p.Id == updateCourse.Id).FirstOrDefault();

                    if (findCourse != null)
                    {
                        db.Update(updateCourse);
                        Console.WriteLine(" - Updating: " + updateCourse.Id + " - " + updateCourse.Title);
                    }
                    else
                    {
                        db.Insert(updateCourse);
                        Console.WriteLine(" - Inserting: " + updateCourse.Id + " - " + updateCourse.Title);
                    }
                }
            }

            return courseDetailList;
        }


        public static List<LocationScheduleDetail> GenerateLocalLocationScheduleDetailList()
        {
            int inc = 0;

            string defaultSearchLocationText = "Specific location will be provided via email approximately 4 weeks prior to seminar date.";

            using (WebClient wc = new WebClient())
            {
                string umbracoUrl = ConfigurationManager.AppSettings.Get("Umbraco:API:Url") + "/api/contents/SummaryText/";
                string textStr = wc.DownloadString(umbracoUrl);

                defaultSearchLocationText = textStr;
            }

            List<LocationScheduleDetail> locationScheduleDetailList = null;

            Console.WriteLine("Location Schedule Detail List to local DB...");

            List<SCHEDULE> seminarList = GetScheduleList();

            if (seminarList != null && seminarList.Count > 0)
            {
                Console.WriteLine(" - Count: " + seminarList.Count);

                locationScheduleDetailList = new List<LocationScheduleDetail>();

                foreach (SCHEDULE legacySchedule in seminarList)
                {
                    LocationScheduleDetail locationScheduleDetail = new LocationScheduleDetail();

                    ScheduleCourseInstructor scheduleCourse = GetScheduleCourseList().Where(p => p.ScheduleID == legacySchedule.ScheduleID).FirstOrDefault();
                    COURS legacyCourse = GetCourseList().Where(p => p.CourseID == scheduleCourse.CourseID).FirstOrDefault();
                    State legacyState = GetStateList().Where(p => p.StateID == legacySchedule.StateID).FirstOrDefault();
                    City legacyCity = GetCityAllList().Where(p => p.CityID == legacySchedule.CityID).FirstOrDefault();

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
                            locationScheduleDetail.Distance = 0;
                        }

                        locationScheduleDetailList.Add(locationScheduleDetail);
                    }

                    inc++;
                    Console.WriteLine(" - Adding... " + inc);
                }
            }




            if (locationScheduleDetailList != null && locationScheduleDetailList.Count > 0)
            {
                Console.WriteLine("");
                Console.WriteLine("-= Seminars: Updating Local Copy =-");

                var db = ApplicationContext.Current.DatabaseContext.Database;

                // Find delete records
                List<LocationScheduleDetail> currentDbSeminarList = GetLocationScheduleDetailList(true);
                List<LocationScheduleDetail> deletedSeminarList = currentDbSeminarList.Where(p => !locationScheduleDetailList.Any(p2 => p2.Id == p.Id)).ToList();
                Console.WriteLine("");
                Console.WriteLine("Delete record count: " + (deletedSeminarList != null ? deletedSeminarList.Count.ToString() : "null"));
                foreach (CourseDetail deleteCourse in deletedSeminarList)
                {
                    db.Delete(deleteCourse);
                    Console.WriteLine(" - Deleted: " + deleteCourse.Id);
                }

                // Insert/update records
                Console.WriteLine("");
                Console.WriteLine("Update record count: " + (courseDetailList != null ? courseDetailList.Count.ToString() : "null"));
                foreach (CourseDetail updateCourse in courseDetailList)
                {
                    CourseDetail findCourse = currentDbCourseList.Where(p => p.Id == updateCourse.Id).FirstOrDefault();

                    if (findCourse != null)
                    {
                        db.Update(updateCourse);
                        Console.WriteLine(" - Updating: " + updateCourse.Id + " - " + updateCourse.Title);
                    }
                    else
                    {
                        db.Insert(updateCourse);
                        Console.WriteLine(" - Inserting: " + updateCourse.Id + " - " + updateCourse.Title);
                    }
                }
            }



            Console.WriteLine(" - Location Schedule Detail List Updated");
            Console.WriteLine("");

            return locationScheduleDetailList;
        }


        /// <summary>
        /// Get the schedule's days title (Day 1, Day 2, Both Days, etc)
        /// </summary>
        /// <param name="courseFormatId"></param>
        /// <returns></returns>
        protected static string GetDaysTitle(int courseFormatId)
        {
            string daysTitle = "";

            CourseFormat courseFormat = GetCourseFormatList().Where(p => p.CourseFormatID == courseFormatId).FirstOrDefault();

            if (courseFormat != null)
            {
                daysTitle = courseFormat.CourseFormatName;
            }

            return daysTitle;
        }


        protected static string GetLocationDetails(Location locationDetail, LocationScheduleDetail locationScheduleDetail)
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

    public static class MoreLinqWrapper
    {
        public static IEnumerable<TSource> MoreLinqDistinctBy<TSource, TKey>(this IEnumerable<TSource> source, Func<TSource, TKey> keySelector)
        {
            return MoreEnumerable.DistinctBy(source, keySelector);
        }
    }
}
