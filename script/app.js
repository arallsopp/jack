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

            paints:[], //will be loaded from data/stock
            faqs:[]    //will be loaded from data/faqs

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
            $scope.room.wall_width = 400;
            $scope.room.wall_height = 2.1;
            $scope.room.doors = 1;
            $scope.room.windows = 1;

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

        $scope.update_wall_area = function(){
            /* calculate the total wall area, and put it back into the scope.room.wall_area variable.
               you only really need to call it when inputs change
             */
            $scope.room.wall_area = ($scope.room.wall_width / 100) * $scope.room.wall_height;
        };

        $scope.sum_area_of_doors = function(){
            /* return the summed area of all doors in room  */
            return $scope.room.doors * 1.981 * 0.762;
        };

        $scope.sum_area_of_windows = function(){
            /* return the summed area of all windows in room */
            return $scope.room.windows * 0.99 * 0.762; //todo: not all windows are actually the same size.
        };

        $scope.find_tin_combos = function(total_area_required, paint){
            /* a standalone function to work out the best combination of paint sizes.
            *  this is just an example.
            *  It does not consider price at all, and instead just tries to buy the least paint it can.
            */
            console.log('Looking to cover ' + total_area_required + 'm2 with ' + paint.manufacturer + ' using ' + paint.sizes.length + ' sizes');
            let tins_used = [],litres_remaining, litres_required,
                tins_i_can_use;

            litres_required = total_area_required / paint.coverage_per_l;
            litres_remaining = litres_required;

            console.log("  I need " + litres_required + "L of this paint to cover " + total_area_required + "m2");

            //now check the tins to see how to reach that figure
            for(let this_tin = 0;this_tin < paint.sizes.length; this_tin ++) {
                console.log('  Checking tin', paint.sizes[this_tin]);

                tins_i_can_use = Math.floor(litres_remaining / paint.sizes[this_tin].litres);
                for (let i = 1; i <= tins_i_can_use; i++) {
                    console.log('  - Adding ' + paint.sizes[this_tin].litres + 'L tin to my shopping list', paint.sizes[this_tin]);
                    tins_used.push(paint.sizes[this_tin]);
                    litres_remaining = litres_remaining - paint.sizes[this_tin].litres;
                    console.log('    Got', litres_remaining, 'L left to find');
                }
            }
            if(litres_remaining){
                //at this point, you can only need less than the smallest tin, so add the last tin size
                console.log('  Adding the smallest tin I can find to cover the remainder');
                tins_used.push(paint.sizes[paint.sizes.length-1]);
                litres_remaining = litres_remaining - paint.sizes[paint.sizes.length-1].litres;
            }
            console.log('  DONE:',tins_used);
        };

        $scope.test_tin_sizes = function(){
            /* this function quickly tests the tin combo requirements for different manufacturers and amounts.
            * The final call is a torture test designed to trick it into buying two 1L tins, when 1 x 2.5L would be cheaper
            * You are welcome to refactor the find_tin_combos function to avoid this */
            $scope.find_tin_combos(105,$scope.ux.paints[0]);
            $scope.find_tin_combos(46,$scope.ux.paints[1]);
            $scope.find_tin_combos(19,$scope.ux.paints[0]); //torture test designed to make it buy 2 small tins instead

            window.alert('Check the console for your answers');
        };

        $scope.calculate = function () {
            /* Purpose: works out wall sizes, etc. Requires user has chosen a paint */

            // define the variables we are going to use
            let volume_required, total_coverage_per_tin;


            if($scope.user.selected_paint) {

                /* update the area of the room based upon width and height. */
                $scope.update_wall_area();
                debugger;

                $scope.room.painted_wall_area = $scope.room.wall_area - ($scope.sum_area_of_doors() + $scope.sum_area_of_windows()); // minus area of all windows
                volume_required = $scope.room.painted_wall_area/$scope.user.selected_paint.coverage_per_l;

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
