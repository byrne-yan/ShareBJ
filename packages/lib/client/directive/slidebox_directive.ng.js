(function(){
    var directive = function(){
        return {
            restrict: 'E',
            scope:{
                images:'=',
                thumb:'@',
                src:'@',
                start:'@',
                orientationFix:'@',
                onclose:'&'
            },
            replace:"true",
            templateUrl: "sbj_lib_client/directive/slidebox_directive.ng.html",
            link: function(scope,element,attrs){
              element.bind()
            },
            controller:function($scope,$timeout,$ionicSlideBoxDelegate){
                $scope.slideImages = new Array($scope.images.length);
                for(var i=0;i<$scope.images.length;++i){
                    $scope.slideImages[i] = {//load thumb first
                        src:$scope.images[i][$scope.thumb],
                        thumb:true
                    };

                    var imgSrc = $scope.images[i][$scope.src];
                    if($scope.orientationFix){
                        function getImage(img,idx){
                            console.log('getImage:',img);
                            processImage(img,function(data){
                                //console.log(data);
                                //$scope.$apply(function() {  //change to original picture
                                    console.log("Image loaded:"+idx);
                                    $scope.slideImages[idx] = {
                                        src:data,
                                        thumb:false
                                    };
                                //});
                                //$timeout(function(){
                                    $ionicSlideBoxDelegate.update();
                                //});
                            })
                        };
                        getImage(imgSrc,i);
                    }else{
                        $scope.slideImages[i] = {
                            src:imgSrc,
                            thumb:false
                        };
                    }
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
                    //console.log($index);
                };
                $scope.deleteImage = function(e){
                    console.log("try to delete image #" + $ionicSlideBoxDelegate.currentIndex());
                    var count = $ionicSlideBoxDelegate.slidesCount();
                    var idx = $ionicSlideBoxDelegate.currentIndex();
                    if(idx>0 && idx===count-1)//last one slide delete
                    {
                        $ionicSlideBoxDelegate.previous()//slide to previous
                    }
                    $ionicSlideBoxDelegate.enableSlide(false);
                    $scope.images.splice(idx,1);
                    $scope.slideImages.splice(idx,1);
                    if($scope.slideImages.length<=0)//no slide left
                        $scope.closeModal();
                    else{
                        $ionicSlideBoxDelegate.update();
                        if(idx===count-1)//last one slide delete
                            $ionicSlideBoxDelegate.slide(idx-1);
                        else
                            $ionicSlideBoxDelegate.slide(idx);
                        $ionicSlideBoxDelegate.enableSlide(true);
                    }
                }
            }
        }
    };
    angular.module('shareBJ.lib')
        .directive("sbjSlideBox",directive);
}());
