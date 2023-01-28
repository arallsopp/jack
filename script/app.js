var app = angular.module('myApp', ['ngSanitize', 'ngRoute', 'ngMaterial']);

app.controller('myCtl', ['$scope', '$http', '$mdToast', '$mdDialog', '$sce', '$location',
    function ($scope, $http, $mdToast, $mdDialog, $sce, $location,) {
        $scope.user = {
            name: '', // this gets bound to the text box.
            selected_paint:null /* I'll use this to hold the properties of the selected paint */
        };
        $scope.ux = {
            doors: [
                {value: 0, label: 'none'},
                {value: 1, label: 'one'},
                {value: 2, label: 'two'},
                {value: 3, label: 'three'},
                {value: 4, label: 'four'},
                {value: 5, label: 'five'}
            ], /* this is used for the ng-repeat drop down */

            max_wall_length: 800, /* this sets the max size in the range control */
            min_wall_length: 150,  /* this sets the min size in the range control */

            paints:[
                {
                    manufacturer: "dulux",
                    price_bracket: 3,
                    coverage_per_l: 15,
                    recommended_coats:2
                }, {
                    manufacturer: "crown",
                    price_bracket: 2,
                    coverage_per_l: 12,
                    recommended_coats:3
                }
            ],

            faqs:[
                {prompt:"Can you recommend two paints for a bathroom?",
                 answer:"Yeah, we use Dulux and/or Crown"
                },
                {prompt:"How do I get the paint out of the tin onto the wall?",
                 answer:"We find brushes and rollers give a good result"
                }
            ]
        };


        $scope.room = {
            width: null,
            height: null,
            area: null,
            tins: null,
            doors: null
        };
        $scope.paint = {
            coverage: 15,
            tin_size: 2,
            number_of_coats: null
        };

        $scope.calculate = function () {
            /* update the area of the room based upon width and height. */
            let area_of_doors = $scope.room.doors * 1.981 * 0.762;
            $scope.room.area = ($scope.room.width / 100) * $scope.room.height - area_of_doors;
            let total_coverage_per_tin = $scope.paint.coverage * $scope.paint.tin_size;
            $scope.room.tins = ($scope.room.area / total_coverage_per_tin) * $scope.paint.number_of_coats;

            console.log($scope.room);
        }
    }
]);
