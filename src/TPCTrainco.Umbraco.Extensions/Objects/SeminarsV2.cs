using MoreLinq;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.Entity.SqlServer;
using System.Diagnostics;
using System.Linq;
using System.Runtime.Caching;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Web;
using TPCTrainco.Umbraco.Extensions.Helpers;
using TPCTrainco.Umbraco.Extensions.Models;
using TPCTrainco.Umbraco.Extensions.Models.SearchRequest;
using TPCTrainco.Umbraco.Extensions.ViewModels.Angular;
using Umbraco.Core.Models;
using Umbraco.Web;

namespace TPCTrainco.Umbraco.Extensions.Objects
{
    public class SeminarsV2
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
        public CoordinateDetails LocationCoordinates { get; set; }

        UmbracoHelper umbracoHelper = new UmbracoHelper(UmbracoContext.Current);

        public SeminarsV2()
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


        public List<Seminar> SearchSeminars(SeminarsSearchRequest2 request)
        {
            List<Seminar> finalSeminarList = null;
            List<Seminar_Catalog> seminarListSearch = SeminarList;

            FilterByClass(ref seminarListSearch, request);
            FilterByDate(ref seminarListSearch, request);
            FilterByLocation(ref seminarListSearch, request);
            FilterByTopic(ref seminarListSearch, request);

            finalSeminarList = CreateSeminarViewModel(seminarListSearch, request);

            return finalSeminarList;
        }


        private void FilterByClass(ref List<Seminar_Catalog> seminarList, SeminarsSearchRequest2 request)
        {
            if (request.ClassId > 0)
            {
                List<int> scheduleArray = ScheduleCourseList.Where(p => p.CourseID == request.ClassId).Select(x => x.ScheduleID).ToList();

                seminarList = seminarList.Where(p => scheduleArray.Contains(p.SchID)).ToList();
            }
        }


        private void FilterByDate(ref List<Seminar_Catalog> seminarList, SeminarsSearchRequest2 request)
        {
            if (request.DateRage == null || request.DateRage.Min == null | request.DateRage.Max == null)
            {
                request.DateRage = new DateRange();

                request.DateRage.Min = DateTime.Parse(DateTime.Now.ToString("M/1/yyyy"));
                request.DateRage.Max = DateTime.Parse(request.DateRage.Min.AddMonths(4).AddDays(-1).ToString("M/d/yyyy"));
            }

            seminarList = seminarList.Where(p => p.SchDate >= request.DateRage.Min && p.SchDate <= request.DateRage.Max).ToList();
        }


        private void FilterByLocation(ref List<Seminar_Catalog> seminarList, SeminarsSearchRequest2 request)
        {
            if (false == string.IsNullOrEmpty(request.Location))
            {
                LocationCoordinates = GeoCoordinates.GetCoordinateDetailsFromCityState(request.Location);

                if (LocationCoordinates != null)
                {
                    seminarList = FindLocationSeminarCatalog(seminarList, LocationCoordinates, request);
                }
            }
        }


        private void FilterByTopic(ref List<Seminar_Catalog> seminarList, SeminarsSearchRequest2 request)
        {
            if (request.Topics != null && request.Topics.Length > 0)
            {
                List<int> topicArray = new List<int>();

                foreach (string classTopic in request.Topics)
                {
                    int topicId = Objects.Topics.TopicIdByShortName(classTopic);

                    if (topicId > int.MinValue)
                    {
                        topicArray.Add(topicId);
                    }
                }

                seminarList = seminarList.Where(p => topicArray.Any(r => r == p.TopicID)).ToList();
            }
        }


