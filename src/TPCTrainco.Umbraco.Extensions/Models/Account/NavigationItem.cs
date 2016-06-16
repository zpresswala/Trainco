using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TPCTrainco.Umbraco.Extensions.Models.Account
{
    public class NavigationItem
    {
        public string Name { get; set; }
        public string Url { get; set; }
        public List<NavigationItem> Children { get; set; }
    }
}
