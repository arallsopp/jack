var app = angular.module('myApp', ['ngSanitize', 'ngRoute', 'ngMaterial']);

app.controller('myCtl', ['$scope', '$http', '$mdToast', '$mdDialog', '$sce', '$location',
    function ($scope, $http, $mdToast, $mdDialog, $sce, $location,) {
        $scope.user = {
            name:''// this gets bound to the text box.
        };
        $scope.ux = {
            doors:[0,1,2,3,4,5] /* this is used for the ng-repeat drop down */
        }
        $scope.room = {
            width:null,
            height:null,
            area:null,
            tins:null,
            doors:null
        };
        $scope.paint = {
          coverage:15,
          tin_size:2,
          number_of_coats:null
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
          let area_of_doors=$scope.room.doors*1.981*0.762;
          $scope.room.area=$scope.room.width*$scope.room.height-area_of_doors;
          let total_coverage_per_tin=$scope.paint.coverage * $scope.paint.tin_size;
          $scope.room.tins=($scope.room.area/total_coverage_per_tin)*$scope.paint.number_of_coats;
        
          console.log($scope.room);
        }
    }
]);
