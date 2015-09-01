using GoogleMaps.LocationServices;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data.Entity.Spatial;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TPCTrainco.Umbraco.Extensions.Models;

namespace TPCTrainco.Umbraco.Extensions.Objects
{
    public class GeoCoordinates
    {
        /// <summary>
        /// Get coordinate details (CoordinateDetails) from IP address
        /// </summary>
        /// <param name="ipAddress"></param>
        /// <returns></returns>
        public static CoordinateDetails GetCoordinateDetailsFromIp(string ipAddress)
        {
            CoordinateDetails coordinateDetails = null;
            GeoLocationLookup geoLocation = null;

            using (var objClient = new System.Net.WebClient())
            {
                string json = null;

                try
                {
                    json = objClient.DownloadString("http://freegeoip.net/json/" + ipAddress);

                    geoLocation = JsonConvert.DeserializeObject<GeoLocationLookup>(json);
                }
                catch { }
            }

            if (geoLocation != null)
            {
                if (geoLocation.Latitude != 0)
                {
                    coordinateDetails = new CoordinateDetails();

                    MapPoint mapPoint = new MapPoint();

                    mapPoint.Latitude = geoLocation.Latitude;
                    mapPoint.Longitude = geoLocation.Longitude;

                    coordinateDetails = GetCoordinateDetailsFromLatLong(mapPoint);
                    coordinateDetails.City = geoLocation.City;
                    coordinateDetails.State = geoLocation.RegionName;
                    coordinateDetails.StateCode = geoLocation.RegionCode;

                    if (true == string.IsNullOrWhiteSpace(coordinateDetails.City) || true == string.IsNullOrWhiteSpace(coordinateDetails.State))
                    {
                        coordinateDetails = null;
                    }
                }
            }


            return coordinateDetails;
        }


        /// <summary>
        /// Get coordinate details (CoordinateDetails) from lat/long
        /// </summary>
        /// <param name="mapPoint"></param>
        /// <returns></returns>
        public static CoordinateDetails GetCoordinateDetailsFromLatLong(MapPoint mapPoint)
        {
            CoordinateDetails coordinateDetails = null;

            if (mapPoint != null)
            {
                coordinateDetails = new CoordinateDetails();

                coordinateDetails.Latitude = mapPoint.Latitude;
                coordinateDetails.Longitude = mapPoint.Longitude;

                coordinateDetails.DbGeography = DbGeography.FromText("POINT(" + coordinateDetails.Longitude + " " + coordinateDetails.Latitude + ")", 4326);
            }

            return coordinateDetails;
        }


        /// <summary>
        /// Get coordinate details (CoordinateDetails) from lat/long (or zip)
        /// </summary>
        /// <param name="cityState"></param>
        /// <returns></returns>
        public static CoordinateDetails GetCoordinateDetailsFromCityState(string cityState)
        {
            CoordinateDetails coordinateDetails = null;

            MapPoint mapPoint = GetCoordinatesFromCityState(cityState);

            coordinateDetails = GetCoordinateDetailsFromLatLong(mapPoint);

            return coordinateDetails;
        }


        /// <summary>
        /// Get coordinates (MapPoint) from city/state
        /// </summary>
        /// <param name="cityState"></param>
        /// <returns></returns>
        public static MapPoint GetCoordinatesFromCityState(string cityState)
        {
            GoogleLocationService locationService = new GoogleLocationService();

            MapPoint mapPoint = locationService.GetLatLongFromAddress(cityState);

            return mapPoint;
        }


        /// <summary>
        /// Update all city coordinates in database
        /// </summary>
        /// <returns></returns>
        public static string UpdateCityCoordinates()
        {
            string result = null;
            StringBuilder sb = new StringBuilder();

            GoogleLocationService locationService = new GoogleLocationService();

            List<City> cityList = null;
            List<State> stateList = null;

            sb.AppendLine("Getting city list...");

            using (var db = new ATI_DevelopmentEntities1())
            {
                cityList = db.Set<City>().ToList();
                stateList = db.Set<State>().ToList();
            }

            if (cityList != null && stateList != null && cityList.Count > 0)
            {
                sb.AppendLine("Cities found: " + cityList.Count);

                foreach (City city in cityList)
                {
                    sb.AppendLine("City: " + city.CityName);

                    if (city.Latitude == null || city.Longitude == null)
                    {
                        sb.AppendLine(" - Coordinates NOT found.");

                        State state = stateList.Where(p => p.StateID == city.StateID).FirstOrDefault();

                        if (state != null)
                        {
                            string address = city.CityName + ", " + state.StateName;

                            sb.AppendLine(" - Looking for coordinates for: " + address);

                            MapPoint mapPoint = GetCoordinatesFromCityState(address);

                            if (mapPoint != null)
                            {
                                CoordinateDetails coordinateDetails = GetCoordinateDetailsFromLatLong(mapPoint);

                                if (coordinateDetails != null)
                                {
                                    city.Latitude = coordinateDetails.Latitude;
                                    city.Longitude = coordinateDetails.Longitude;

                                    sb.AppendLine(" - Coordinates - Lat: " + city.Latitude + " Lon: " + city.Longitude);

                                    city.Coordinates = coordinateDetails.DbGeography;

                                    using (var dbContext = new ATI_DevelopmentEntities1())
                                    {
                                        dbContext.Entry(city).State = System.Data.Entity.EntityState.Modified;

                                        sb.AppendLine(" - Saving record...");

                                        dbContext.SaveChanges();

                                        sb.AppendLine(" - Saved.");
                                    }
                                }
                                else
                                {
                                    sb.AppendLine(" - Coordinate lookup failed.");
                                }
                            }
                            else
                            {
                                sb.AppendLine(" - Coordinate lookup failed.");
                            }
                        }
                    }
                    else
                    {
                        sb.AppendLine(" - Coordinates found.");
                    }

                    sb.AppendLine();
                }
            }
            else
            {
                sb.AppendLine("No cities found.");
            }

            return result;
        }
    }
}
