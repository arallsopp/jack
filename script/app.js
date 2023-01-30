/* this version of the script includes Andy's experiments. I'll summarise the changes as I go */

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

            paints:[    //this is only here for reference. The content gets overwritten by the import_stock function
                {
                    manufacturer: "Example",
                    price_bracket: 3,
                    coverage_per_l: 17,
                    recommended_coats:2
                }
            ],

            faqs:[
                {prompt:"Example",
                 answer:"Example"
                }
            ]
        };

        $scope.import_stock = function(){
            $http({
                method: 'GET', // requests a resource from the web
                url: 'data/stock.json' // our stock file in javsacript object notation.
            }).then(function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                $scope.ux.paints = response.data;
                console.log("Imported ", response.data.length, " paints from stock");
            }, function errorCallback(response) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                window.alert('problem loading stock!');
            });
        };

        $scope.import_faqs = function(){
            $http({
                method: 'GET', // requests a resource from the web
                url: 'data/faqs.json' // our faqs file in javsacript object notation.
            }).then(function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                $scope.ux.faqs = response.data;
                console.log("Imported ", response.data.length, " faqs.");
            }, function errorCallback(response) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                window.alert('problem loading faqs!');
            });
        };

        $scope.set_defaults = function(){
            // think about creating some default values here.
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
            /* Purpose: works out wall sizes, etc. Requires user has chosen a paint */

            // define the variables we are going to use
            let area_of_doors = $scope.room.doors * 1.981 * 0.762,
                volume_required, total_coverage_per_tin;


            if($scope.user.selected_paint) {

                /* update the area of the room based upon width and height. */
                $scope.room.wall_area = ($scope.room.wall_width / 100) * $scope.room.wall_height - area_of_doors; // minus area of all windows
                volume_required = $scope.room.wall_area/$scope.user.selected_paint.coverage_per_l;

                //attempting to let the system work out which tin size is best for volume required
                if (volume_required < 1) {
                    $scope.paint.tin_size = $scope.user.selected_paint.small_tin_size;
                } else if (volume_required < 2.5) { //if it were smaller than 1, it'd be in the first if block.
                    $scope.paint.tin_size = $scope.user.selected_paint.mid_tin_size;
                } else {
                    $scope.paint.tin_size = $scope.user.selected_paint.large_tin_size;
                }

                total_coverage_per_tin = $scope.user.selected_paint.coverage_per_l * $scope.paint.tin_size;
                $scope.paint.number_of_coats = $scope.user.selected_paint.recommended_coats;
                $scope.room.tins = ($scope.room.wall_area / total_coverage_per_tin) * $scope.paint.number_of_coats;

                console.log($scope.room);
            }else{
                console.log("You don't have a paint selected."); //calculation is pointless.
            }
        };


        $scope.import_stock();
        $scope.import_faqs();
        $scope.set_defaults();


    }
]);
