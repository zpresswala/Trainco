using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TPCTrainco.Umbraco.Extensions;

namespace TPCTrainco.TaskLocalCopyDb
{
    class Program
    {
        static void Main(string[] args)
        {
            Umbraco.Extensions.Objects.CacheObjects.GenerateLocalCourseDetailList();

            Console.ReadKey();
        }
    }
}
