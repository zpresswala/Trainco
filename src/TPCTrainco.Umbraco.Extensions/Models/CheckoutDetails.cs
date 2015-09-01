using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TPCTrainco.Umbraco.Extensions.Models
{
    public class CheckoutDetails
    {
        public List<temp_Reg> tempRegList { get; set; }
        public List<temp_Att> tempAttList { get; set; }
        public temp_Cust tempCust { get; set; }
    }
}
