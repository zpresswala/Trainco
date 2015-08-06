using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TPCTrainco.Umbraco.Extensions.Models
{
    public class SearchLocation
    {
        public string City { get; set; }
        public string State { get; set; }

        public SearchLocation()
        {

        }

        public SearchLocation(string location)
        {
            List<string> locationArray = location.Split(',').Select(s => s.Trim()).ToList();

            if (locationArray.Count == 2)
            {
                this.City = locationArray[0];
                this.State = locationArray[1];
            }
        }
    }
}
