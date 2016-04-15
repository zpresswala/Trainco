angular.module('umbraco.resources').factory('courseResource', function ($q, $http) {
    return {
        getAll: function (courseTypeAlias) {
            return $http.get("/umbraco/backoffice/TPCTrainco/CourseApi/GetCourses/?courseTypeAlias=" + courseTypeAlias);
        }
    };
});