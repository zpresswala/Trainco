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
    public class SeminarSearch : SeminarCommon
    {
        public int SchedulePageCount = 10;


        public SeminarSearch()
        {

        }


        public List<Seminar> SearchSeminars(SeminarsSearchRequest2 request)
        {
            List<Seminar> finalSeminarList = null;

            List<CourseDetail> courseDetailList = CourseDetailList;
            List<LocationScheduleDetail> locationScheduleDetailList = LocationScheduleDetailList;

            FilterByClass(ref courseDetailList, ref locationScheduleDetailList, request);
            FilterByDate(ref locationScheduleDetailList, request);
            FilterByLocation(ref locationScheduleDetailList, request);
            FilterByTopic(ref courseDetailList, ref locationScheduleDetailList, request);
            FilterByKeyword(ref locationScheduleDetailList, request);


            courseDetailList = courseDetailList.OrderBy(p => p.CourseTier).ThenBy(t => t.TopicId).ToList();

            //if (false == request.ReturnChildSchedules)
            //{
            //    locationScheduleDetailList = locationScheduleDetailList.Where(p => p.ParentId == 0).ToList();
            //}

            finalSeminarList = CreateSeminarViewModel(courseDetailList, locationScheduleDetailList, request);

            return finalSeminarList;
        }

        private List<Seminar> CreateSeminarViewModel(List<CourseDetail> courseDetailList, List<LocationScheduleDetail> locationScheduleDetailList, SeminarsSearchRequest2 request)
        {
            List<Seminar> seminarViewModelList = new List<Seminar>();

            // Loop through courses
            foreach (CourseDetail courseDetail in courseDetailList)
            {
                Seminar seminar = ConvertCourseDetailToViewModel(courseDetail);

                seminar.LocationSchedules = new List<LocationSchedule>();

                locationScheduleDetailList = locationScheduleDetailList.Where(p => p.ParentId == 0).ToList();

                locationScheduleDetailList = locationScheduleDetailList.OrderBy(p => p.Distance).ThenBy(p => p.DateFilter).ToList();

                List<LocationScheduleDetail> filteredSeminarsByCourseList = locationScheduleDetailList.Where(p => p.CourseId == courseDetail.Id).ToList();

                foreach (LocationScheduleDetail locationScheduleDetail in filteredSeminarsByCourseList)
                {
                    LocationSchedule locationSchedule = new LocationSchedule();

                    locationSchedule = ConvertLocationScheduleToViewModel(locationScheduleDetail);

                    seminar.LocationSchedules.Add(locationSchedule);
                }

                if (true == string.IsNullOrWhiteSpace(request.Location))
                {
                    seminar.LocationSchedules = seminar.LocationSchedules.OrderBy(p => p.State).ThenBy(p => p.City).ThenBy(p => p.DateFilter).ToList();
                }
                else
                {
                    seminar.LocationSchedules = seminar.LocationSchedules.OrderBy(p => p.Distance).ThenBy(p => p.DateFilter).ToList();
                }

                if (request.ClassId > 0)
                {
                    if (request.Page >= 0)
                    {
                        seminar.LocationSchedules = seminar.LocationSchedules.Skip(SchedulePageCount * request.Page).Take(SchedulePageCount).ToList();
                    }
                }
                else
                {
                    seminar.LocationSchedules = seminar.LocationSchedules.Skip(0).Take(SchedulePageCount).ToList();
                }


                seminarViewModelList.Add(seminar);
            }

            seminarViewModelList = seminarViewModelList.Where(p => p.LocationSchedules.Count > 0).ToList();

            return seminarViewModelList;
        }


        public ScheduleDetail GetScheduleDetails(long scheduleId)
        {
            ScheduleDetail scheduleDetail = new ScheduleDetail();

            LocationScheduleDetail locationScheduleDetail = LocationScheduleDetailList.Where(p => p.Id == scheduleId).FirstOrDefault();

            if (locationScheduleDetail != null)
            {
                scheduleDetail.LocationSchedule = ConvertLocationScheduleToViewModel(locationScheduleDetail);

                scheduleDetail.ScheduleList = new List<Schedule>();

                scheduleDetail.ScheduleList.Add(ConvertLocationScheduleDetailToScheduleViewModel(locationScheduleDetail));

                // Sub-Schedule
                bool skipSubSchedules = false;
                if (false == string.IsNullOrWhiteSpace(locationScheduleDetail.ScheduleSeminarNumber) &&
                        (StringUtilities.GetLast(locationScheduleDetail.ScheduleSeminarNumber, 2) == "30" ||
                        StringUtilities.GetLast(locationScheduleDetail.ScheduleSeminarNumber, 2) == "40"))
                {
                    skipSubSchedules = true;
                }

                if (false == skipSubSchedules)
                {
                    List<LocationScheduleDetail> scheduleList = CacheObjects.GetLocationScheduleDetailList().Where(p => p.ParentId == locationScheduleDetail.Id).ToList();

                    if (scheduleList != null && scheduleList.Count > 0)
                    {
                        foreach (LocationScheduleDetail scheduleItem in scheduleList)
                        {
                            scheduleDetail.ScheduleList.Add(ConvertLocationScheduleDetailToScheduleViewModel(scheduleItem));
                        }
                    }
                }
            }


            return scheduleDetail;
        }


        private Seminar ConvertCourseDetailToViewModel(CourseDetail courseDetail)
        {
            Seminar result = new Seminar();

            result.Id = courseDetail.Id;
            result.Title = courseDetail.Title;
            result.SubTitle = courseDetail.SubTitle;
            result.ImageUrl = courseDetail.ImageUrl;
            result.DetailsUrl = courseDetail.DetailsUrl;
            result.Price = courseDetail.Price;

            return result;
        }


        private Schedule ConvertLocationScheduleDetailToScheduleViewModel(LocationScheduleDetail locationScheduleDetail)
        {
            Schedule result = new Schedule();

            result.Id = locationScheduleDetail.Id;
            result.Description = locationScheduleDetail.Description;
            result.DaysTitle = locationScheduleDetail.DaysTitle;
            result.DaysDescription = locationScheduleDetail.DaysDescription;
            result.Date = locationScheduleDetail.Date;
            result.DateFilter = locationScheduleDetail.DateFilter;
            result.DateMonthYear = locationScheduleDetail.DateMonthYear;
            result.Price = locationScheduleDetail.Price;

            return result;
        }



        private LocationSchedule ConvertLocationScheduleToViewModel(LocationScheduleDetail locationScheduleDetail)
        {
            LocationSchedule result = new LocationSchedule();

            result.Id = locationScheduleDetail.Id;
            result.City = locationScheduleDetail.City;
            result.StateCode = locationScheduleDetail.StateCode;
            result.State = locationScheduleDetail.State;
            result.LocationDetails = locationScheduleDetail.LocationDetails;
            result.DateFilter = locationScheduleDetail.DateFilter;
            result.DateMonthYear = locationScheduleDetail.DateMonthYear;
            result.Distance = locationScheduleDetail.Distance ?? 0;

            result.DaysTitle = locationScheduleDetail.DaysTitle;
            result.DaysDescription = locationScheduleDetail.DaysDescription;
            result.Date = locationScheduleDetail.Date;
            result.Price = locationScheduleDetail.Price;
            //result.Description = locationScheduleDetail.Description;

            return result;
        }

    }
}

