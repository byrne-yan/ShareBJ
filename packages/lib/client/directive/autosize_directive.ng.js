(function(){
    var directive = function($timeout){

        return {
            restrict: 'A',
            link:function(scope,element,attrs){
                if(element && element[0].tagName === "TEXTAREA" ){
                    function resize(elm){
                        var style = elm.style;

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
                    element.on("keyup", function(e){
                        resize(e.currentTarget)
                    });
                }
            }
        }

    };
    angular.module('shareBJ.lib')
        .directive("sbjAutosize",directive);
}());
