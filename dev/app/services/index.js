import { SearchService } from './search.service';
import { CourseSearchService } from './courseSearch.service';
import { CartService } from './cart.service';
import LoadingInterceptor from './loadingInterceptor.service';
angular.module('services', [])
  .service('searchService', SearchService)
  .service('courseSearch', CourseSearchService)
  .service('loadingInterceptor', LoadingInterceptor)
  .service('cartService', CartService);
