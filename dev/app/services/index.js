import { SearchService } from './search.service';
import { CourseSearchService } from './courseSearch.service';
import { CartService } from './cart.service';

angular.module('services', []).service('searchService', SearchService)
  .service('courseSearch', CourseSearchService).service('cartService', CartService);
