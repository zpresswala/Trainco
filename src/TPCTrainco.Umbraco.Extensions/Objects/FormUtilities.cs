using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace TPCTrainco.Umbraco.Extensions.Objects
{
    public class FormUtilities
    {
        public static IEnumerable<SelectListItem> GetStateList()
        {
            IList<SelectListItem> items = new List<SelectListItem>();

            items.Add(new SelectListItem {Text = "State / Province", Value = ""});

            List<State> stateList = Objects.CacheObjects.GetStateList();

            foreach (State state in stateList)
            {
                items.Add(new SelectListItem {Text = state.StateName, Value = state.StateAbbreviation});
            }

            return items;
        }


        public static IEnumerable<SelectListItem> GetCountryList(bool onlyUsCanada = true)
        {
            IList<SelectListItem> items = new List<SelectListItem>();

            items.Add(new SelectListItem { Text = "Country", Value = "" });

            if (false == onlyUsCanada)
            {
                List<Country> countryList = Objects.CacheObjects.GetCountryList();

                foreach (Country country in countryList)
                {
                    items.Add(new SelectListItem { Text = country.CountryName, Value = country.CountryCode });
                }
            }
            else
            {
                items.Add(new SelectListItem { Text = "United States", Value = "US" });
                items.Add(new SelectListItem { Text = "Canada", Value = "CA" });
            }

            return items;
        }


        public static IEnumerable<SelectListItem> HearAboutList()
        {
            IList<SelectListItem> items = new List<SelectListItem>();

            items.Add(new SelectListItem { Text = "How did you learn about the seminar(s) you’re purchasing?", Value = "" });
            items.Add(new SelectListItem { Text = "Direct Mail", Value = "Direct Mail" });
            items.Add(new SelectListItem { Text = "Email", Value = "Email" });
            items.Add(new SelectListItem { Text = "Web search", Value = "Web search" });
            items.Add(new SelectListItem { Text = "Internet Ad", Value = "Internet Ad" });
            items.Add(new SelectListItem { Text = "Print Ad", Value = "Print Ad" });
            items.Add(new SelectListItem { Text = "Referral", Value = "Referral" });
            items.Add(new SelectListItem { Text = "Trade Show", Value = "Trade Show" });
            items.Add(new SelectListItem { Text = "Other", Value = "Other" });

            return items;
        }


        public static IEnumerable<SelectListItem> PaymentTypeList()
        {
            IList<SelectListItem> items = new List<SelectListItem>();

            items.Add(new SelectListItem { Text = "Payment Type", Value = "" });
            items.Add(new SelectListItem { Text = "Credit Card", Value = "credit" });
            items.Add(new SelectListItem { Text = "Invoice Me", Value = "invoice" });

            return items;
        }


        public static IEnumerable<SelectListItem> IndustryList()
        {
            IList<SelectListItem> items = new List<SelectListItem>();

            items.Add(new SelectListItem { Text = "", Value = "" });
            items.Add(new SelectListItem { Text = "Manufacturing", Value = "Manufacturing" });
            items.Add(new SelectListItem { Text = "Retail / Wholesale Trade", Value = "Retail / Wholesale Trade" });
            items.Add(new SelectListItem { Text = "Construction / Engineering", Value = "Construction / Engineering" });
            items.Add(new SelectListItem { Text = "Transportation", Value = "Transportation" });
            items.Add(new SelectListItem { Text = "Government", Value = "Government" });
            items.Add(new SelectListItem { Text = "Professional Services", Value = "Professional Services" });
            items.Add(new SelectListItem { Text = "Healthcare", Value = "Healthcare" });
            items.Add(new SelectListItem { Text = "Mining", Value = "Mining" });
            items.Add(new SelectListItem { Text = "Other", Value = "Other" });

            return items;
        }


        public static IEnumerable<SelectListItem> ExternalTrainingUsageAmountList()
        {
            IList<SelectListItem> items = new List<SelectListItem>();

            items.Add(new SelectListItem { Text = "", Value = "" });
            items.Add(new SelectListItem { Text = "More than once per year", Value = "More than once per year" });
            items.Add(new SelectListItem { Text = "About once per year", Value = "About once per year" });
            items.Add(new SelectListItem { Text = "Less than once per year", Value = "Less than once per year" });
            items.Add(new SelectListItem { Text = "Once every few years", Value = "Once every few years" });
            items.Add(new SelectListItem { Text = "Rarely/never", Value = "Rarely/never" });

            return items;
        }


        public static IEnumerable<SelectListItem> NumberOfEmployeesList()
        {
            IList<SelectListItem> items = new List<SelectListItem>();

            items.Add(new SelectListItem { Text = "", Value = "" });
            items.Add(new SelectListItem { Text = "1-5", Value = "1-5" });
            items.Add(new SelectListItem { Text = "6-10", Value = "6-10" });
            items.Add(new SelectListItem { Text = "11-50", Value = "11-50" });
            items.Add(new SelectListItem { Text = "51-100", Value = "51-100" });
            items.Add(new SelectListItem { Text = "51-100", Value = "51-100" });
            items.Add(new SelectListItem { Text = "101+", Value = "101+" });

            return items;
        }


        public static IEnumerable<SelectListItem> TopicsMostInterestList()
        {
            IList<SelectListItem> items = new List<SelectListItem>();

            items.Add(new SelectListItem { Text = "Basic Electricity", Value = "BasicElectricity" });
            items.Add(new SelectListItem { Text = "Advanced Electrical (VFDs, PLCs, etc)", Value = "AdvancedElectrical" });
            items.Add(new SelectListItem { Text = "Safety/Compliance", Value = "SafetyCompliance" });
            items.Add(new SelectListItem { Text = "Maintenance Management", Value = "Maintenanc Management" });
            items.Add(new SelectListItem { Text = "Pump Systems", Value = "PumpSystems" });
            items.Add(new SelectListItem { Text = "Steam Systems", Value = "SteamSystems" });
            items.Add(new SelectListItem { Text = "Hydraulics", Value = "Hydraulics" });
            items.Add(new SelectListItem { Text = "Other Mechanical Topics", Value = "OtherMechanicalTopics" });

            return items;
        }

    }
}
