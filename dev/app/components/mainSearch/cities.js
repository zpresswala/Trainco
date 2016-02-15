(function() {
  'use strict';

  angular
    .module('train')
    .service('cities', cities);

  /** @ngInject */
  function cities() {
    var data = [{
      value: 'all',
      label: 'All Locations'
    }, {
      value: 'Birmingham',
      label: 'Birmingham, AL'
    }, {
      value: 'Huntsville',
      label: 'Huntsville, AL'
    }, {
      value: 'Mobile',
      label: 'Mobile, AL'
    }, {
      value: 'Anchorage',
      label: 'Anchorage, AK'
    }, {
      value: 'Juneau',
      label: 'Juneau, AK'
    }, {
      value: 'Phoenix',
      label: 'Phoenix, AZ'
    }, {
      value: 'Burbank',
      label: 'Burbank, CA'
    }, {
      value: 'Bakersfield',
      label: 'Bakersfield, CA'
    }, {
      value: 'Fresno',
      label: 'Fresno, CA'
    }, {
      value: 'Los Angeles',
      label: 'Los Angeles, CA'
    }, {
      value: 'Modesto',
      label: 'Modesto, CA'
    }, {
      value: 'Oakland',
      label: 'Oakland, CA'
    }, {
      value: 'Ontario',
      label: 'Ontario, CA'
    }, {
      value: 'Orange County',
      label: 'Orange County, CA'
    }, {
      value: 'Palo Alto',
      label: 'Palo Alto, CA'
    }, {
      value: 'Pasadena',
      label: 'Pasadena, CA'
    }, {
      value: 'Sacramento',
      label: 'Sacramento, CA'
    }, {
      value: 'San Bernardino',
      label: 'San Bernardino, CA'
    }, {
      value: 'San Diego',
      label: 'San Diego, CA'
    }, {
      value: 'San Francisco',
      label: 'San Francisco, CA'
    }, {
      value: 'San Jose',
      label: 'San Jose, CA'
    }, {
      value: 'Santa Clara',
      label: 'Santa Clara, CA'
    }, {
      value: 'Santa Rosa',
      label: 'Santa Rosa, CA'
    }, {
      value: 'Stockton',
      label: 'Stockton, CA'
    }, {
      value: 'Torrance',
      label: 'Torrance, CA'
    }, {
      value: 'Van Nuys',
      label: 'Van Nuys, CA'
    }, {
      value: 'Visalia',
      label: 'Visalia, CA'
    }, {
      value: 'Denver',
      label: 'Denver, CO'
    }, {
      value: 'Hartford',
      label: 'Hartford, CT'
    }, {
      value: 'New Britain',
      label: 'New Britain, CT'
    }, {
      value: 'Wilmington',
      label: 'Wilmington, DE'
    }, {
      value: 'Washington',
      label: 'Washington, DC'
    }, {
      value: 'Boca Raton',
      label: 'Boca Raton, FL'
    }, {
      value: 'Bonita Springs',
      label: 'Bonita Springs, FL'
    }, {
      value: 'Ft. Lauderdale',
      label: 'Ft. Lauderdale, FL'
    }, {
      value: 'Ft. Myers',
      label: 'Ft. Myers, FL'
    }, {
      value: 'Gainesville',
      label: 'Gainesville, FL'
    }, {
      value: 'Jacksonville',
      label: 'Jacksonville, FL'
    }, {
      value: 'Miami',
      label: 'Miami, FL'
    }, {
      value: 'Orlando',
      label: 'Orlando, FL'
    }, {
      value: 'Panama City',
      label: 'Panama City, FL'
    }, {
      value: 'Tallahassee',
      label: 'Tallahassee, FL'
    }, {
      value: 'Tampa',
      label: 'Tampa, FL'
    }, {
      value: 'West Palm Beach',
      label: 'West Palm Beach, FL'
    }, {
      value: 'Albany',
      label: 'Albany, GA'
    }, {
      value: 'Atlanta',
      label: 'Atlanta, GA'
    }, {
      value: 'Augusta',
      label: 'Augusta, GA'
    }, {
      value: 'College Park',
      label: 'College Park, GA'
    }, {
      value: 'Columbus',
      label: 'Columbus, GA'
    }, {
      value: 'Marietta',
      label: 'Marietta, GA'
    }, {
      value: 'Norcross',
      label: 'Norcross, GA'
    }, {
      value: 'Honolulu',
      label: 'Honolulu, HI'
    }, {
      value: 'Boise',
      label: 'Boise, ID'
    }, {
      value: 'Bloomington',
      label: 'Bloomington, IL'
    }, {
      value: 'Chicago',
      label: 'Chicago, IL'
    }, {
      value: 'Elgin',
      label: 'Elgin, IL'
    }, {
      value: 'Elk Grove Village',
      label: 'Elk Grove Village, IL'
    }, {
      value: 'Harvey',
      label: 'Harvey, IL'
    }, {
      value: 'Joliet',
      label: 'Joliet, IL'
    }, {
      value: 'Naperville',
      label: 'Naperville, IL'
    }, {
      value: 'Oak Lawn',
      label: 'Oak Lawn, IL'
    }, {
      value: 'Peoria',
      label: 'Peoria, IL'
    }, {
      value: 'Quad Cities',
      label: 'Quad Cities, IL'
    }, {
      value: 'Rockford',
      label: 'Rockford, IL'
    }, {
      value: 'Springfield',
      label: 'Springfield, IL'
    }, {
      value: 'Evansville',
      label: 'Evansville, IN'
    }, {
      value: 'Ft. Wayne',
      label: 'Ft. Wayne, IN'
    }, {
      value: 'Indianapolis',
      label: 'Indianapolis, IN'
    }, {
      value: 'South Bend',
      label: 'South Bend, IN'
    }, {
      value: 'Cedar Rapids',
      label: 'Cedar Rapids, IA'
    }, {
      value: 'Davenport',
      label: 'Davenport, IA'
    }, {
      value: 'Des Moines',
      label: 'Des Moines, IA'
    }, {
      value: 'Wichita',
      label: 'Wichita, KS'
    }, {
      value: 'Lexington',
      label: 'Lexington, KY'
    }, {
      value: 'Louisville',
      label: 'Louisville, KY'
    }, {
      value: 'Baton Rouge',
      label: 'Baton Rouge, LA'
    }, {
      value: 'Lafayette',
      label: 'Lafayette, LA'
    }, {
      value: 'New Orleans',
      label: 'New Orleans, LA'
    }, {
      value: 'Shreveport',
      label: 'Shreveport, LA'
    }, {
      value: 'Portland',
      label: 'Portland, ME'
    }, {
      value: 'Baltimore',
      label: 'Baltimore, MD'
    }, {
      value: 'Frederick',
      label: 'Frederick, MD'
    }, {
      value: 'Foxborough',
      label: 'Foxborough, MA'
    }, {
      value: 'Peabody',
      label: 'Peabody, MA'
    }, {
      value: 'Woburn',
      label: 'Woburn, MA'
    }, {
      value: 'Worcester',
      label: 'Worcester, MA'
    }, {
      value: 'Ann Arbor',
      label: 'Ann Arbor, MI'
    }, {
      value: 'Battle Creek',
      label: 'Battle Creek, MI'
    }, {
      value: 'Detroit',
      label: 'Detroit, MI'
    }, {
      value: 'Flint',
      label: 'Flint, MI'
    }, {
      value: 'Grand Rapids',
      label: 'Grand Rapids, MI'
    }, {
      value: 'Kalamazoo',
      label: 'Kalamazoo, MI'
    }, {
      value: 'Lansing',
      label: 'Lansing, MI'
    }, {
      value: 'Romulus',
      label: 'Romulus, MI'
    }, {
      value: 'Minneapolis',
      label: 'Minneapolis, MN'
    }, {
      value: 'Jackson',
      label: 'Jackson, MS'
    }, {
      value: 'Kansas City',
      label: 'Kansas City, MO'
    }, {
      value: 'Springfield',
      label: 'Springfield, MO'
    }, {
      value: 'St. Louis',
      label: 'St. Louis, MO'
    }, {
      value: 'Helena',
      label: 'Helena, MT'
    }, {
      value: 'Omaha',
      label: 'Omaha, NE'
    }, {
      value: 'Jackson',
      label: 'Jackson, MS'
    }, {
      value: 'Kansas City',
      label: 'Kansas City, MO'
    }, {
      value: 'Springfield',
      label: 'Springfield, MO'
    }, {
      value: 'St. Louis',
      label: 'St. Louis, MO'
    }, {
      value: 'Helena',
      label: 'Helena, MT'
    }, {
      value: 'Omaha',
      label: 'Omaha, NE'
    }, {
      value: 'Las Vegas',
      label: 'Las Vegas, NV'
    }, {
      value: 'Reno',
      label: 'Reno, NV'
    }, {
      value: 'Manchester',
      label: 'Manchester, NH'
    }, {
      value: 'Atlantic City',
      label: 'Atlantic City, NJ'
    }, {
      value: 'New Brunswick',
      label: 'New Brunswick, NJ'
    }, {
      value: 'Newark',
      label: 'Newark, NJ'
    }, {
      value: 'Somerset',
      label: 'Somerset, NJ'
    }, {
      value: 'South Plainfield',
      label: 'South Plainfield, NJ'
    }, {
      value: 'Trenton',
      label: 'Trenton, NJ'
    }, {
      value: 'Albuquerque',
      label: 'Albuquerque, NM'
    }, {
      value: 'Albany',
      label: 'Albany, NY'
    }, {
      value: 'Binghamton',
      label: 'Binghamton, NY'
    }, {
      value: 'Buffalo',
      label: 'Buffalo, NY'
    }, {
      value: 'Long Island',
      label: 'Long Island, NY'
    }, {
      value: 'Poughkeepsie',
      label: 'Poughkeepsie, NY'
    }, {
      value: 'Rochester',
      label: 'Rochester, NY'
    }, {
      value: 'Schenectady',
      label: 'Schenectady, NY'
    }, {
      value: 'Syracuse',
      label: 'Syracuse, NY'
    }, {
      value: 'White Plains',
      label: 'White Plains, NY'
    }, {
      value: 'Charlotte',
      label: 'Charlotte, NC'
    }, {
      value: 'Greensboro',
      label: 'Greensboro, NC'
    }, {
      value: 'Raleigh',
      label: 'Raleigh, NC'
    }, {
      value: 'Bismarck',
      label: 'Bismarck, ND'
    }, {
      value: 'Fargo',
      label: 'Fargo, ND'
    }, {
      value: 'Akron',
      label: 'Akron, OH'
    }, {
      value: 'Cincinnati',
      label: 'Cincinnati, OH'
    }, {
      value: 'Cleveland',
      label: 'Cleveland, OH'
    }, {
      value: 'Columbus',
      label: 'Columbus, OH'
    }, {
      value: 'Dayton',
      label: 'Dayton, OH'
    }, {
      value: 'Toledo',
      label: 'Toledo, OH'
    }, {
      value: 'Oklahoma City',
      label: 'Oklahoma City, OK'
    }, {
      value: 'Tulsa',
      label: 'Tulsa, OK'
    }, {
      value: 'Corvallis',
      label: 'Corvallis, OR'
    }, {
      value: 'Eugene',
      label: 'Eugene, OR'
    }, {
      value: 'Portland',
      label: 'Portland, OR'
    }, {
      value: 'Allentown',
      label: 'Allentown, PA'
    }, {
      value: 'Erie',
      label: 'Erie, PA'
    }, {
      value: 'Harrisburg',
      label: 'Harrisburg, PA'
    }, {
      value: 'Lancaster',
      label: 'Lancaster, PA'
    }, {
      value: 'Philadelphia',
      label: 'Philadelphia, PA'
    }, {
      value: 'Pittsburgh',
      label: 'Pittsburgh, PA'
    }, {
      value: 'Scranton',
      label: 'Scranton, PA'
    }, {
      value: 'Wilkes-Barre',
      label: 'Wilkes-Barre, PA'
    }, {
      value: 'Providence',
      label: 'Providence, RI'
    }, {
      value: 'Charleston',
      label: 'Charleston, SC'
    }, {
      value: 'Columbia',
      label: 'Columbia, SC'
    }, {
      value: 'Greenville',
      label: 'Greenville, SC'
    }, {
      value: 'Sioux Falls',
      label: 'Sioux Falls, SD'
    }, {
      value: 'Chattanooga',
      label: 'Chattanooga, TN'
    }, {
      value: 'Knoxville',
      label: 'Knoxville, TN'
    }, {
      value: 'Memphis',
      label: 'Memphis, TN'
    }, {
      value: 'Nashville',
      label: 'Nashville, TN'
    }, {
      value: 'Arlington',
      label: 'Arlington, TX'
    }, {
      value: 'Austin',
      label: 'Austin, TX'
    }, {
      value: 'Corpus Christi',
      label: 'Corpus Christi, TX'
    }, {
      value: 'Dallas',
      label: 'Dallas, TX'
    }, {
      value: 'El Paso',
      label: 'El Paso, TX'
    }, {
      value: 'Ft. Worth',
      label: 'Ft. Worth, TX'
    }, {
      value: 'Houston',
      label: 'Houston, TX'
    }, {
      value: 'Irving',
      label: 'Irving, TX'
    }, {
      value: 'Lubbock',
      label: 'Lubbock, TX'
    }, {
      value: 'San Antonio',
      label: 'San Antonio, TX'
    }, {
      value: 'Temple',
      label: 'Temple, TX'
    }, {
      value: 'Salt Lake City',
      label: 'Salt Lake City, UT'
    }, {
      value: 'Arlington',
      label: 'Arlington, VA'
    }, {
      value: 'Lynchburg',
      label: 'Lynchburg, VA'
    }, {
      value: 'Norfolk',
      label: 'Norfolk, VA'
    }, {
      value: 'Richmond',
      label: 'Richmond, VA'
    }, {
      value: 'Williamsburg',
      label: 'Williamsburg, VA'
    }, {
      value: 'Bellevue',
      label: 'Bellevue, WA'
    }, {
      value: 'Everett',
      label: 'Everett, WA'
    }, {
      value: 'Lynnwood',
      label: 'Lynnwood, WA'
    }, {
      value: 'Richland',
      label: 'Richland, WA'
    }, {
      value: 'Seattle',
      label: 'Seattle, WA'
    }, {
      value: 'Spokane',
      label: 'Spokane, WA'
    }, {
      value: 'Tacoma',
      label: 'Tacoma, WA'
    }, {
      value: 'Charleston',
      label: 'Charleston, WV'
    }, {
      value: 'Green Bay',
      label: 'Green Bay, WI'
    }, {
      value: 'Madison',
      label: 'Madison, WI'
    }, {
      value: 'Milwaukee',
      label: 'Milwaukee, WI'
    }, {
      value: 'Calgary',
      label: 'Calgary, AB'
    }, {
      value: 'Edmonton',
      label: 'Edmonton, AB'
    }, {
      value: 'Vancouver',
      label: 'Vancouver, BC'
    }, {
      value: 'Winnipeg',
      label: 'Winnipeg, MB'
    }, {
      value: 'Halifax',
      label: 'Halifax, NS'
    }, {
      value: 'Hamilton',
      label: 'Hamilton, ON'
    }, {
      value: 'London',
      label: 'London, ON'
    }, {
      value: 'Ottawa',
      label: 'Ottawa, ON'
    }, {
      value: 'Toronto',
      label: 'Toronto, ON'
    }, {
      value: 'Windsor',
      label: 'Windsor, ON'
    }, {
      value: 'Regina',
      label: 'Regina, SK'
    }]



    this.getCities = getCities;

    function getCities() {
      return data;
    }
  }

})();
