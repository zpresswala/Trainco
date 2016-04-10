using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Umbraco.Core.Persistence;
using Umbraco.Core.Persistence.DatabaseAnnotations;

namespace TPCTrainco.Umbraco.Extensions.Models
{
    [TableName("CacheLocationLookup")]
    public class LocationLookup
    {
        public string City { get; set; }
        public string State { get; set; }
        public string StateCode { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
    }
}
