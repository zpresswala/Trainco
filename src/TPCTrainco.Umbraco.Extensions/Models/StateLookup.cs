using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TPCTrainco.Umbraco.Extensions.Models
{
    public class StateLookup
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Abbreviation { get; set; }
        public string Country { get; set; }
        public int RegionCode { get; set; }
    }
}
