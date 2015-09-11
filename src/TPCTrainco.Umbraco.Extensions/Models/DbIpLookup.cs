using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TPCTrainco.Umbraco.Extensions.Models
{
    public class DbIpLookup
    {
        public string Address { get; set; }
        public string City { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        [JsonProperty(PropertyName = "stateprov")]
        public string StateProv { get; set; }
        public string Country { get; set; }
    }
}
