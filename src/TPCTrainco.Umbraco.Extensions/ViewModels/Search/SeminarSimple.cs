using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TPCTrainco.Umbraco.Extensions.ViewModels.Search
{
    public class SeminarSimple
    {
        public int Id { get; set; }
        public string Title { get; set; }

        public SeminarSimple(int id, string title)
        {
            Id = id;
            Title = title;
        }
    }
}
