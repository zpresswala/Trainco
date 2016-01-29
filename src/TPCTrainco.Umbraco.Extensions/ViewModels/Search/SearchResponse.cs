using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TPCTrainco.Umbraco.Extensions.ViewModels.Search
{
    public class SearchResponse
    {
        public bool Success { get; set; }
        public string ErrorMessage { get; set; }
        public List<Seminar> Seminars { get; set; }
    }
}
