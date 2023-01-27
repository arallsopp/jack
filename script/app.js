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
        /* scope.paints is not used, but is provided as an example of an array of values. */
        $scope.paints = [
            {manufacturer: "dulux",
             coverage_per_l: 15,
             small_tin_size:1,
             big_tin_size:5
            },
            {manufacturer: "crown",
             coverage_per_l: 12,
             small_tin_size:1,
             big_tin_size:10
            }
        ]
        
        $scope.calculate = function(){
          /* update the area of the room based upon width and height. */
          $scope.room.area = $scope.room.width * $scope.room.height;
          let total_coverage_per_tin=$scope.paint.coverage * $scope.paint.tin_size;
          $scope.room.tins= total_coverage_per_tin/$scope.room.area;
        
          console.log($scope.room);
        }
    }
]);
