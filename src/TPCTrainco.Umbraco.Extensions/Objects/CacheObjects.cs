using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Runtime.Caching;
using System.Configuration;
using MoreLinq;
using System.Diagnostics;

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
                    seminarList = db.Seminar_Catalog.Where(p => p.WeekOf >= dateStart && p.WeekOf < dateEnd).ToList();
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
    }
}
