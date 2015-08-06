using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.ServiceModel.Channels;
using System.ServiceModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using TPCTrainco.Umbraco.Extensions.Objects;
using TPCTrainco.Umbraco.Extensions.ViewModels;
using System.Web;

namespace TPCTrainco.Umbraco.Extensions.Controllers
{
    public class GeoLocationController : ApiController
    {
        private const string HttpContext = "MS_HttpContext";
        private const string RemoteEndpointMessage = "System.ServiceModel.Channels.RemoteEndpointMessageProperty";

        [HttpGet]
        public GeoLocation GetLocation()
        {
            GeoLocation geoLocation = null;
            string ipAddress = GetClientIp();

            if (false == string.IsNullOrEmpty(ipAddress))
            {
                TPCTrainco.Umbraco.Extensions.Models.CoordinateDetails coordinateDetails = GeoCoordinates.GetCoordinateDetailsFromIp(ipAddress);

                if (coordinateDetails != null && false == string.IsNullOrEmpty(coordinateDetails.City))
                {
                    geoLocation = new GeoLocation();

                    geoLocation.City = coordinateDetails.City;
                    geoLocation.State = coordinateDetails.StateCode;
                }
            }

            return geoLocation;
        }


        private string GetClientIp(HttpRequestMessage request = null)
        {
            request = request ?? Request;

            if (request.Properties.ContainsKey("MS_HttpContext"))
            {
                return ((HttpContextWrapper)request.Properties["MS_HttpContext"]).Request.UserHostAddress;
            }
            else if (request.Properties.ContainsKey(RemoteEndpointMessageProperty.Name))
            {
                RemoteEndpointMessageProperty prop = (RemoteEndpointMessageProperty)request.Properties[RemoteEndpointMessageProperty.Name];
                return prop.Address;
            }
            else if (System.Web.HttpContext.Current != null)
            {
                return System.Web.HttpContext.Current.Request.UserHostAddress;
            }
            else
            {
                return null;
            }
        }
    }
}
