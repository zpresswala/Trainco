﻿using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using TPCTrainco.Umbraco.Extensions.Helpers;
using TPCTrainco.Umbraco.Extensions.Models;
using Umbraco.Core.Models;
using Umbraco.Web;
using Umbraco.Core.Services;

namespace TPCTrainco.Umbraco.Extensions.Controllers.v2
{
    public class ContentsController : ApiController
    {
        [HttpGet]
        public object Course(string id = null)
        {
            string output = "";
            UmbracoCourseDetail seminarDetails = new UmbracoCourseDetail();
            IPublishedContent contentResponse = null;

            seminarDetails.ImageUrl = "/assets/images/default-seminar.gif";
            seminarDetails.DetailsUrl = "#";
            try
            {
                UmbracoHelper UmbracoHelperObj = new UmbracoHelper(UmbracoContext.Current);

                if (false == string.IsNullOrWhiteSpace(id))
                {
                    contentResponse = Helpers.Nodes.Instance.SeminarItems.Where(p => p.GetProperty("courseLink").Value != null && p.GetProperty("courseLink").Value.ToString() == id).FirstOrDefault();

                    if (contentResponse != null)
                    {
                        seminarDetails.ImageUrl = "/assets/images/default-seminar.gif";
                        seminarDetails.DetailsUrl = contentResponse.Url;

                        if (contentResponse != null)
                        {
                            seminarDetails.ImageUrl = contentResponse.GetCropUrl("image", "Image");
                        }

                        if (true == contentResponse.HasValue("searchSummaryText"))
                        {
                            seminarDetails.SubTitle = contentResponse.GetPropertyValue<string>("searchSummaryText");
                        }

                        //output = JsonConvert.SerializeObject(seminarDetails);
                    }
                }
            }
            catch (Exception ex)
            {

            }

            return seminarDetails;
        }


        [HttpGet]
        public object CourseList()
        {
            string output = "";
            List<UmbracoCourseDetail> seminarCourseList = new List<UmbracoCourseDetail>();

            try
            {
                UmbracoHelper UmbracoHelperObj = new UmbracoHelper(UmbracoContext.Current);

                IEnumerable<IPublishedContent> seminarList = Helpers.Nodes.Instance.SeminarItems;

                seminarList = Helpers.Nodes.SeminarItemList();

                if (seminarList != null && seminarList.Count() > 0)
                {
                    foreach (IPublishedContent seminarItem in seminarList)
                    {
                        UmbracoCourseDetail courseDetail = new UmbracoCourseDetail();

                        courseDetail.CourseId = 0;
                        courseDetail.NodeId = 0;
                        courseDetail.ImageUrl = "/assets/images/default-seminar.gif";
                        courseDetail.DetailsUrl = "#";

                        if (seminarItem != null)
                        {
                            courseDetail.CourseId = seminarItem.GetPropertyValue<int>("courseLink");
                            courseDetail.NodeId = seminarItem.Id;

                            courseDetail.ImageUrl = seminarItem.GetCropUrl("image", "Image");
                            courseDetail.DetailsUrl = seminarItem.Url;
                            if (true == seminarItem.HasValue("searchSummaryText"))
                            {
                                courseDetail.SubTitle = seminarItem.GetPropertyValue<string>("searchSummaryText");
                            }
                        }

                        seminarCourseList.Add(courseDetail);
                    }
                }

                //if (seminarCourseList != null)
                //{
                //    output = JsonConvert.SerializeObject(seminarCourseList);
                //}
            }
            catch (Exception ex)
            {

            }

            return seminarCourseList;
        }

        [HttpGet]
        public void LinkSeminarToCourse()
        {
            try
            {
                UmbracoHelper UmbracoHelperObj = new UmbracoHelper(UmbracoContext.Current);
                var contentService = new ContentService();
                IEnumerable<IPublishedContent> seminarList = Helpers.Nodes.Instance.SeminarItems;
                seminarList = Helpers.Nodes.SeminarItemList();
                if (seminarList == null && seminarList.Count() == 0)
                    return;
                Dictionary<int, string> dtCourses = new Dictionary<int, string>();
                using(var db = new americantraincoEntities()) {
                    dtCourses = db.COURSES.Where(x => x.Active == 1).ToDictionary(x => x.CourseID, x => x.CourseTitle.ToLower());
                }
                if (dtCourses.Count == 0)
                    return;
                foreach (IPublishedContent seminarItem in seminarList)
                {
                    if (seminarItem == null)
                        continue;
                    int courseLink = seminarItem.GetPropertyValue<int>("courseLink");
                    if (courseLink != 0 && dtCourses.ContainsKey(courseLink))
                        continue;
                    string title = seminarItem.Name;
                    if(!string.IsNullOrEmpty(title))
                        title = title.ToLower().Trim();
                    var item = dtCourses.Where(x => title.Contains(x.Value)).FirstOrDefault();
                    if (string.IsNullOrEmpty(item.Value))
                        continue;
                    var node = contentService.GetById(seminarItem.Id);
                    if (node == null)
                        continue;
                    node.SetValue("courseLink", item.Key);
                    contentService.SaveAndPublishWithStatus(node);
                }
            }
            catch (Exception ex)
            {

            }
        }


        [HttpGet]
        public object SummaryText(string id = null)
        {
            string output = "";
            try
            {
                string key = "locationMessage";
                int iId = Convert.ToInt32(id);
                if(iId == 1)
                    key = "simulcastLocationMessage";
                else if(iId == 2)
                    key = "liveOnlineLocationMessage";
                output = Nodes.Instance.SeminarSearch.GetPropertyValue<string>(key);
            }
            catch (Exception ex) {}
            return output;
        }
    }


}
