//angular.module("umbraco").controller("Ng.DropdownController", function () {
//        alert("The controller has landed");   
//    });

angular.module("umbraco").controller("TPCTrainco.CourseDropdownController", function ($scope, courseResource, notificationsService) {

    courseResource.getAll("").then(function (response) {
        $scope.courseCategories = response.data;
    }, function (response) {
        notificationsService.error("Error", "Error loading courses");
        console.log(response.data);
    });
});