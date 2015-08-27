using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Umbraco.Core.Models;
using Umbraco.Web;

namespace TPCTrainco.Umbraco.Extensions.Helpers
{
    public sealed class Nodes
    {
        private static volatile Nodes instance;
        private static object _padLock = new Object();

        private Nodes() { }

        public IPublishedContent Home;
        public IPublishedContent SiteSettings;
        public IPublishedContent News;
        public IPublishedContent RedirectFolder;
        public IPublishedContent CourseCatalog;
        public IEnumerable<IPublishedContent> Redirects;
        public IPublishedContent SocialLinkFolder;
        public IEnumerable<IPublishedContent> SocialLinks;
        public IEnumerable<IPublishedContent> SeminarItems;

        public UmbracoHelper UmbracoHelper;

        public static Nodes Instance
        {
            get
            {
                if (instance == null)
                {
                    lock (_padLock)
                    {
                        if (instance == null)
                        {
                            var umbHelper = new UmbracoHelper(UmbracoContext.Current);

                            instance = new Nodes();
                            instance.UmbracoHelper = umbHelper;

                            instance.Home = umbHelper.TypedContentAtRoot().FirstOrDefault(n => n.IsDocumentType("HomePage"));
                            instance.SiteSettings = umbHelper.TypedContentAtRoot().FirstOrDefault(n => n.IsDocumentType("SiteSettings"));
                            instance.RedirectFolder = instance.SiteSettings.Children.FirstOrDefault(n => n.IsDocumentType("RedirectsFolder"));
                            instance.Redirects = instance.RedirectFolder.Children;

                            instance.SocialLinkFolder = instance.SiteSettings.Children.FirstOrDefault(n => n.IsDocumentType("SocialLinks"));
                            instance.SocialLinks = instance.SocialLinkFolder.Children;

                            instance.SeminarItems = instance.Home.Descendants("SeminarItem");
                            instance.CourseCatalog = instance.Home.Descendants("SeminarCatalog").FirstOrDefault();
                        }
                    }
                }
                return instance;
            }
            set
            {
                instance = value;
            }
        }
    }
}
