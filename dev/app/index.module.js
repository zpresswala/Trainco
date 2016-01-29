/* global malarkey:false, moment:false */

import { config } from './index.config';
import { routerConfig } from './index.route';
import { runBlock } from './index.run';
import { MainController } from './main/main.controller';
import { SeminarController } from './seminar/seminar.controller';
import { ListingController } from './listing/listing.controller';
import { SeminarDetailController } from './seminar/detail/detail';
import { services } from './services/index'; // eslint-disable-line

import { FooterDirective } from './components/footer/footer.directive';
import { MainSearchDirective } from './components/mainSearch/mainSearch.directive';
import { CartDirective } from './components/cart/cart.directive';
import { FilterTopicDirective } from './components/filterTopic/filterTopic.directive';
import { KeywordInputDirective } from './components/keywordInput/keywordInput.directive';
import { LocationInputDirective } from './components/locationInput/locationInput.directive';
angular.module('train', ['ngAnimate','ngSanitize', 'ui.router', 'ui.bootstrap', 'services', 'rzModule', 'angular.filter', 'angularSpinner'])
  .config(config)
  .config(routerConfig)
  .run(runBlock)
  .controller('MainController', MainController)
  .controller('SeminarController', SeminarController)
  .controller('SeminarDetailController', SeminarDetailController)
  .controller('ListingController', ListingController)
  .directive('tpcFooter', FooterDirective)
  .directive('mainSearch', MainSearchDirective)
  .directive('filterTopic', FilterTopicDirective)
  .directive('keywordInput', KeywordInputDirective)
  .directive('locationInput', LocationInputDirective)
  .directive('shoppingCart', CartDirective);
