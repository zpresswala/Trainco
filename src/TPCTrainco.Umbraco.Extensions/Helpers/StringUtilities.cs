using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TPCTrainco.Umbraco.Extensions.Helpers
{
    public class StringUtilities
    {
        public static string LineBreaksToParagraphs(string text)
        {
            if (false == string.IsNullOrWhiteSpace(text))
            {
                List<string> breakArray = text.Split(new string[] { "\r\n" }, StringSplitOptions.RemoveEmptyEntries).ToList();

                if (breakArray != null && breakArray.Count > 0)
                {
                    text = "";

                    foreach (string line in breakArray)
                    {
                        text += "<p>" + line + "</p>\n\r";
                    }
                }
            }

            return text;
        }


        public static string LineBreaksToEmailList(string text)
        {
            if (false == string.IsNullOrWhiteSpace(text))
            {
                List<string> breakArray = text.Split(new string[] { "\r\n" }, StringSplitOptions.RemoveEmptyEntries).ToList();

                if (breakArray != null && breakArray.Count > 0)
                {
                    text = "";

                    foreach (string line in breakArray)
                    {
                        text += "<li><a href=\"mailto:" + line + "\">" + line + "</a></li>\n\r";
                    }
                }
            }

            return text;
        }


        public static string StripPTags(string text)
        {
            if (false == string.IsNullOrWhiteSpace(text))
            {
                text = text.Replace("<p>", "");
                text = text.Replace("</p>", "");
            }

            return text;
        }
    }
}
