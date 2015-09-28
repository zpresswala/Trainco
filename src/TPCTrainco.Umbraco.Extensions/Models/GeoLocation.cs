using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TPCTrainco.Umbraco.Extensions.Models
{
    public class GeoLocationLookup
    {
        public string Ip { get; set; }
        public string City { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        [JsonProperty(PropertyName = "region_code")]
        public string RegionCode { get; set; }
        [JsonProperty(PropertyName = "region_name")]
        public string RegionName { get; set; }
        [JsonProperty(PropertyName = "zip_code")]
        public string ZipCode { get; set; }
        [JsonProperty(PropertyName = "country_code")]
        public string CountryCode { get; set; }
        [JsonProperty(PropertyName = "country_name")]
        public string CountryName { get; set; }
    }
}
