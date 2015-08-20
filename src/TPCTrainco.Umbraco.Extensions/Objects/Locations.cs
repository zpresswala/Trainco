using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MoreLinq;

namespace TPCTrainco.Umbraco.Extensions.Objects
{
    public class Locations
    {
        public List<Seminar_Catalog> SeminarList = null;


        public Locations()
        {
            SeminarList = CacheObjects.GetSeminarList();
        }

        public List<ViewModels.Location> GetAllLocations()
        {
            List<ViewModels.Location> locations = null;

            if (SeminarList != null && SeminarList.Count > 0)
            {
                locations = new List<ViewModels.Location>();

                foreach (Seminar_Catalog seminarCatalog in SeminarList)
                {
                    ViewModels.Location location = new ViewModels.Location();

                    location.CityState = seminarCatalog.City + ", " + seminarCatalog.State;
                    locations.Add(location);
                }
            }

            if (locations != null && locations.Count > 0)
            {
                locations = locations.DistinctBy(p => p.CityState).OrderBy(p => p.CityState).ToList();
            }

            return locations;
        }
    }
}
