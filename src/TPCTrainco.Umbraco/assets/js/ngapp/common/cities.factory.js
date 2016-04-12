/**
 * @ngdoc service
 * @name train.common.Cities
 * @description Contains a list of all the cities where TrainCO has seminars.
 */

(function(){

  'use strict';

	angular
		.module('train.common')
		.factory('Cities', Cities);

  /* @ngInject */
  function Cities() {
		return {
			getCities: getCities
		};

		////////////////////

    /**
     * @ngdoc
     * @name train.common.cities#getCities
     * @methodOf train.common.cities
     *
     * @description a list of all the cities where there might be seminars
     */

		function getCities() {
      var curVal = window.currentCityValue;
      var manualObject = {
        value: curVal.slice(0, curVal.indexOf(',')),
        label: curVal
      };
      var data = [manualObject, {
        value: ' ',
        label: 'All Locations'
      }, {
        value: 'Birmingham',
        label: 'Birmingham, AL',
        group: 'Alabama'
      }, {
        value: 'Huntsville',
        label: 'Huntsville, AL',
        group: 'Alabama'
      }, {
        value: 'Mobile',
        label: 'Mobile, AL',
        group: 'Alabama'
      }, {
        value: 'Anchorage',
        label: 'Anchorage, AK',
        group: 'Alaska'
      }, {
        value: 'Juneau',
        label: 'Juneau, AK',
        group: 'Alaska'
      }, {
        value: 'Phoenix',
        label: 'Phoenix, AZ',
        group: 'Arizona'
      }, {
        value: 'Burbank',
        label: 'Burbank, CA',
        group: 'California'
      }, {
        value: 'Bakersfield',
        label: 'Bakersfield, CA',
        group: 'California'
      }, {
        value: 'Fresno',
        label: 'Fresno, CA',
        group: 'California'
      }, {
        value: 'Los Angeles',
        label: 'Los Angeles, CA',
        group: 'California'
      }, {
        value: 'Modesto',
        label: 'Modesto, CA',
        group: 'California'
      }, {
        value: 'Oakland',
        label: 'Oakland, CA',
        group: 'California'
      }, {
        value: 'Ontario',
        label: 'Ontario, CA',
        group: 'California'
      }, {
        value: 'Orange County',
        label: 'Orange County, CA',
        group: 'California'
      }, {
        value: 'Palo Alto',
        label: 'Palo Alto, CA',
        group: 'California'
      }, {
        value: 'Pasadena',
        label: 'Pasadena, CA',
        group: 'California'
      }, {
        value: 'Sacramento',
        label: 'Sacramento, CA',
        group: 'California'
      }, {
        value: 'San Bernardino',
        label: 'San Bernardino, CA',
        group: 'California'
      }, {
        value: 'San Diego',
        label: 'San Diego, CA',
        group: 'California'
      }, {
        value: 'San Francisco',
        label: 'San Francisco, CA',
        group: 'California'
      }, {
        value: 'San Jose',
        label: 'San Jose, CA',
        group: 'California'
      }, {
        value: 'Santa Clara',
        label: 'Santa Clara, CA',
        group: 'California'
      }, {
        value: 'Santa Rosa',
        label: 'Santa Rosa, CA',
        group: 'California'
      }, {
        value: 'Stockton',
        label: 'Stockton, CA',
        group: 'California'
      }, {
        value: 'Torrance',
        label: 'Torrance, CA',
        group: 'California'
      }, {
        value: 'Van Nuys',
        label: 'Van Nuys, CA',
        group: 'California'
      }, {
        value: 'Visalia',
        label: 'Visalia, CA',
        group: 'California'
      }, {
        value: 'Denver',
        label: 'Denver, CO',
        group: 'Colorado'
      }, {
        value: 'Hartford',
        label: 'Hartford, CT',
        group: 'Connecticut'
      }, {
        value: 'New Britain',
        label: 'New Britain, CT',
        group: 'Connecticut'
      }, {
        value: 'Wilmington',
        label: 'Wilmington, DE',
        group: 'Delaware'
      }, {
        value: 'Washington',
        label: 'Washington, DC',
        group: 'Washington D.C.'
      }, {
        value: 'Boca Raton',
        label: 'Boca Raton, FL',
        group: 'Florida'
      }, {
        value: 'Bonita Springs',
        label: 'Bonita Springs, FL',
        group: 'Florida'
      }, {
        value: 'Ft. Lauderdale',
        label: 'Ft. Lauderdale, FL',
        group: 'Florida'
      }, {
        value: 'Ft. Myers',
        label: 'Ft. Myers, FL',
        group: 'Florida'
      }, {
        value: 'Gainesville',
        label: 'Gainesville, FL',
        group: 'Florida'
      }, {
        value: 'Jacksonville',
        label: 'Jacksonville, FL',
        group: 'Florida'
      }, {
        value: 'Miami',
        label: 'Miami, FL',
        group: 'Florida'
      }, {
        value: 'Orlando',
        label: 'Orlando, FL',
        group: 'Florida'
      }, {
        value: 'Panama City',
        label: 'Panama City, FL',
        group: 'Florida'
      }, {
        value: 'Tallahassee',
        label: 'Tallahassee, FL',
        group: 'Florida'
      }, {
        value: 'Tampa',
        label: 'Tampa, FL',
        group: 'Florida'
      }, {
        value: 'West Palm Beach',
        label: 'West Palm Beach, FL',
        group: 'Florida'
      }, {
        value: 'Albany',
        label: 'Albany, GA',
        group: 'Georgia'
      }, {
        value: 'Atlanta',
        label: 'Atlanta, GA',
        group: 'Georgia'
      }, {
        value: 'Augusta',
        label: 'Augusta, GA',
        group: 'Georgia'
      }, {
        value: 'College Park',
        label: 'College Park, GA',
        group: 'Georgia'
      }, {
        value: 'Columbus',
        label: 'Columbus, GA',
        group: 'Georgia'
      }, {
        value: 'Marietta',
        label: 'Marietta, GA',
        group: 'Georgia'
      }, {
        value: 'Norcross',
        label: 'Norcross, GA',
        group: 'Georgia'
      }, {
        value: 'Honolulu',
        label: 'Honolulu, HI',
        group: 'Hawaii'
      }, {
        value: 'Boise',
        label: 'Boise, ID',
        group: 'Idaho'
      }, {
        value: 'Bloomington',
        label: 'Bloomington, IL',
        group: 'Illinois'
      }, {
        value: 'Chicago',
        label: 'Chicago, IL',
        group: 'Illinois'
      }, {
        value: 'Elgin',
        label: 'Elgin, IL',
        group: 'Illinois'
      }, {
        value: 'Elk Grove Village',
        label: 'Elk Grove Village, IL',
        group: 'Illinois'
      }, {
        value: 'Harvey',
        label: 'Harvey, IL',
        group: 'Illinois'
      }, {
        value: 'Joliet',
        label: 'Joliet, IL',
        group: 'Illinois'
      }, {
        value: 'Naperville',
        label: 'Naperville, IL',
        group: 'Illinois'
      }, {
        value: 'Oak Lawn',
        label: 'Oak Lawn, IL',
        group: 'Illinois'
      }, {
        value: 'Peoria',
        label: 'Peoria, IL',
        group: 'Illinois'
      }, {
        value: 'Quad Cities',
        label: 'Quad Cities, IL',
        group: 'Illinois'
      }, {
        value: 'Rockford',
        label: 'Rockford, IL',
        group: 'Illinois'
      }, {
        value: 'Springfield',
        label: 'Springfield, IL',
        group: 'Illinois'
      }, {
        value: 'Evansville',
        label: 'Evansville, IN',
        group: 'Indiana'
      }, {
        value: 'Ft. Wayne',
        label: 'Ft. Wayne, IN',
        group: 'Indiana'
      }, {
        value: 'Indianapolis',
        label: 'Indianapolis, IN',
        group: 'Indiana'
      }, {
        value: 'South Bend',
        label: 'South Bend, IN',
        group: 'Indiana'
      }, {
        value: 'Cedar Rapids',
        label: 'Cedar Rapids, IA',
        group: 'Iowa'
      }, {
        value: 'Davenport',
        label: 'Davenport, IA',
        group: 'Iowa'
      }, {
        value: 'Des Moines',
        label: 'Des Moines, IA',
        group: 'Iowa'
      }, {
        value: 'Wichita',
        label: 'Wichita, KS',
        group: 'Kansas'
      }, {
        value: 'Lexington',
        label: 'Lexington, KY',
        group: 'Kentucky'
      }, {
        value: 'Louisville',
        label: 'Louisville, KY',
        group: 'Kentucky'
      }, {
        value: 'Baton Rouge',
        label: 'Baton Rouge, LA',
        group: 'Louisiana'
      }, {
        value: 'Lafayette',
        label: 'Lafayette, LA',
        group: 'Louisiana'
      }, {
        value: 'New Orleans',
        label: 'New Orleans, LA',
        group: 'Louisiana'
      }, {
        value: 'Shreveport',
        label: 'Shreveport, LA',
        group: 'Louisiana'
      }, {
        value: 'Portland',
        label: 'Portland, ME',
        group: 'Maine'
      }, {
        value: 'Baltimore',
        label: 'Baltimore, MD',
        group: 'Maryland'
      }, {
        value: 'Frederick',
        label: 'Frederick, MD',
        group: 'Maryland'
      }, {
        value: 'Foxborough',
        label: 'Foxborough, MA',
        group: 'Massachusetts'
      }, {
        value: 'Peabody',
        label: 'Peabody, MA',
        group: 'Massachusetts'
      }, {
        value: 'Woburn',
        label: 'Woburn, MA',
        group: 'Massachusetts'
      }, {
        value: 'Worcester',
        label: 'Worcester, MA',
        group: 'Massachusetts'
      }, {
        value: 'Ann Arbor',
        label: 'Ann Arbor, MI',
        group: 'Michigan'
      }, {
        value: 'Battle Creek',
        label: 'Battle Creek, MI',
        group: 'Michigan'
      }, {
        value: 'Detroit',
        label: 'Detroit, MI',
        group: 'Michigan'
      }, {
        value: 'Flint',
        label: 'Flint, MI',
        group: 'Michigan'
      }, {
        value: 'Grand Rapids',
        label: 'Grand Rapids, MI',
        group: 'Michigan'
      }, {
        value: 'Kalamazoo',
        label: 'Kalamazoo, MI',
        group: 'Michigan'
      }, {
        value: 'Lansing',
        label: 'Lansing, MI',
        group: 'Michigan'
      }, {
        value: 'Romulus',
        label: 'Romulus, MI',
        group: 'Michigan'
      }, {
        value: 'Minneapolis',
        label: 'Minneapolis, MN',
        group: 'Minnesota'
      }, {
        value: 'Jackson',
        label: 'Jackson, MS',
        group: 'Mississippi'
      }, {
        value: 'Kansas City',
        label: 'Kansas City, MO',
        group: 'Missouri'
      }, {
        value: 'Springfield',
        label: 'Springfield, MO',
        group: 'Missouri'
      }, {
        value: 'St. Louis',
        label: 'St. Louis, MO',
        group: 'Missouri'
      }, {
        value: 'Helena',
        label: 'Helena, MT',
        group: 'Montana'
      }, {
        value: 'Omaha',
        label: 'Omaha, NE',
        group: 'Nebraska'
      }, {
        value: 'Las Vegas',
        label: 'Las Vegas, NV',
        group: 'Nevada'
      }, {
        value: 'Reno',
        label: 'Reno, NV',
        group: 'Nevada'
      }, {
        value: 'Manchester',
        label: 'Manchester, NH',
        group: 'New Hampshire'
      }, {
        value: 'Atlantic City',
        label: 'Atlantic City, NJ',
        group: 'New Jersey'
      }, {
        value: 'New Brunswick',
        label: 'New Brunswick, NJ',
        group: 'New Jersey'
      }, {
        value: 'Newark',
        label: 'Newark, NJ',
        group: 'New Jersey'
      }, {
        value: 'Somerset',
        label: 'Somerset, NJ',
        group: 'New Jersey'
      }, {
        value: 'South Plainfield',
        label: 'South Plainfield, NJ',
        group: 'New Jersey'
      }, {
        value: 'Trenton',
        label: 'Trenton, NJ',
        group: 'New Jersey'
      }, {
        value: 'Albuquerque',
        label: 'Albuquerque, NM',
        group: 'New Mexico'
      }, {
        value: 'Albany',
        label: 'Albany, NY',
        group: 'New York'
      }, {
        value: 'Binghamton',
        label: 'Binghamton, NY',
        group: 'New York'
      }, {
        value: 'Buffalo',
        label: 'Buffalo, NY',
        group: 'New York'
      }, {
        value: 'Long Island',
        label: 'Long Island, NY',
        group: 'New York'
      }, {
        value: 'Poughkeepsie',
        label: 'Poughkeepsie, NY',
        group: 'New York'
      }, {
        value: 'Rochester',
        label: 'Rochester, NY',
        group: 'New York'
      }, {
        value: 'Schenectady',
        label: 'Schenectady, NY',
        group: 'New York'
      }, {
        value: 'Syracuse',
        label: 'Syracuse, NY',
        group: 'New York'
      }, {
        value: 'White Plains',
        label: 'White Plains, NY',
        group: 'New York'
      }, {
        value: 'Charlotte',
        label: 'Charlotte, NC',
        group: 'North Carolina'
      }, {
        value: 'Greensboro',
        label: 'Greensboro, NC',
        group: 'North Carolina'
      }, {
        value: 'Raleigh',
        label: 'Raleigh, NC',
        group: 'North Carolina'
      }, {
        value: 'Bismarck',
        label: 'Bismarck, ND',
        group: 'North Dakota'
      }, {
        value: 'Fargo',
        label: 'Fargo, ND',
        group: 'North Dakota'
      }, {
        value: 'Akron',
        label: 'Akron, OH',
        group: 'Ohio'
      }, {
        value: 'Cincinnati',
        label: 'Cincinnati, OH',
        group: 'Ohio'
      }, {
        value: 'Cleveland',
        label: 'Cleveland, OH',
        group: 'Ohio'
      }, {
        value: 'Columbus',
        label: 'Columbus, OH',
        group: 'Ohio'
      }, {
        value: 'Dayton',
        label: 'Dayton, OH',
        group: 'Ohio'
      }, {
        value: 'Toledo',
        label: 'Toledo, OH',
        group: 'Ohio'
      }, {
        value: 'Oklahoma City',
        label: 'Oklahoma City, OK',
        group: 'Oklahoma'
      }, {
        value: 'Tulsa',
        label: 'Tulsa, OK',
        group: 'Oklahoma'
      }, {
        value: 'Corvallis',
        label: 'Corvallis, OR',
        group: 'Oregon'
      }, {
        value: 'Eugene',
        label: 'Eugene, OR',
        group: 'Oregon'
      }, {
        value: 'Portland',
        label: 'Portland, OR',
        group: 'Oregon'
      }, {
        value: 'Allentown',
        label: 'Allentown, PA',
        group: 'Pennsylvania'
      }, {
        value: 'Erie',
        label: 'Erie, PA',
        group: 'Pennsylvania'
      }, {
        value: 'Harrisburg',
        label: 'Harrisburg, PA',
        group: 'Pennsylvania'
      }, {
        value: 'Lancaster',
        label: 'Lancaster, PA',
        group: 'Pennsylvania'
      }, {
        value: 'Philadelphia',
        label: 'Philadelphia, PA',
        group: 'Pennsylvania'
      }, {
        value: 'Pittsburgh',
        label: 'Pittsburgh, PA',
        group: 'Pennsylvania'
      }, {
        value: 'Scranton',
        label: 'Scranton, PA',
        group: 'Pennsylvania'
      }, {
        value: 'Wilkes-Barre',
        label: 'Wilkes-Barre, PA',
        group: 'Pennsylvania'
      }, {
        value: 'Providence',
        label: 'Providence, RI',
        group: 'Rhode Island'
      }, {
        value: 'Charleston',
        label: 'Charleston, SC',
        group: 'South Carolina'
      }, {
        value: 'Columbia',
        label: 'Columbia, SC',
        group: 'South Carolina'
      }, {
        value: 'Greenville',
        label: 'Greenville, SC',
        group: 'South Carolina'
      }, {
        value: 'Sioux Falls',
        label: 'Sioux Falls, SD',
        group: 'South Dakota'
      }, {
        value: 'Chattanooga',
        label: 'Chattanooga, TN',
        group: 'Tennessee'
      }, {
        value: 'Knoxville',
        label: 'Knoxville, TN',
        group: 'Tennessee'
      }, {
        value: 'Memphis',
        label: 'Memphis, TN',
        group: 'Tennessee'
      }, {
        value: 'Nashville',
        label: 'Nashville, TN',
        group: 'Tennessee'
      }, {
        value: 'Arlington',
        label: 'Arlington, TX',
        group: 'Texas'
      }, {
        value: 'Austin',
        label: 'Austin, TX',
        group: 'Texas'
      }, {
        value: 'Corpus Christi',
        label: 'Corpus Christi, TX',
        group: 'Texas'
      }, {
        value: 'Dallas',
        label: 'Dallas, TX',
        group: 'Texas'
      }, {
        value: 'El Paso',
        label: 'El Paso, TX',
        group: 'Texas'
      }, {
        value: 'Ft. Worth',
        label: 'Ft. Worth, TX',
        group: 'Texas'
      }, {
        value: 'Houston',
        label: 'Houston, TX',
        group: 'Texas'
      }, {
        value: 'Irving',
        label: 'Irving, TX',
        group: 'Texas'
      }, {
        value: 'Lubbock',
        label: 'Lubbock, TX',
        group: 'Texas'
      }, {
        value: 'San Antonio',
        label: 'San Antonio, TX',
        group: 'Texas'
      }, {
        value: 'Temple',
        label: 'Temple, TX',
        group: 'Texas'
      }, {
        value: 'Salt Lake City',
        label: 'Salt Lake City, UT',
        group: 'Utah'
      }, {
        value: 'Arlington',
        label: 'Arlington, VA',
        group: 'Virginia'
      }, {
        value: 'Lynchburg',
        label: 'Lynchburg, VA',
        group: 'Virginia'
      }, {
        value: 'Norfolk',
        label: 'Norfolk, VA',
        group: 'Virginia'
      }, {
        value: 'Richmond',
        label: 'Richmond, VA',
        group: 'Virginia'
      }, {
        value: 'Williamsburg',
        label: 'Williamsburg, VA',
        group: 'Virginia'
      }, {
        value: 'Bellevue',
        label: 'Bellevue, WA',
        group: 'Washington'
      }, {
        value: 'Everett',
        label: 'Everett, WA',
        group: 'Washington'
      }, {
        value: 'Lynnwood',
        label: 'Lynnwood, WA',
        group: 'Washington'
      }, {
        value: 'Richland',
        label: 'Richland, WA',
        group: 'Washington'
      }, {
        value: 'Seattle',
        label: 'Seattle, WA',
        group: 'Washington'
      }, {
        value: 'Spokane',
        label: 'Spokane, WA',
        group: 'Washington'
      }, {
        value: 'Tacoma',
        label: 'Tacoma, WA',
        group: 'Washington'
      }, {
        value: 'Charleston',
        label: 'Charleston, WV',
        group: 'West Virginia'
      }, {
        value: 'Green Bay',
        label: 'Green Bay, WI',
        group: 'Wisconsin'
      }, {
        value: 'Madison',
        label: 'Madison, WI',
        group: 'Wisconsin'
      }, {
        value: 'Milwaukee',
        label: 'Milwaukee, WI',
        group: 'Wisconsin'
      }, {
        value: 'Calgary',
        label: 'Calgary, AB',
        group: 'Alberta, Canada'
      }, {
        value: 'Edmonton',
        label: 'Edmonton, AB',
        group: 'Alberta, Canada'
      }, {
        value: 'Vancouver',
        label: 'Vancouver, BC',
        group: 'British Columbia, Canada'
      }, {
        value: 'Winnipeg',
        label: 'Winnipeg, MB',
        group: 'Manitoba, Canada'
      }, {
        value: 'Halifax',
        label: 'Halifax, NS',
        group: 'Nova Scotia, Canada'
      }, {
        value: 'Hamilton',
        label: 'Hamilton, ON',
        group: 'Ontario, Canada'
      }, {
        value: 'London',
        label: 'London, ON',
        group: 'Ontario, Canada'
      }, {
        value: 'Ottawa',
        label: 'Ottawa, ON',
        group: 'Ontario, Canada'
      }, {
        value: 'Toronto',
        label: 'Toronto, ON',
        group: 'Ontario, Canada'
      }, {
        value: 'Windsor',
        label: 'Windsor, ON',
        group: 'Ontario, Canada'
      }, {
        value: 'Regina',
        label: 'Regina, SK',
        group: 'Saskatchewan, Canada'
      }];

      return data;
    }

	}

}());
