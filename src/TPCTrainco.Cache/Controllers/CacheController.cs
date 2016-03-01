using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.ModelBinding;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using TPCTrainco.Cache.Models;
using System.Text;
using System.Diagnostics;
using TPCTrainco.Umbraco.Extensions.Models;
using System.Configuration;
using System.Runtime.Caching;
using TPCTrainco.Umbraco.Extensions;
using TPCTrainco.Umbraco.Extensions.Objects;
using System.Linq;

namespace TPCTrainco.Cache.Controllers
{
    [RoutePrefix("api/Account")]
    public class AccountController : ApiController
    {
        public StringBuilder DebugStr = new StringBuilder();

        public AccountController()
        {
        }

        // GET api/Account/
        [HttpGet]
        public string Index()
        {
            

            DebugApp("Starting Cache Process...", ref DebugStr);




            return "hi";
        }


        public List<CourseDetail> GetCourseDetailList()
        {
            string cacheKey = "CourseDetailList";
            int cacheUpdateInMinutes = Convert.ToInt32(ConfigurationManager.AppSettings.Get("Caching:Minutes:Courses"));
            ObjectCache cache = MemoryCache.Default;

            List<CourseDetail> courseDetailList = cache.Get(cacheKey) as List<CourseDetail>;

            if (courseDetailList == null)
            {
                DebugApp("Course Detail List to Cache...", ref DebugStr);

                List<COURS> courseList = CacheObjects.GetCourseList();

                courseList = courseList.Where(p => p.CourseTier > 0).ToList();

                if (courseList != null && courseList.Count > 0)
                {
                    DebugApp(" - Count: " + courseList.Count, ref DebugStr);

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

                DebugApp(" - Course Detail List Cache Updated", ref DebugStr);
                DebugApp("", ref DebugStr);
            }

            return courseDetailList;
        }


        public List<LocationScheduleDetail> GetLocationScheduleDetailList()
        {
            string cacheKey = "LocationScheduleDetailList";
            int cacheUpdateInMinutes = Convert.ToInt32(ConfigurationManager.AppSettings.Get("Caching:Minutes:ScheduleList"));
            ObjectCache cache = MemoryCache.Default;
            int inc = 0;

            string defaultSearchLocationText = Nodes.Instance.SeminarSearch.GetPropertyValue<string>("locationMessage");

            List<LocationScheduleDetail> locationScheduleDetailList = cache.Get(cacheKey) as List<LocationScheduleDetail>;

            if (locationScheduleDetailList == null)
            {
                DebugApp("Location Schedule Detail List to Cache...", ref DebugStr);

                List<SCHEDULE> seminarList = CacheObjects.GetScheduleList();

                if (seminarList != null && seminarList.Count > 0)
                {
                    DebugApp(" - Count: " + seminarList.Count, ref DebugStr);

                    locationScheduleDetailList = new List<LocationScheduleDetail>();

                    foreach (SCHEDULE legacySchedule in seminarList)
                    {
                        LocationScheduleDetail locationScheduleDetail = new LocationScheduleDetail();

                        ScheduleCourseInstructor scheduleCourse = CacheObjects.GetScheduleCourseList().Where(p => p.ScheduleID == legacySchedule.ScheduleID).FirstOrDefault();
                        COURS legacyCourse = CacheObjects.GetCourseList().Where(p => p.CourseID == scheduleCourse.CourseID).FirstOrDefault();
                        State legacyState = CacheObjects.GetStateList().Where(p => p.StateID == legacySchedule.StateID).FirstOrDefault();
                        City legacyCity = CacheObjects.GetCityAllList().Where(p => p.CityID == legacySchedule.CityID).FirstOrDefault();

                        if (true)
                        {
                            if (scheduleCourse != null && legacyCourse != null && legacyState != null && legacyCity != null)
                            {
                                COURS course = CacheObjects.GetCourseList().Where(p => p.CourseID == scheduleCourse.CourseID).FirstOrDefault();

                                if (course != null)
                                {
                                    locationScheduleDetail.Id = legacySchedule.ScheduleID;
                                    locationScheduleDetail.ParentId = legacySchedule.ScheduleParentID ?? 0;
                                    locationScheduleDetail.ScheduleSeminarNumber = legacySchedule.ScheduleSeminarNumber;
                                    locationScheduleDetail.TopicId = legacyCourse.CourseTopicID;
                                    locationScheduleDetail.CourseId = scheduleCourse.CourseID;
                                    locationScheduleDetail.DaysTitle = CacheObjects.GetDaysTitle(course.CourseFormatID);
                                    locationScheduleDetail.DaysDescription = course.CertTitle1 + (false == string.IsNullOrWhiteSpace(course.CertTitle2) ? " - " + course.CertTitle2 : "");
                                    locationScheduleDetail.Date = legacySchedule.ScheduleDateDescription;
                                    locationScheduleDetail.Price = Convert.ToDouble(course.CourseFee);
                                    locationScheduleDetail.Description = course.GoogleDesc ?? course.TitlePlain;

                                    locationScheduleDetail.City = legacyCity.CityName;
                                    locationScheduleDetail.StateCode = legacyState.StateAbbreviation;
                                    locationScheduleDetail.State = legacyState.StateName;

                                    // get exact location
                                    Location locationDetail = CacheObjects.GetLocationList().Where(p => p.LocationID == legacySchedule.LocationID).FirstOrDefault();

                                    if (locationDetail != null)
                                    {
                                        locationScheduleDetail.LocationDetails = CacheObjects.GetLocationDetails(locationDetail, locationScheduleDetail);
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
                        DebugApp(" - Adding... " + inc, ref DebugStr);
                    }
                }


                CacheItemPolicy policy = new CacheItemPolicy { AbsoluteExpiration = DateTimeOffset.Now.AddMinutes(cacheUpdateInMinutes) };
                cache.Add(cacheKey, locationScheduleDetailList, policy);

                DebugApp(" - Location Schedule Detail List Cache Updated", ref DebugStr);
                DebugApp("", ref DebugStr);
            }

            return locationScheduleDetailList;
        }



        private void DebugApp(string line, ref StringBuilder debug)
        {
            Debug.WriteLine(line);
            debug.AppendLine(line);
        }
    }
}
