//angular.module("umbraco").controller("Ng.DropdownController", function () {
//        alert("The controller has landed");   
//    });

angular.module("umbraco").controller("TPCTrainco.CourseDropdownController", function ($scope, courseResource, notificationsService) {

    courseResource.getAll("").then(function (response) {
        $scope.courses = response.data;
        if ($scope.courses) {
            for (var i = 0; i < $scope.courses.length; i++) {
                $scope.courses[i].Id = $scope.courses[i].Id.toString();
            }
        }
    }, function (response) {
        notificationsService.error("Error", "Error loading courses");
        console.log(response.data);
    });
});