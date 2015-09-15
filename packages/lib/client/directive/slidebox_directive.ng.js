(function(){
    var directive = function(){
        return {
            restrict: 'E',
            scope:{
                images:'=',
                thumb:'@',
                src:'@',
                start:'@',
                onclose:'&'
            },
            replace:"true",
            templateUrl: "sbj_lib_client/directive/slidebox_directive.ng.html",
            controller:function($scope,$timeout,$ionicSlideBoxDelegate){
                $scope.slideImages = new Array($scope.images.length);
                for(var i=0;i<$scope.images.length;++i){
                    $scope.slideImages[i] = {//load thumb first
                        src:$scope.images[i][$scope.thumb],
                        thumb:true
                    };


                    var imgSrc = $scope.images[i][$scope.src];
                    function getImage(img,idx){
                        console.log('getImage:',img);
                        processImage(img,function(data){
                            //console.log(data);
                            $scope.$apply(function() {  //change to original picture
                                console.log("Image loaded:"+idx);
                                $scope.slideImages[idx] = {
                                    src:data,
                                    thumb:false
                                };
                            });
                            $timeout(function(){
                                $ionicSlideBoxDelegate.update();
                            });

                            //if(idx===$ionicSlideBoxDelegate.currentIndex())
                            //{
                            //    $ionicSlideBoxDelegate.update();
                            //}
                        })
                    };
                    getImage(imgSrc,i);
                    //$scope.slideImages[i] = {src:imgSrc,thumb:false};
                };

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
                    console.log($index);
                    //$('.full-slider').trigger('resize');
                }
            }
        }
    };
    angular.module('shareBJ.lib')
        .directive("sbjSlideBox",directive);
}());
