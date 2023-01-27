var app = angular.module('myApp', ['ngSanitize', 'ngRoute', 'ngMaterial']);

app.controller('myCtl', ['$scope', '$http', '$mdToast', '$mdDialog', '$sce', '$location',
    function ($scope, $http, $mdToast, $mdDialog, $sce, $location,) {
        $scope.user = {
            name:''// this gets bound to the text box.
        };
        $scope.room = {
            width:null,
            height:null,
            area:null,
            tins:null
        };
        $scope.paint = {
          coverage:15,
          tin_size:2
        };
        
        $scope.calculate = function(){
          /* update the area of the room based upon width and height. */
          $scope.room.area = $scope.room.width * $scope.room.height;
          let total_coverage_per_tin=$scope.paint.coverage*$scope.paint.tin_size;
          $scope.room.tins= total_coverage_per_tin/$scope.room.area;
        
          console.log($scope.room);
        }
    }
]);
