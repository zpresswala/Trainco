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

            items.Add(new SelectListItem { Text = "How did you hear about us?", Value = "" });
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

    }
}
