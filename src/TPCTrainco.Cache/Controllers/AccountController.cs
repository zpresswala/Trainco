using System.Web.Http;

namespace TPCTrainco.Cache.Controllers
{
    [RoutePrefix("api/cache")]
    public class CacheController : ApiController
    {
        public CacheController()
        {
        }

        // GET api/cache/
        [HttpGet]
        public string Index()
        {





            return "hi";
        }
    }
}
