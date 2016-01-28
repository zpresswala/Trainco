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
using TPCTrainco.Umbraco.Extensions.ViewModels.Search;
using Umbraco.Core.Models;
using Umbraco.Web;

namespace TPCTrainco.Umbraco.Extensions.Objects
{
    public class SeminarCommon
    {
        public List<CourseDetail> CourseDetailList = null;
        public List<LocationScheduleDetail> LocationScheduleDetailList = null;
        public CoordinateDetails LocationCoordinates { get; set; }

        public int SchedulesPerPage = 10;

        UmbracoHelper umbracoHelper = new UmbracoHelper(UmbracoContext.Current);

        public SeminarCommon()
        {
            CourseDetailList = CacheObjects.GetCourseDetailList();
            LocationScheduleDetailList = CacheObjects.GetLocationScheduleDetailList();
        }


        protected void FilterByClass(ref List<CourseDetail> courseDetailList, ref List<LocationScheduleDetail> locationScheduleDetailList, SeminarsSearchRequest2 request)
        {
            if (request.ClassId > 0)
            {
                courseDetailList = courseDetailList.Where(p => p.Id == request.ClassId).ToList();

                locationScheduleDetailList = locationScheduleDetailList.Where(p => p.CourseId == request.ClassId).ToList();
            }
        }


        protected void FilterByDate(ref List<LocationScheduleDetail> locationScheduleDetailList, SeminarsSearchRequest2 request)
        {
            if (request.DateRage == null || request.DateRage.Min == null | request.DateRage.Max == null)
            {
                request.DateRage = new DateRange();

                request.DateRage.Min = DateTime.Parse(DateTime.Now.ToString("M/1/yyyy"));
                request.DateRage.Max = DateTime.Parse(request.DateRage.Min.AddMonths(4).AddDays(-1).ToString("M/d/yyyy"));
            }

            locationScheduleDetailList = locationScheduleDetailList.Where(p => p.DateFilter >= request.DateRage.Min && p.DateFilter <= request.DateRage.Max).ToList();
        }


        protected void FilterByLocation(ref List<LocationScheduleDetail> locationScheduleDetailList, SeminarsSearchRequest2 request)
        {
            if (request.Radius <= 0)
            {
                request.Radius = 50;
            }

            if (false == string.IsNullOrEmpty(request.Location))
            {
                LocationCoordinates = GeoCoordinates.GetCoordinateDetailsFromCityState(request.Location);

                if (LocationCoordinates != null)
                {
                    locationScheduleDetailList = FindLocationSeminarCatalog(locationScheduleDetailList, LocationCoordinates, request);
                }
            }
        }


        protected void FilterByTopic(ref List<CourseDetail> courseDetailList, ref List<LocationScheduleDetail> locationScheduleDetailList, SeminarsSearchRequest2 request)
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

                courseDetailList = courseDetailList.Where(p => topicArray.Any(r => r == p.TopicId)).ToList();
                locationScheduleDetailList = locationScheduleDetailList.Where(p => topicArray.Any(r => r == p.TopicId)).ToList();
            }
        }


        private List<LocationScheduleDetail> FindLocationSeminarCatalog(List<LocationScheduleDetail> locationScheduleDetailSearch, CoordinateDetails coordinateDetails, SeminarsSearchRequest2 request)
        {
            List<LocationScheduleDetail> resultSearch = null;
            double radiusSearch = request.Radius;

            while ((resultSearch == null || resultSearch.Count <= 0) && radiusSearch < 1500)
            {
                resultSearch = RadialSearchSeminarCatalog(locationScheduleDetailSearch, coordinateDetails, radiusSearch);

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
        private List<LocationScheduleDetail> RadialSearchSeminarCatalog(List<LocationScheduleDetail> locationScheduleDetailSearch, CoordinateDetails coordinateDetails, double radiusInMiles)
        {
            List<LocationScheduleDetail> tempSearch = null;

            tempSearch = locationScheduleDetailSearch.Where(p => p.Coordinates == null).ToList();

            if (tempSearch != null && tempSearch.Count > 0)
            {
                Debug.WriteLine("Updating coordinates for locations...");

                GeoCoordinates.UpdateCityCoordinates();
            }

            tempSearch = locationScheduleDetailSearch.Where(x => x.Coordinates != null && x.Coordinates.Distance(coordinateDetails.DbGeography) * 0.00062 <= radiusInMiles)
                    .OrderBy(p => p.Coordinates.Distance(coordinateDetails.DbGeography)).ToList();

            foreach (LocationScheduleDetail updateCoordinates in tempSearch)
            {
                updateCoordinates.Distance = updateCoordinates.Coordinates.Distance(coordinateDetails.DbGeography);
            }

            return tempSearch;
        }



    }
}
