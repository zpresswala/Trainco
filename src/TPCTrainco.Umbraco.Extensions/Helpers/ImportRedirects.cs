using Excel;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Umbraco.Core.Models;
using Umbraco.Core.Services;

namespace TPCTrainco.Umbraco.Extensions.Helpers
{
    public class ImportRedirects
    {
        public static void Import(string filePath)
        {
            FileStream stream = System.IO.File.Open(filePath, FileMode.Open, FileAccess.Read);
            ContentService contentSerivce = new ContentService();
            StringBuilder sb = new StringBuilder();
            IExcelDataReader excelReader = ExcelReaderFactory.CreateOpenXmlReader(stream);

            excelReader.IsFirstRowAsColumnNames = true;

            DataSet result = excelReader.AsDataSet();

            if (result.Tables[0].Rows.Count > 0)
            {
                foreach (DataRow row in result.Tables[0].Rows)
                {
                    string oldUrl = row[0].ToString();
                    string newUrl = row[2].ToString();

                    //IContent node = contentSerivce.CreateContent(postTitle, 1215, "BlogItem", 5);

                    //node.SetValue("title", postTitle);
                    //node.SetValue("metaDescription", postTitle);
                    //node.SetValue("metaKeywords", postTags);
                    //node.SetValue("umbracoNaviHide", true);
                    //node.SetValue("blogTags", postTags);

                    if (false == string.IsNullOrWhiteSpace(oldUrl) && false == string.IsNullOrWhiteSpace(newUrl))
                    {
                        sb.AppendLine("Old: " + oldUrl);
                        sb.AppendLine("New: " + newUrl);
                        sb.AppendLine();
                    }
                }
            }

            string output = sb.ToString();

            excelReader.Close();
        }
    }
}
