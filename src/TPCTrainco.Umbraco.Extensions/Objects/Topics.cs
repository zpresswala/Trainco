using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TPCTrainco.Umbraco.Extensions.Objects
{
    public class Topics
    {
        public static int TopicIdByShortName(string shortName)
        {
            int topicId = int.MinValue;

            if (true == string.IsNullOrWhiteSpace(shortName) || shortName == "all")
            {
                topicId = 0;
            }
            else if (shortName == "electrical")
            {
                topicId = 6;
            }
            else if (shortName == "management")
            {
                topicId = 15;
            }
            else if (shortName == "hvac")
            {
                topicId = 3;
            }
            else if (shortName == "mechanical")
            {
                topicId = 7;
            }
            else if (shortName == "hydraulics")
            {
                topicId = 9;
            }


            return topicId;
        }
    }
}
