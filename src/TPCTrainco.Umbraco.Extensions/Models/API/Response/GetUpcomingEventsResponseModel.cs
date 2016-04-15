using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TPCTrainco.Umbraco.Extensions.Models.Account;

namespace TPCTrainco.Umbraco.Extensions.Models.API.Response
{
    public class GetUpcomingEventsResponseModel : ResponseBaseModel
    {
        public IEnumerable<CourseModel> Result { get; set; }
    }
}
