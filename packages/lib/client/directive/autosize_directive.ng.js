(function(){
    var directive = function($timeout){

        return {
            restrict: 'A',
            //templateUrl: "sbj_lib_client/directive/thumbnail_directive.ng.html",
            link:function(scope,element,attrs){
                if(element && element[0].tagName === "TEXTAREA" ){
                    function resize(e){
                        var elm = e.currentTarget;
                        var style = elm.style;

                        //debugger;
                        var val = elm.value;
                        var rgx = /\r?\n/g;
                        var lns = 2;
                        if(val !== scope.cch){
                            scope.cch = val;
                            while( rgx.exec(val) ) ++lns;
                            elm.rows = lns;

                            style.height ="auto";
                            style.height = elm.scrollHeight + "px";

                            $timeout(function(){
                                style.height = elm.scrollHeight + "px";
                            });
                        }
                    };
                    element.css("overflow-y","hidden");
                    //element.bind("keydown", resize);
                    //element.bind("keypress", resize);
                    element.bind("keyup", resize);
                }
            },
            //controller:function($scope){
            //    $scope.containerStyle = {
            //        width: $scope.thumbWidth + 'px',
            //        height: $scope.thumbHeight + 'px'
            //    };
            //}
        }

    };
    angular.module('shareBJ.lib')
        .directive("sbjAutosize",directive);
}());
