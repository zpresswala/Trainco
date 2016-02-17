using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Umbraco.Core.Models;
using Umbraco.Web;

namespace TPCTrainco.Umbraco.Extensions.Helpers
{
    public class GenerateJavascript
    {
        public static string Homepage()
        {
            string output = "";

            var umbracoHelper = new UmbracoHelper(UmbracoContext.Current);
            IPublishedContent homePage = umbracoHelper.TypedContentAtRoot().FirstOrDefault();
            IPublishedContent searchSeminarNode = Nodes.Instance.SeminarSearch;

            IPublishedContent seminarMainOverview = homePage.Children.FirstOrDefault(n => n.IsDocumentType("SeminarMainOverview"));
            IEnumerable<IPublishedContent> seminarCategoryList = seminarMainOverview.Children.Where(n => n.IsDocumentType("SeminarCategory"));

            IPublishedContent seminarCatalog = homePage.Descendants("SeminarCatalog").FirstOrDefault();

            //List locations

            //List<City> cityList = CacheObjects.GetCityList();
            //List<State> stateList = CacheObjects.GetStateList();

            string allIconUrl = "";
            string allTotalSeminars = "";

            if (seminarCatalog != null)
            {
                allIconUrl = seminarCatalog.GetCropUrl("searchIcon", "Image");

                if (true == seminarCatalog.HasValue("totalSeminars"))
                {
                    allTotalSeminars = "<p class=\"num-seminars\">" + string.Format("{0:N0}", seminarCatalog.GetPropertyValue<decimal>("totalSeminars")) + " Total Seminars</p>";
                }

            }


            output += "<div class=\"col-md-11 topic-circles\">";

            output += "<h3>Select one or more topics and choose your location</h3>";
            output += "<ul>";

            output += "<li class=\"seminar-topic\" id=\"selectAllWrap\"><input id=\"selectAllCheck\" type=\"checkbox\" name=\"selectAllCheck\" ng-model=\"vm.classTopics.all\"> <label class=\"checkbox-inline\" for=\"selectAllCheck\"></label>";
            output += "<p>All Seminar Topics</p> " + allTotalSeminars + "</li>";

            foreach (IPublishedContent category in seminarCategoryList)
            {
                string shortName = category.GetPropertyValue<string>("shortName");
                string iconUrl = category.GetCropUrl("searchIcon", "Image");
                string dataTopic = shortName.ToLower();
                string totalSeminars = "";

                if (true == category.HasValue("totalSeminars"))
                {
                    totalSeminars = "<p class=\"num-seminars\">" + string.Format("{0:N0}", category.GetPropertyValue<decimal>("totalSeminars")) + " Seminars</p>";
                }

                if (dataTopic == "plant management")
                {
                    dataTopic = "plant";
                }
                else if (dataTopic == "mechanical and industrial")
                {
                    dataTopic = "mechanical";
                }

                output += "<li class=\"seminar-topic\" id=\""+ dataTopic + "Wrap\"><input id=\"" + dataTopic + "Check\" type=\"checkbox\" name=\"" + dataTopic + "Check\" ng-model=\"vm.classTopics." + dataTopic + "\"> <label class=\"checkbox-inline\" for=\"" + dataTopic + "Check\"></label>";
                output += "<p>"+ shortName + "</p> "+ totalSeminars + "</li>";
            }

            output += "</ul>";
            output += "<select selector=\"\" model=\"vm.courseSearch.location\" multi=\"false\" options=\"vm.cities\" value-attr=\"label\" placeholder=\"Choose a City, Enter a Zip Code, or Select \'All Locations\'\" create=\"vm.createFunction(input)\"></select>";
            output += "<rzslider rz-slider-model=\"vm.sliderValues.minValue\" rz-slider-high=\"vm.sliderValues.maxValue\" rz-slider-options=\"vm.sliderValues.options\"></rzslider>";
            output += "<a class=\"btn-reg btn-white\" type=\"submit\" ng-click=\"vm.doParamSearch(vm.course.classTopics)\" id=\"search-btn\" role=\"button\">Search</a>";

            output += "</div>";


            return output;
        }

    }
}
