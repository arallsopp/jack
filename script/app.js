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
                    manufacturer: "Dulux",
                    price_bracket: 3,
                    coverage_per_l: 17,
                    recommended_coats:2
                }, {
                    manufacturer: "Crown",
                    price_bracket: 2,
                    coverage_per_l: 15,
                    recommended_coats:3
                }, {
                    manufacturer: "Farrow and Ball",
                    price_bracket: 5,
                    coverage_per_l: 13,
                    recommended_coats:2
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
            wall_width: null,
            wall_height: null,
            wall_area: null,
            tins: null,
            doors: null,
            windows: null, // number of windows inputted by user
            windows_height: null, // height of window (unsure how to specify which window if there are more than one windows inputted)
            windows_width: null // width of window (unsure how to specify which window if there are more than one windows inputted)
            
        };
        $scope.paint = {
            coverage: 15,
            tin_size:null,
            small_tin_size: 1,
            mid_tin_size: 2.5,
            large_tin_size: 5,
            number_of_coats: null
        };
        
        //let n = $scope.room.windows
        //for (let i=0; i<n; i++) { //attempting to loop over the amount of windows (n) so that we can input info regarding each window (i)
          
          
        //}
        
        $scope.calculate = function () {
            if($scope.user.selected_paint) {
                /* update the area of the room based upon width and height. */
                let area_of_doors = $scope.room.doors * 1.981 * 0.762;
                $scope.room.wall_area = ($scope.room.wall_width / 100) * $scope.room.wall_height - area_of_doors; // minus area of all windows
                var volume_required = $scope.room.wall_area/$scope.user.selected_paint.coverage_per_l; 

                if (volume_required<1) {      //attempting to let the system work out which tin size is best for volume required
                  $scope.paint.tin_size = $scope.user.selected_paint.small_tin_size;
                } else {
                    if (volume_required>1 && volume_required<2.5) {
                      $scope.paint.tin_size = $scope.user.selected_paint.mid_tin_size;
                    } else{
                        $scope.paint.tin_size = $scope.user.selected_paint.large_tin_size;
                    }
                }

                let total_coverage_per_tin = $scope.user.selected_paint.coverage_per_l * $scope.paint.tin_size;
                $scope.paint.number_of_coats = $scope.user.selected_paint.recommended_coats;
                $scope.room.tins = ($scope.room.wall_area / total_coverage_per_tin) * $scope.paint.number_of_coats;
                console.log($scope.room);
            }else{
                console.log("You don't have a paint selected.")
            }
        }
    }
]);
