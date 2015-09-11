(function(){
    var directive = function(){
        return {
            restrict: 'E',
            scope:{
                images:'=',
                src:'@',
                start:'@',
                onclose:'&'
            },
            replace:"true",
            templateUrl: "sbj_lib_client/directive/slidebox_directive.ng.html",
            controller:function($scope,$timeout,$ionicSlideBoxDelegate){
                console.log($scope.images);
                $scope.$meteorAutorun(function(){
                    $timeout(function(){
                        $scope.$apply(function(){
                            $scope.slideImages = _.map($scope.getReactively('images'),
                                function(image){
                                    return image[$scope.getReactively('src')];
                                });
                        })
                    })
                });

                if($scope.start)
                {
                    //console.log("start slide #"+$scope.start);
                    if($scope.start < $ionicSlideBoxDelegate.slidesCount())
                    {
                        $ionicSlideBoxDelegate.slide($scope.start);
                    }else{
                        $timeout(function() {
                            $ionicSlideBoxDelegate.slide($scope.start);
                        },100);
                    }
                }
                $scope.closeModal = function(){
                    $scope.onclose();
                };

                $scope.slideHasChanged = function($index){
                    //console.log($index);
                }
            }
        }
    };
    angular.module('shareBJ.lib')
        .directive("sbjSlideBox",directive);
}());
