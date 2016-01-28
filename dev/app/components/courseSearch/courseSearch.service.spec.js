describe('service courseSearch', () => {
  beforeEach(angular.mock.module('train'));

  it('should be registered', inject(courseSearch => {
    expect(courseSearch).not.toEqual(null);
  }));

  describe('apiHost variable', () => {
    it('should exist', inject(courseSearch => {
      expect(courseSearch.apiHost).not.toEqual(null);
    }));
  });

  describe('getResults function', () => {
    it('should exist', inject(courseSearch => {
      expect(courseSearch.getResults).not.toEqual(null);
    }));

    it('should return data', inject((courseSearch, $httpBackend) => {
      $httpBackend.when('GET',  courseSearch.apiHost).respond(200, [{pprt: 'value'}]);
      var data;
      courseSearch.getResults(1).then(function(fetchedData) {
        data = fetchedData;
      });
      $httpBackend.flush();
      expect(data).toEqual(jasmine.any(Array));
      expect(data.length === 1).toBeTruthy();
      expect(data[0]).toEqual(jasmine.any(Object));
    }));

    it('should log a error', inject((courseSearch, $httpBackend, $log) => {
      $httpBackend.when('GET',  courseSearch.apiHost).respond(500);
      courseSearch.getResults(1);
      $httpBackend.flush();
      expect($log.error.logs).toEqual(jasmine.stringMatching('XHR Failed for'));
    }));
  });
});
