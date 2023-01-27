var app = angular.module('myApp', ['ngSanitize', 'ngRoute', 'ngMaterial']);

app.controller('myCtl', ['$scope', '$http', '$mdToast', '$mdDialog', '$sce', '$location',
    function ($scope, $http, $mdToast, $mdDialog, $sce, $location,) {
        $scope.user = {
            name:''// this gets bound to the text box.
        };
        $scope.room = {
            width:null,
            height:null,
            area:null
        };
        
        $scope.calculate = function(){
          /* update the area of the room based upon width and height. */
          $scope.room.area = $scope.room.width * $scope.room.height;
          console.log($scope.room);
        }
    }
]);