        private List<Seminar> CreateSeminarViewModel(List<Seminar_Catalog> seminarList, SeminarsSearchRequest2 request)
        {
            List<Seminar> seminarViewModelList = new List<Seminar>();

            List<Seminar_Catalog> seminarDistinctList = seminarList.DistinctBy(p => p.TitlePlain).ToList();

            if (seminarDistinctList != null && seminarDistinctList.Count > 0)
            {
                seminarDistinctList = seminarDistinctList.OrderBy(p => p.CourseTier).ThenBy(t => t.TopicID).ToList();
            }

            foreach (Seminar_Catalog seminarDistinct in seminarDistinctList)
            {
                Seminar seminar = ConvertSeminarCatalogToViewModel(seminarDistinct);

                if (seminar != null)
                {
                    List<Seminar_Catalog> seminarsByLocation = seminarList.Where(p => p.TitlePlain == seminarDistinct.TitlePlain).ToList();

                    if (seminarsByLocation != null && seminarsByLocation.Count > 0)
                    {
                        seminar.Locations = new List<ViewModels.Angular.Location>();

                        foreach (Seminar_Catalog seminarCatalog in seminarsByLocation)
                        {
                            ViewModels.Angular.Location location = new ViewModels.Angular.Location();

                            location.City = seminarCatalog.City;
                            location.StateCode = seminarCatalog.State;
                            location.State = seminarCatalog.State;

                            State stateObj = CacheObjects.GetStateList().Where(p => p.StateAbbreviation == seminarCatalog.State).FirstOrDefault();
                            if (stateObj != null)
                            {
                                location.State = stateObj.StateName;
                            }

                            location.DateFilter = seminarCatalog.SchDate;
                            if (LocationCoordinates != null)
                            {
                                location.Distance = seminarCatalog.Coordinates.Distance(LocationCoordinates.DbGeography) ?? 9999999 * 0.00062;
                            }
                            else
                            {
                                location.Distance = 0;
                            }


                            // Main Schedule
                            ViewModels.Angular.Schedule schedule = null;

                            SCHEDULE legacySchedule = ScheduleList.Where(p => p.ScheduleID == seminarCatalog.SchID).FirstOrDefault();

                            schedule = ConvertScheduleToViewModel(legacySchedule);

                            if (schedule != null)
                            {
                                // get exact location
                                Location locationDetail = LocationList.Where(p => p.LocationID == legacySchedule.LocationID).FirstOrDefault();

                                if (locationDetail != null)
                                {
                                    location.LocationDetails = GetLocationDetails(locationDetail, location);
                                }
                                else
                                {
                                    location.LocationDetails = DefaultSearchLocationText;
                                }

                                location.Date = schedule.Date;
                                location.Price = schedule.Price;

                                location.Schedules = new List<Schedule>();

                                location.Schedules.Add(schedule);

                                // Sub-Schedule
                                bool skipSubSchedules = false;
                                if (false == string.IsNullOrWhiteSpace(legacySchedule.ScheduleSeminarNumber) &&
                                        (StringUtilities.GetLast(legacySchedule.ScheduleSeminarNumber, 2) == "30" ||
                                        StringUtilities.GetLast(legacySchedule.ScheduleSeminarNumber, 2) == "40"))
                                {
                                    skipSubSchedules = true;
                                }

                                if (false == skipSubSchedules)
                                {
                                    List<SCHEDULE> subLegacyScheduleList = ScheduleList.Where(p => p.ScheduleParentID == seminarCatalog.SchID).ToList();

                                    if (subLegacyScheduleList != null && subLegacyScheduleList.Count > 0)
                                    {
                                        foreach (SCHEDULE subLegacySchedule in subLegacyScheduleList)
                                        {
                                            Schedule subSchedule = ConvertScheduleToViewModel(subLegacySchedule);

                                            if (subSchedule != null)
                                            {
                                                location.Schedules.Add(subSchedule);
                                            }
                                        }
                                    }
                                }
                            }

                            seminar.Locations.Add(location);
                        }
                    }

                    if (true == string.IsNullOrEmpty(request.Location))
                    {
                        seminar.Locations = seminar.Locations.OrderBy(p => p.State).ThenBy(x => x.DateFilter).ToList();
                    }

                    seminarViewModelList.Add(seminar);
                }

            }


            return seminarViewModelList;
        }




        private Seminar ConvertSeminarCatalogToViewModel(Seminar_Catalog seminarCatalog)
        {
            Seminar result = new Seminar();

            UmbracoHelper UmbracoHelperObj = new UmbracoHelper(UmbracoContext.Current);
            ScheduleCourseInstructor scheduleCourse = ScheduleCourseList.Where(p => p.ScheduleID == seminarCatalog.SchID).FirstOrDefault();

            result.Id = seminarCatalog.SchID;
            result.Title = seminarCatalog.TitlePlain;
            result.SubTitle = seminarCatalog.WebToolTip;

            IPublishedContent seminarNode = Helpers.Nodes.Instance.SeminarItems.Where(p => p.GetProperty("courseLink").Value != null && p.GetProperty("courseLink").Value.ToString() == scheduleCourse.CourseID.ToString()).FirstOrDefault();

            result.ImageUrl = "/images/default-seminar.gif";
            result.DetailsUrl = "#";

            if (scheduleCourse != null)
            {
                if (seminarNode != null)
                {
                    IPublishedContent imageObject = UmbracoHelperObj.Content(seminarNode.Id);
                    result.ImageUrl = imageObject.GetCropUrl("image", "Image");
                    result.DetailsUrl = seminarNode.Url;

                    if (true == seminarNode.HasValue("searchSummaryText"))
                    {
                        result.SubTitle = seminarNode.GetPropertyValue<string>("searchSummaryText");
                    }
                }
            }

            return result;
        }


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
                    result.Description = course.GoogleDesc ?? course.TitlePlain;
                }
            }

            return result;
        }


        private string GetLocationDetails(Location locationDetail, ViewModels.Angular.Location location)
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
                output = locationDetail.LocationName + ", " + location.City + ", " + location.StateCode + " (Street address and directions will be provided via email.)";
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


        private List<Seminar_Catalog> FindLocationSeminarCatalog(List<Seminar_Catalog> seminarListSearch, CoordinateDetails coordinateDetails, SeminarsSearchRequest2 request)
        {
            List<Seminar_Catalog> resultSearch = null;
            double radiusSearch = request.Radius;

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

            tempSearch = seminarListSearch.Where(p => p.Coordinates == null).ToList();

            if (tempSearch != null && tempSearch.Count > 0)
            {
                Debug.WriteLine("Updating coordinates for locations...");

                GeoCoordinates.UpdateCityCoordinates();
            }

            tempSearch = seminarListSearch.Where(x => x.Coordinates != null && x.Coordinates.Distance(coordinateDetails.DbGeography) * 0.00062 <= radiusInMiles)
                    .OrderBy(p => p.Coordinates.Distance(coordinateDetails.DbGeography)).ToList();

            foreach (Seminar_Catalog updateCoordinates in tempSearch)
            {
                updateCoordinates.Latitude = updateCoordinates.Coordinates.Distance(coordinateDetails.DbGeography);
            }

            return tempSearch;
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

