using System;
using System.Collections.Generic;
using System.Data.Entity.Spatial;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TPCTrainco.Umbraco.Extensions.Models
{
    public class CoordinateDetails
    {
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public DbGeography DbGeography { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string StateCode { get; set; }
        public string Debug { get; set; }
    }
}
