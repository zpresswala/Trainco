using TPCTrainco.Umbraco.Extensions.Pipeline;
using System.Web.Routing;
using Umbraco.Core;
using Umbraco.Core.Events;
using Umbraco.Core.Models;
using Umbraco.Core.Services;
using Umbraco.Web;
using Umbraco.Web.Routing;

namespace TPCTrainco.Umbraco.Extensions.Events
{
    public class UmbracoApplicationStartUp : ApplicationEventHandler
    {
        protected override void ApplicationStarting(UmbracoApplicationBase umbracoApplication, ApplicationContext applicationContext)
        {
            // Implemeting a Dashboard finder.
            ContentFinderResolver.Current.InsertTypeBefore<ContentFinderByNiceUrl, DashbaordContentFinder>();

            base.ApplicationStarting(umbracoApplication, applicationContext);
        }

        protected override void ApplicationStarted(UmbracoApplicationBase umbracoApplication, ApplicationContext applicationContext)
        {
            ContentService.Created += ContentCreated;

            RegisterRoutes(RouteTable.Routes);

            base.ApplicationStarted(umbracoApplication, applicationContext);
        }

        #region Event Handler Methods

        /// <summary>
        /// This is an event handler for inserting defualt values into new nodes.
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void ContentCreated(IContentService sender, NewEventArgs<IContent> e)
        {
            //if (e.Entity.ContentType.Alias == "MyDocumentType")
            //{
            //	e.Entity.SetValue("pageTitle", "Untitled");
            //	sender.Save(e.Entity);
            //}
        }


        /// <summary>
        /// Custom MVC Routes
        /// </summary>
        /// <param name="routes"></param>
        private void RegisterRoutes(RouteCollection routes)
        {
            //routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            //routes.MapRoute(
            //	name: "Default",
            //	url: "{controller}/{action}/{id}",
            //	defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional }
            //);
        }

        #endregion
    }
}
